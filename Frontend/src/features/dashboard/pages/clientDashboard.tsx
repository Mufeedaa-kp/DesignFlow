import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Palette,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";

import { useMyProjects } from "../../projects/hooks/useProjects";

import type {
  IProjectResponse,
  IProjectSourceRequest,
} from "../../projects/types/project.types";

import { useMyProjectRequests } from "../../projectRequests/hooks/useClientProjectRequests";

import {
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../../notifications/hooks/useNotifications";

import type { Notification } from "../../notifications/services/notification.api";

const getProjectTitle = (
  source: IProjectSourceRequest | string | undefined
) => {
  if (!source || typeof source === "string") {
    return "Design project";
  }

  if (source.projectName?.trim()) {
    return source.projectName;
  }

  const { roomType, customRoomType } = source.roomInfo ?? {};

  if (roomType === "other" && customRoomType) {
    return customRoomType;
  }

  return roomType ?? "Design project";
};

const getProjectImage = (
  source: IProjectSourceRequest | string | undefined
) => {
  if (!source || typeof source === "string") {
    return "";
  }

  if (
    source.catalogItem &&
    typeof source.catalogItem !== "string" &&
    source.catalogItem.image
  ) {
    return source.catalogItem.image;
  }

  if (
    source.category &&
    typeof source.category !== "string" &&
    source.category.image
  ) {
    return source.category.image;
  }

  return source.images?.[0] ?? "";
};

const statusSteps: Record<string, number> = {
  planning: 1,
  in_progress: 2,
  completed: 3,
};

const statusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "In progress",
  completed: "Completed",
};

const statusStyles: Record<string, string> = {
  planning: "bg-amber/15 text-clay",
  in_progress: "bg-clay/15 text-clay",
  completed: "bg-emerald-500/10 text-emerald-700",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatRelativeTime = (value: string) => {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const difference = Date.now() - timestamp;
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
};

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || value <= 0) {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const StatCard = ({
  label,
  value,
  detail,
  icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent: string;
}) => (
  <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          {label}
        </p>
        <p className="mt-2 font-serif text-3xl font-bold text-charcoal">
          {value}
        </p>
      </div>

      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        {icon}
      </span>
    </div>

    <p className="mt-3 text-xs text-muted">{detail}</p>
  </div>
);

const ProjectRow = ({ project }: { project: IProjectResponse }) => {
  const source = project.sourceRequest;
  const image = getProjectImage(source);
  const designer =
    typeof project.designer === "string" ? null : project.designer;
  const step = statusSteps[project.status] ?? 1;

  return (
    <Link
      to={`/client/projects/${project._id}`}
      className="group flex flex-col gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-panel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 sm:flex-row sm:items-center"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-panel">
        {image ? (
          <img
            src={image}
            alt={getProjectTitle(source)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-olive/15 to-clay/15">
            <Palette size={20} className="text-clay" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-charcoal">
            {getProjectTitle(source)}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              statusStyles[project.status] ?? "bg-panel text-muted"
            }`}
          >
            {statusLabels[project.status] ?? project.status}
          </span>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <UserRound size={12} />
          {designer?.fullName ?? "Designer assignment pending"}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          {[1, 2, 3].map((stage) => (
            <span
              key={stage}
              className={`h-1.5 flex-1 rounded-full ${
                stage <= step ? "bg-clay" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <span className="flex items-center gap-1 text-xs font-medium text-muted transition-colors group-hover:text-clay">
        View
        <ArrowUpRight size={14} />
      </span>
    </Link>
  );
};

const NotificationRow = ({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    className="flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-panel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
  >
    <span
      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        notification.isRead
          ? "bg-panel text-muted"
          : "bg-amber/15 text-clay"
      }`}
    >
      <Bell size={14} />
    </span>

    <span className="min-w-0 flex-1">
      <span className="flex items-start gap-2">
        <span className="line-clamp-1 flex-1 text-xs font-semibold text-charcoal">
          {notification.title}
        </span>
        {!notification.isRead && (
          <span
            aria-label="Unread"
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
          />
        )}
      </span>

      <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted">
        {notification.message}
      </span>

      <span className="mt-1 block text-[10px] uppercase tracking-wide text-muted">
        {formatRelativeTime(notification.createdAt)}
      </span>
    </span>
  </button>
);

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useMyProjects();

  const {
    data: pendingData,
    isLoading: pendingLoading,
    isError: pendingError,
  } = useMyProjectRequests(1, 3, "", "pending");

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useNotifications(1, 4);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const markNotificationAsRead = useMarkNotificationAsRead();

  const allProjects = projects ?? [];
  const activeProjects = allProjects.filter(
    (project) => project.status !== "completed"
  );
  const completedProjects = allProjects.filter(
    (project) => project.status === "completed"
  );
  const pendingRequests = pendingData?.requests ?? [];
  const pendingRequestsTotal = pendingData?.pagination?.total ?? 0;

  const recentProjects = [...allProjects]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime()
    )
    .slice(0, 3);

  const recentNotifications = [...(notificationsData?.notifications ?? [])]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    )
    .slice(0, 4);

  const handleNotificationOpen = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead.mutate(notification._id);
    }

    navigate(notification.link || "/notifications");
  };

  const firstName = user?.fullName?.trim().split(" ")[0] || "there";

  const nextStep =
    pendingRequestsTotal > 0
      ? {
          label: "Your request is being reviewed",
          detail: `${pendingRequestsTotal} request${
            pendingRequestsTotal > 1 ? "s" : ""
          } waiting for approval`,
          to: "/client/requests",
          action: "View requests",
        }
      : activeProjects.length > 0
        ? {
            label: "Your project is moving forward",
            detail: "Open your latest project for the newest updates",
            to: `/client/projects/${recentProjects[0]?._id ?? ""}`,
            action: "Open project",
          }
        : completedProjects.length > 0
          ? {
              label: "Ready for your next space?",
              detail: "Your completed projects are saved in your workspace",
              to: "/client/requests/new",
              action: "Start a project",
            }
          : {
              label: "Let's shape your first space",
              detail: "Share your requirements and we'll match you with a designer",
              to: "/client/requests/new",
              action: "Submit a request",
            };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">
            <Sparkles size={12} />
            Your design workspace
          </p>

          <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Here is what is happening across your requests and projects.
          </p>
        </div>

        <Link
          to="/client/requests/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-5 py-3 text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 focus-visible:ring-offset-2 sm:w-auto"
        >
          <Plus size={15} />
          New project request
        </Link>
      </header>

      <section
        aria-label="Workspace overview"
        className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Pending requests"
          value={pendingLoading ? "—" : String(pendingRequestsTotal)}
          detail="Awaiting studio review"
          icon={<ClipboardList size={18} />}
          accent="bg-amber/15 text-clay"
        />

        <StatCard
          label="Active projects"
          value={projectsLoading ? "—" : String(activeProjects.length)}
          detail="Currently in the studio"
          icon={<FolderKanban size={18} />}
          accent="bg-clay/10 text-clay"
        />

        <StatCard
          label="Completed"
          value={projectsLoading ? "—" : String(completedProjects.length)}
          detail="Spaces brought to life"
          icon={<CheckCircle2 size={18} />}
          accent="bg-emerald-500/10 text-emerald-700"
        />

        <StatCard
          label="Unread updates"
          value={String(unreadCount)}
          detail="Messages and project activity"
          icon={<Bell size={18} />}
          accent="bg-panel text-charcoal"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">
                Your projects
              </h2>
              <p className="mt-1 text-xs text-muted">
                A quick view of your most recently updated work.
              </p>
            </div>

            <Link
              to="/client/projects"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-clay hover:text-ember focus-visible:outline-none focus-visible:underline"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          {projectsLoading && (
            <div className="space-y-3" aria-label="Loading projects">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl bg-panel/70"
                />
              ))}
            </div>
          )}

          {!projectsLoading && projectsError && (
            <div className="rounded-xl border border-border bg-panel/40 p-6 text-center">
              <p className="text-sm text-muted">
                We couldn't load your projects right now.
              </p>
              <Link
                to="/client/projects"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-clay hover:underline"
              >
                Try the projects page
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {!projectsLoading && !projectsError && recentProjects.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-panel/30 px-6 py-10 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-clay shadow-sm">
                <Palette size={19} />
              </span>
              <p className="mt-4 font-serif text-lg font-bold text-charcoal">
                No projects yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">
                Once your request is approved, your project and designer will
                appear here.
              </p>
              <Link
                to="/client/requests/new"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-clay hover:underline"
              >
                Submit your first request
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {!projectsLoading && !projectsError && recentProjects.length > 0 && (
            <div className="divide-y divide-border/70">
              {recentProjects.map((project) => (
                <ProjectRow key={project._id} project={project} />
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">
                Recent activity
              </h2>
              <p className="mt-1 text-xs text-muted">
                Updates from your studio.
              </p>
            </div>

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-panel text-clay">
              <Bell size={16} />
            </span>
          </div>

          {notificationsLoading && (
            <div className="space-y-3" aria-label="Loading notifications">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-panel/70"
                />
              ))}
            </div>
          )}

          {!notificationsLoading && notificationsError && (
            <p className="rounded-xl bg-panel/40 p-4 text-xs text-muted">
              We couldn't load your activity right now.
            </p>
          )}

          {!notificationsLoading &&
            !notificationsError &&
            recentNotifications.length === 0 && (
              <div className="rounded-xl bg-panel/40 px-4 py-8 text-center">
                <Bell size={18} className="mx-auto text-muted" />
                <p className="mt-2 text-xs text-muted">
                  No activity yet. Updates will appear here.
                </p>
              </div>
            )}

          {!notificationsLoading &&
            !notificationsError &&
            recentNotifications.length > 0 && (
              <>
                <div className="-mx-1 divide-y divide-border/60">
                  {recentNotifications.map((notification) => (
                    <NotificationRow
                      key={notification._id}
                      notification={notification}
                      onOpen={() => handleNotificationOpen(notification)}
                    />
                  ))}
                </div>

                <Link
                  to="/notifications"
                  className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-panel/60 px-3 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
                >
                  See all notifications
                  <ArrowRight size={13} />
                </Link>
              </>
            )}
        </aside>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">
                Pending requests
              </h2>
              <p className="mt-1 text-xs text-muted">
                Requests waiting for the studio's review.
              </p>
            </div>

            <Link
              to="/client/requests"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-clay hover:text-ember focus-visible:outline-none focus-visible:underline"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          {pendingLoading && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl bg-panel/70"
                />
              ))}
            </div>
          )}

          {!pendingLoading && pendingError && (
            <p className="rounded-xl bg-panel/40 p-4 text-xs text-muted">
              We couldn't load your pending requests right now.
            </p>
          )}

          {!pendingLoading && !pendingError && pendingRequests.length === 0 && (
            <div className="rounded-xl bg-panel/40 px-5 py-8 text-center">
              <CheckCircle2 size={18} className="mx-auto text-olive" />
              <p className="mt-2 text-sm font-medium text-charcoal">
                You're all caught up
              </p>
              <p className="mt-1 text-xs text-muted">
                There are no requests waiting for approval.
              </p>
            </div>
          )}

          {!pendingLoading && !pendingError && pendingRequests.length > 0 && (
            <div className="space-y-3">
              {pendingRequests.map((request) => {
                const category =
                  typeof request.category === "object"
                    ? request.category
                    : undefined;
                const catalogItem =
                  typeof request.catalogItem === "object"
                    ? request.catalogItem
                    : undefined;
                const title =
                  request.projectName?.trim() ||
                  catalogItem?.name ||
                  category?.name ||
                  "Project request";
                const room =
                  request.roomInfo?.roomType === "other"
                    ? request.roomInfo.customRoomType
                    : request.roomInfo?.roomType;
                const budget = formatCurrency(request.estimatedTotal);

                return (
                  <Link
                    key={request._id}
                    to={`/client/requests/${request._id}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/80 p-3 transition-colors hover:border-clay/30 hover:bg-panel/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-clay">
                      <ClipboardList size={16} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-charcoal">
                        {title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {room ? `${room} · ` : ""}Submitted{" "}
                        {formatDate(request.createdAt)}
                        {budget ? ` · ${budget}` : ""}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-clay">
                      Pending
                      <ArrowUpRight
                        size={11}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-clay/20 bg-charcoal p-6 text-cream shadow-sm lg:col-span-5">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-clay/30 blur-2xl"
          />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/60">
              Next step
            </p>
            <h2 className="mt-2 max-w-sm font-serif text-2xl font-bold leading-tight">
              {nextStep.label}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-cream/70">
              {nextStep.detail}
            </p>

            <Link
              to={nextStep.to}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cream px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              {nextStep.action}
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientDashboard;
