import api from "../../../services/api";

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  project?: {
    _id: string;
    projectName: string;
  };
  link?:string
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
}

export const getMyNotifications = async (
  page = 1,
  limit = 10
): Promise<NotificationsResponse> => {
  const response = await api.get("/notifications", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const response = await api.get(
      "/notifications/unread-count"
    );

    return response.data.data.count;
  };

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data.data;
};

export const markAllNotificationsAsRead =
  async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  };