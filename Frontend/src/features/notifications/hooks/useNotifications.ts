import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

// Get notifications
export const useNotifications = (
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () =>
      getMyNotifications(page, limit),
  });
};

// Get unread notification count
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey:
      notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
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