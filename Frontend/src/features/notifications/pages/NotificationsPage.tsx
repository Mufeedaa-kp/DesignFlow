import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const limit = 10;

  const {
    data,
    isLoading,
    isError,
  } = useNotifications(page, limit);

  const markAsRead =
    useMarkNotificationAsRead();

  const markAllAsRead =
    useMarkAllNotificationsAsRead();

  const notifications =
    data?.notifications ?? [];

  const pagination = data?.pagination;

const handleNotificationClick = (
  notificationId: string,
  isRead: boolean,
  link?: string
) => {
  if (!isRead) {
    markAsRead.mutate(notificationId);
  }

  if (link) {
    navigate(link);
  }
};

  const handleMarkAllAsRead = () => {
    if (!notifications.some((item) => !item.isRead)) {
      return;
    }

    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        toast.success(
          "All notifications marked as read"
        );
      },
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <button
  type="button"
  onClick={() => navigate(-1)}
  className="mb-6 text-sm text-muted transition-colors hover:text-charcoal"
>
  ← Back
</button>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-muted">
              Stay updated with your projects and
              activities.
            </p>
          </div>

          {notifications.some(
            (notification) => !notification.isRead
          ) && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={
                markAllAsRead.isPending
              }
              className="text-sm font-medium text-clay hover:underline disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-xl border border-border bg-cream p-8 text-center text-sm text-muted">
            Loading notifications...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-border bg-cream p-8 text-center text-sm text-red-500">
            Failed to load notifications.
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          notifications.length === 0 && (
            <div className="rounded-xl border border-border bg-cream p-10 text-center">
              <p className="text-sm text-muted">
                You don't have any notifications yet.
              </p>
            </div>
          )}

        {/* Notification list */}
        {!isLoading &&
          !isError &&
          notifications.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-cream">
              {notifications.map(
                (notification) => (
                  <button
                    key={notification._id}
                    type="button"
                   onClick={() =>
  handleNotificationClick(
    notification._id,
    notification.isRead,
    notification.link
  )
}
                    className={`w-full border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-panel ${
                      !notification.isRead
                        ? "bg-panel/60"
                        : "bg-cream"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Unread indicator */}
                      <div className="pt-2">
                        <span
                          className={`block h-2.5 w-2.5 rounded-full ${
                            !notification.isRead
                              ? "bg-ember"
                              : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-medium text-charcoal">
                            {notification.title}
                          </p>

                          <span className="shrink-0 text-xs text-muted">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-muted">
                          {notification.message}
                        </p>

                        {notification.project && (
                          <p className="mt-2 text-xs font-medium text-clay">
                            {
                              notification
                                .project
                                .projectName
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          )}

        {/* Pagination */}
        {pagination &&
          pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="rounded-md border border-border px-4 py-2 text-sm text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-muted">
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >= pagination.totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      pagination.totalPages,
                      current + 1
                    )
                  )
                }
                className="rounded-md border border-border px-4 py-2 text-sm text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default NotificationsPage;