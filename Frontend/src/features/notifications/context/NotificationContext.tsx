import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import api, { API_BASE_URL } from "../../../services/api";
import { useAppSelector } from "../../../store/hooks";

import {
  NotificationContext,
  type Notification,
} from "./notificationContextValue";

import { notificationKeys } from "../hooks/useNotifications";

const openNotificationStream = (
  token: string,
  signal: AbortSignal
) =>
  fetch(`${API_BASE_URL}/notifications/stream`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    credentials: "include",
    signal,
  });

const isAccessTokenExpired = (
  token: string
) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return true;
    }

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      Math.ceil(normalized.length / 4) * 4,
      "="
    );

    const decoded = JSON.parse(atob(padded)) as {
      exp?: number;
    };

    return (
      typeof decoded.exp !== "number" ||
      decoded.exp * 1000 <= Date.now() + 5000
    );
  } catch {
    return true;
  }
};

const refreshAccessToken = async (
  signal: AbortSignal
) => {
  const response = await api.post(
    "/auth/refresh",
    undefined,
    { signal }
  );

  const token =
    response.data?.data?.accessToken;

  if (typeof token !== "string" || !token) {
    throw new Error(
      "Refresh response did not include an access token"
    );
  }

  localStorage.setItem(
    "designflow_token",
    token
  );

  return token;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [latestNotification, setLatestNotification] =
    useState<Notification | null>(null);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const queryClient = useQueryClient();

  const authToken = useAppSelector(
    (state) => state.auth.token
  );

  useEffect(() => {
    const connectSSE = async () => {
      let token =
        localStorage.getItem(
          "designflow_token"
        ) ?? authToken;

      if (!token) {
        return;
      }

      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        if (isAccessTokenExpired(token)) {
          try {
            token = await refreshAccessToken(
              controller.signal
            );
          } catch {
            if (!controller.signal.aborted) {
              console.warn(
                "Notification stream paused: session refresh failed."
              );
            }

            return;
          }
        }

        if (controller.signal.aborted) {
          return;
        }

        let response = await openNotificationStream(
          token,
          controller.signal
        );

        if (response.status === 401) {
          let refreshedToken: string;

          try {
            refreshedToken =
              await refreshAccessToken(
                controller.signal
              );
          } catch {
            if (!controller.signal.aborted) {
              console.warn(
                "Notification stream paused: session refresh failed."
              );
            }

            return;
          }

          if (controller.signal.aborted) {
            return;
          }

          response = await openNotificationStream(
            refreshedToken,
            controller.signal
          );
        }

        if (!response.ok) {
          if (response.status === 401) {
            console.warn(
              "Notification stream paused: sign in again to receive live updates."
            );

            return;
          }

          throw new Error(
            `SSE connection failed: ${response.status}`
          );
        }

        if (!response.body) {
          throw new Error(
            "SSE response body is not available"
          );
        }

        const reader =
          response.body.getReader();

        const decoder = new TextDecoder();

        let buffer = "";

        while (true) {
          const { value, done } =
            await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, {
            stream: true,
          });

          const events = buffer.split("\n\n");

          buffer = events.pop() || "";

          for (const event of events) {
            const dataLine = event
              .split("\n")
              .find((line) =>
                line.startsWith("data:")
              );

            if (!dataLine) {
              continue;
            }

            const data = dataLine
              .replace(/^data:\s*/, "")
              .trim();

            if (!data) {
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              if (
                parsed.type === "NOTIFICATION" &&
                parsed.notification
              ) {
                const notification =
                  parsed.notification as Notification;

                // Store the latest notification
                setLatestNotification(
                  notification
                );

                // Refresh notification queries
                // Refresh notification list and unread count
queryClient.invalidateQueries({
  queryKey: notificationKeys.all,
});

queryClient.invalidateQueries({
  queryKey: notificationKeys.unreadCount(),
});
              }
            } catch (error) {
              console.error(
                "Failed to parse SSE data:",
                error
              );
            }
          }
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Notification SSE error:",
          error
        );
      }
    };

    connectSSE();

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [authToken, queryClient]);

  const clearLatestNotification = () => {
    setLatestNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        latestNotification,
        clearLatestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};