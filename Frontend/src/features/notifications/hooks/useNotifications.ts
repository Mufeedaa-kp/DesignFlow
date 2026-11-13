import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAppSelector } from "../../../store/hooks";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.api";

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,

  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", page, limit] as const,

  unreadCount: () =>
    [...notificationKeys.all, "unread-count"] as const,
};

// True when the user has a login token (same sources as NotificationContext)
const useHasAuthToken = () => {
  const reduxToken = useAppSelector((state) => state.auth.token);

  return !!(localStorage.getItem("designflow_token") ?? reduxToken);
};

// Get notifications
export const useNotifications = (
  page = 1,
  limit = 10
) => {
  const hasToken = useHasAuthToken();

  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () =>
      getMyNotifications(page, limit),
    enabled: hasToken,
  });
};

// Get unread notification count
export const useUnreadNotificationCount = () => {
  const hasToken = useHasAuthToken();

  return useQuery({
    queryKey:
      notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled: hasToken,
  });
};

// Mark one notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};