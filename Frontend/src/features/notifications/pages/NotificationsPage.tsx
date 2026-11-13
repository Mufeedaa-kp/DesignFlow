import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";
import { getErrorMessage } from "../../../shared/utils/errors";


const NotificationsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useNotifications(page, limit);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;

  const handleNotificationClick = (
    notificationId: string,
    isRead: boolean,
    link?: string
  ) => {
    if (!isRead) {
      markAsRead.mutate(notificationId, {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      });
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
        toast.success("All notifications marked as read");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <>
     

      <section className="section">
        <div className="container-page">
          <div className="mb-6 flex items-center justify-end">
            {notifications.some((notification) => !notification.isRead) && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isPending}
                className="border border-[var(--color-brown)] px-5 py-2 text-xs uppercase tracking-wide text-[var(--color-brown)] hover:bg-[var(--color-brown)] hover:text-cream disabled:opacity-50 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading && (
            <div className="rounded-xl border border-border bg-[var(--color-surface)] p-8 text-center text-sm text-muted">
              Loading notifications...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-border bg-[var(--color-surface)] p-8 text-center text-sm text-red-600">
              Failed to load notifications.
            </div>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <div className="rounded-xl border border-border bg-[var(--color-surface)] p-10 text-center">
              <p className="text-sm text-muted">
                No notifications yet. Updates about your requests and projects will appear here.
              </p>
            </div>
          )}

          {!isLoading && !isError && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
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
                  className="w-full rounded-xl border border-border px-5 py-4 text-left transition-colors hover:bg-panel bg-[var(--color-surface)]"
                >
                  <div className="flex gap-3">
                    <div className="pt-2">
                      <span
                        className={`block h-2 w-2 rounded-full ${
                          !notification.isRead ? "bg-amber" : "bg-transparent"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-medium text-charcoal">
                          {notification.title}
                        </p>
                        <span className="shrink-0 text-xs text-muted">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {notification.message}
                      </p>
                      {notification.project && (
                        <p className="mt-2 text-xs font-medium text-clay">
                          {notification.project.projectName}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-md border border-border px-4 py-2 text-sm text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1)
                  )
                }
                className="rounded-md border border-border px-4 py-2 text-sm text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NotificationsPage;
