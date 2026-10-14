import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  NotificationContext,
  type Notification,
} from "./notificationContextValue";

import { notificationKeys } from "../hooks/useNotifications";

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

  useEffect(() => {
    const connectSSE = async () => {
      const token = localStorage.getItem(
        "designflow_token"
      );

      if (!token) {
        return;
      }

      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        const response = await fetch(
          "https://design-flow.online/api/notifications/stream",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "text/event-stream",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
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
  }, [queryClient]);

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
