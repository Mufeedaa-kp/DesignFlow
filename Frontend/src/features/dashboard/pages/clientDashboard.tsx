import { Link } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";

import { useMyProjects } from "../../projects/hooks/useProjects";

import {
  
  type IProjectResponse,
  type IProjectSourceRequest,
} from "../../projects/types/project.types";

import { useMyProjectRequests } from "../../projectRequests/hooks/useClientProjectRequests";

const getProjectTitle = (
  source: IProjectSourceRequest | string | undefined
) => {
  if (!source || typeof source === "string") {
    return "Project";
  }

  const { roomType, customRoomType } =
    source.roomInfo ?? {};

  if (
    roomType === "other" &&
    customRoomType
  ) {
    return customRoomType;
  }

  return roomType ?? "Project";
};

const statusProgress: Record<string, number> = {
  planning: 15,
  in_progress: 60,
  completed: 100,
};

const statusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "Production",
  completed: "Completed",
};

const statusStyles: Record<string, string> = {
  planning: "bg-amber/15 text-clay",
  in_progress: "bg-amber/15 text-clay",
  completed:
    "bg-emerald-500/15 text-emerald-600",
};

const ProjectCard = ({
  project,
}: {
  project: IProjectResponse;
}) => {
  const source = project.sourceRequest;

  const designer =
    typeof project.designer === "string"
      ? null
      : project.designer;

  const progress =
    statusProgress[project.status] ?? 0;

  return (
    <Link
      to={`/client/projects/${project._id}`}
      className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-32 overflow-hidden bg-panel">
  {source &&
  typeof source !== "string" &&
  source.catalogItem &&
  typeof source.catalogItem !== "string" &&
  source.catalogItem.image ? (
    <img
      src={source.catalogItem.image}
      alt={source.catalogItem.name}
      className="h-full w-full object-cover"
    />
  ) : source &&
    typeof source !== "string" &&
    source.category &&
    typeof source.category !== "string" &&
    source.category.image ? (
    <img
      src={source.category.image}
      alt={source.category.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-linear-to-br from-olive/15 to-clay/15">
      <span className="text-xs text-muted">
        No image
      </span>
    </div>
  )}
</div>

      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-charcoal">
            {getProjectTitle(source)}
          </p>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              statusStyles[project.status] ??
              "bg-panel text-muted"
            }`}
          >
            {statusLabels[project.status] ??
              project.status}
          </span>
        </div>

        <p className="mb-3 text-xs text-muted">
          Designer:{" "}
          {designer?.fullName ??
            "Not yet assigned"}
        </p>

        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>Progress</span>

          <span className="font-medium text-charcoal">
            {progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-clay"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
};

const ClientDashboard = () => {
  const { user } = useAuth();

  const {
    data: projects,
    isLoading: projectsLoading,
  } = useMyProjects();

  const {
    data: requestsData,
    isLoading: requestsLoading,
  } = useMyProjectRequests(1, 10);

  const pendingRequests =
    requestsData?.requests.filter(
      (request) =>
        request.status === "pending"
    ) ?? [];

  const activeProjects =
    projects?.filter(
      (project) =>
        project.status !== "completed"
    ) ?? [];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-1 font-serif text-2xl font-bold text-charcoal sm:text-3xl">
          Welcome back,{" "}
          {user?.fullName?.split(" ")[0]}!
        </h1>

        <p className="text-sm text-muted">
          Track your requests and see how
          your projects are coming along.
        </p>

        <Link
          to="/client/requests/new"
          className="mt-4 inline-block w-full rounded-md bg-clay px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-ember sm:w-auto"
        >
          + Submit a request
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending Requests",
            value: requestsLoading
              ? "—"
              : String(
                  pendingRequests.length
                ),
          },
          {
            label: "Active Projects",
            value: projectsLoading
              ? "—"
              : String(
                  activeProjects.length
                ),
          },
          {
            label: "Upcoming Meetings",
            value: "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="mb-1 font-serif text-3xl font-bold text-charcoal">
              {stat.value}
            </p>

            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* My Projects */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-charcoal sm:text-xl">
            My projects
          </h2>

          <Link
            to="/client/projects"
            className="text-xs font-medium text-amber underline underline-offset-2"
          >
            View all
          </Link>
        </div>

        {projectsLoading && (
          <p className="text-sm text-muted">
            Loading projects...
          </p>
        )}

        {!projectsLoading &&
          projects &&
          projects.length === 0 && (
            <p className="text-sm text-muted">
              No projects yet.
            </p>
          )}

        {!projectsLoading &&
          projects &&
          projects.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">  
              {projects
                .slice(0, 2)
                .map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                  />
                ))}
            </div>
          )}
      </div>

      {/* Pending Requests */}
      <div>
        <h2 className="mb-4 font-serif text-lg font-bold text-charcoal sm:text-xl">
          Pending requests
        </h2>

        {requestsLoading && (
          <p className="text-sm text-muted">
            Loading requests...
          </p>
        )}

        {!requestsLoading &&
          pendingRequests.length === 0 && (
            <p className="text-sm text-muted">
              No pending requests.
            </p>
          )}

        {!requestsLoading &&
          pendingRequests.map((request) => {
            const category =
              typeof request.category ===
              "object"
                ? request.category
                : undefined;

            const catalogItem =
              typeof request.catalogItem ===
              "object"
                ? request.catalogItem
                : undefined;

            const title =
              catalogItem?.name ??
              category?.name ??
              "Project Request";

            return (
              <Link
                key={request._id}
                to={`/client/requests/${request._id}`}
                className="mb-3 flex flex-col gap-2 rounded-xl border border-border bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {title}
                  </p>

                  <p className="text-xs text-muted">
                    Submitted{" "}
                    {new Date(
                      request.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-clay">
                  Pending
                </span>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default ClientDashboard;