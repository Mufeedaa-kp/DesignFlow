import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAllProjects,
  useAssignDesigner,
} from "../../hooks/useProjects";
import type { IProjectSourceRequest } from "../../types/project.types";
import { useSearch } from "../../../../shared/context/SearchContext";
import { useAllUsers } from "../../../users/hooks/useUsers";
import toast from "react-hot-toast";

const getProjectDisplay = (
  source: IProjectSourceRequest | null
) => {
  if (!source) return "Project";

  // New project request
  if (source.projectName) {
    return source.projectName;
  }

  if (source.catalogItem) {
    if (typeof source.catalogItem === "string") {
      return source.catalogItem;
    }

    return source.catalogItem.name;
  }


  if (source.roomInfo) {
    const {
      roomType,
      customRoomType,
    } = source.roomInfo;

    if (roomType === "other" && customRoomType) {
      return customRoomType;
    }

    return roomType ?? "Project";
  }

  return "Project";
};

const getDesignDisplay = (
  source: IProjectSourceRequest | null
) => {
  if (!source?.catalogItem) {
    return "—";
  }

  if (typeof source.catalogItem === "string") {
    return source.catalogItem;
  }

  return source.catalogItem.name;
};

const STATUS_TABS: {
  value: string;
  label: string;
}[] = [
  { value: "", label: "All" },
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const statusDotColors: Record<string, string> = {
  planning: "bg-amber",
  in_progress: "bg-clay",
  completed: "bg-emerald-500",
};

const statusTextColors: Record<string, string> = {
  planning: "text-amber",
  in_progress: "text-clay",
  completed: "text-emerald-600",
};

const ChevronIcon = () => (
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2.5 4.5L6 8L9.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const selectClass =
  "appearance-none bg-cream border border-border rounded-md text-sm text-charcoal " +
  "pl-3 pr-9 py-2.5 cursor-pointer focus:outline-none focus:border-amber " +
  "hover:border-amber/60 transition-colors";

const AdminProjectsList = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sort, setSort] =
    useState<"newest" | "oldest">("newest");
  const [dateRange, setDateRange] = useState("all");

  const {
    data,
    isLoading,
    isError,
  } = useAllProjects(
    page,
    status || undefined,
    sort,
    dateRange
  );

  const { searchQuery } = useSearch();

  const [reassigningId, setReassigningId] =
    useState<string | null>(null);

  const [selectedDesignerId, setSelectedDesignerId] =
    useState("");

  const assignDesigner = useAssignDesigner();

  const { data: designersData } =
    useAllUsers(1, "designer");

  const designers =
    designersData?.users ?? [];

  const handleAssignDesigner = (
    projectId: string
  ) => {
    if (!selectedDesignerId) return;

    assignDesigner.mutate(
      {
        id: projectId,
        designerId: selectedDesignerId,
      },
      {
        onSuccess: () => {
          toast.success("Designer assigned");

          setReassigningId(null);
          setSelectedDesignerId("");
        },

        onError: () =>
          toast.error(
            "Couldn't assign designer"
          ),
      }
    );
  };

  const filteredProjects = (
    data?.projects ?? []
  ).filter((project) => {
    if (!searchQuery) return true;

    const client =
      typeof project.client === "string"
        ? null
        : project.client;

    const designer =
      typeof project.designer === "string"
        ? null
        : project.designer;

    const source =
      typeof project.sourceRequest === "string"
        ? null
        : (project.sourceRequest as IProjectSourceRequest);

    const projectName =
      source?.projectName?.toLowerCase() ?? "";

    const designName =
      getDesignDisplay(source).toLowerCase();

    const categoryName =
      source?.category
        ? typeof source.category === "string"
          ? source.category.toLowerCase()
          : source.category.name.toLowerCase()
        : "";

    const legacyRoomType =
      source?.roomInfo?.roomType?.toLowerCase() ??
      "";

    const query =
      searchQuery.toLowerCase();

    return (
      client?.fullName
        ?.toLowerCase()
        .includes(query) ||
      designer?.fullName
        ?.toLowerCase()
        .includes(query) ||
      projectName.includes(query) ||
      designName.includes(query) ||
      categoryName.includes(query) ||
      legacyRoomType.includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <p className="font-serif font-bold text-3xl text-charcoal mb-1">
        Projects
      </p>

      <p className="text-sm text-muted mb-6">
        All active and completed client projects.
      </p>

      <div className="relative mb-6">
        <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`px-2.5 sm:px-4 py-3 text-[11px] sm:text-xs uppercase tracking-wide font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0 ${
                status === tab.value
                  ? "border-clay text-charcoal"
                  : "border-transparent text-muted hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-cream to-transparent" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(
                e.target.value as
                  | "newest"
                  | "oldest"
              );
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>

          <ChevronIcon />
        </div>

        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">
              All Time
            </option>

            <option value="this_month">
              This Month
            </option>

            <option value="last_month">
              Last Month
            </option>

            <option value="this_year">
              This Year
            </option>
          </select>

          <ChevronIcon />
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted">
          Loading projects...
        </p>
      )}

      {isError && (
        <p className="text-sm text-ember">
          Couldn't load projects. Try again.
        </p>
      )}

      {!isLoading &&
        !isError &&
        data &&
        filteredProjects.length === 0 && (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="font-serif text-xl text-charcoal mb-2">
              {searchQuery
                ? "No projects match your search"
                : "No projects yet"}
            </p>

            <p className="text-sm text-muted">
              {searchQuery
                ? "Try a different name, design, or category."
                : "Projects are created automatically when a project request is approved."}
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        data &&
        filteredProjects.length > 0 && (
          <>
            {/* Desktop / tablet table view */}

            <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-left border-collapse min-w-180">
                <thead>
                  <tr className="border-b border-border bg-panel/30">
                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Project
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Client
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Designer
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Assignment
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-center">
                      Status
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Created
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map(
                    (project) => {
                      const client =
                        typeof project.client ===
                        "string"
                          ? null
                          : project.client;

                      const designer =
                        typeof project.designer ===
                        "string"
                          ? null
                          : project.designer;

                      const source =
                        typeof project.sourceRequest ===
                        "string"
                          ? null
                          : (project.sourceRequest as IProjectSourceRequest);

                      return (
                        <tr
                          key={project._id}
                          className="border-b border-border last:border-0 bg-cream"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">
                            <div>
                              <p>
                                {getProjectDisplay(
                                  source
                                )}
                              </p>

                              {source?.catalogItem && (
                                <p className="text-xs text-muted font-normal mt-0.5">
                                  Design:{" "}
                                  {getDesignDisplay(
                                    source
                                  )}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {client?.fullName ??
                              "Unknown client"}
                          </td>

                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {designer ? (
                              <div className="flex items-center gap-1.5">
                                <span>
                                  {designer.fullName}
                                </span>

                                {project.designerStatus ===
                                  "pending" && (
                                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber/15 text-amber">
                                    Pending
                                  </span>
                                )}
                              </div>
                            ) : (
                              "Not assigned"
                            )}
                          </td>

                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            {reassigningId ===
                            project._id ? (
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={
                                    selectedDesignerId
                                  }
                                  onChange={(e) =>
                                    setSelectedDesignerId(
                                      e.target.value
                                    )
                                  }
                                  className="text-xs border border-border rounded-md px-2 py-1.5 bg-white text-charcoal cursor-pointer"
                                >
                                  <option value="">
                                    Select designer
                                  </option>

                                  {designers.map(
                                    (d) => (
                                      <option
                                        key={d._id}
                                        value={d._id}
                                      >
                                        {d.fullName}
                                      </option>
                                    )
                                  )}
                                </select>

                                <button
                                  onClick={() =>
                                    handleAssignDesigner(
                                      project._id
                                    )
                                  }
                                  disabled={
                                    !selectedDesignerId ||
                                    assignDesigner.isPending
                                  }
                                  className="text-xs px-2.5 py-1.5 rounded-md bg-clay text-cream hover:bg-ember transition-colors disabled:opacity-60"
                                >
                                  {assignDesigner.isPending
                                    ? "..."
                                    : "Assign"}
                                </button>

                                <button
                                  onClick={() => {
                                    setReassigningId(
                                      null
                                    );
                                    setSelectedDesignerId(
                                      ""
                                    );
                                  }}
                                  className="text-xs text-muted hover:text-charcoal"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : project.designerStatus ===
                              "rejected" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-600">
                                  Rejected
                                </span>

                                <button
                                  onClick={() =>
                                    setReassigningId(
                                      project._id
                                    )
                                  }
                                  className="text-xs px-2.5 py-1 rounded-md bg-panel text-charcoal hover:bg-border transition-colors whitespace-nowrap"
                                >
                                  Reassign
                                </button>
                              </div>
                            ) : !designer ? (
                              <button
                                onClick={() =>
                                  setReassigningId(
                                    project._id
                                  )
                                }
                                className="text-xs px-2.5 py-1 rounded-md bg-panel text-charcoal hover:bg-border transition-colors whitespace-nowrap"
                              >
                                Assign
                              </button>
                            ) : project.designerStatus ===
                              "accepted" ? (
                              <span className="text-xs text-emerald-600 font-medium">
                                Assigned
                              </span>
                            ) : (
                              <span className="text-xs text-muted">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  statusDotColors[
                                    project.status
                                  ] ??
                                  "bg-muted"
                                }`}
                              />

                              <span
                                className={
                                  statusTextColors[
                                    project.status
                                  ] ??
                                  "text-muted"
                                }
                              >
                                {project.status.replace(
                                  "_",
                                  " "
                                )}
                              </span>
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {new Date(
                              project.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <Link
                              to={`/admin/projects/${project._id}`}
                              className="text-xs px-3 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked card view */}

            <div className="md:hidden space-y-3">
              {filteredProjects.map(
                (project) => {
                  const client =
                    typeof project.client ===
                    "string"
                      ? null
                      : project.client;

                  const designer =
                    typeof project.designer ===
                    "string"
                      ? null
                      : project.designer;

                  const source =
                    typeof project.sourceRequest ===
                    "string"
                      ? null
                      : (project.sourceRequest as IProjectSourceRequest);

                  return (
                    <div
                      key={project._id}
                      className="bg-cream border border-border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {getProjectDisplay(
                              source
                            )}
                          </p>

                          {source?.catalogItem && (
                            <p className="text-xs text-muted">
                              {getDesignDisplay(
                                source
                              )}
                            </p>
                          )}

                          <p className="text-xs text-muted">
                            {client?.fullName ??
                              "Unknown client"}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize shrink-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusDotColors[
                                project.status
                              ] ??
                              "bg-muted"
                            }`}
                          />

                          <span
                            className={
                              statusTextColors[
                                project.status
                              ] ??
                              "text-muted"
                            }
                          >
                            {project.status.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted mb-3">
                        <div className="flex items-center gap-1.5">
                          <span>
                            Designer:
                          </span>

                          {designer ? (
                            <span className="text-charcoal">
                              {designer.fullName}
                            </span>
                          ) : (
                            <span>
                              Not assigned
                            </span>
                          )}

                          {designer &&
                            project.designerStatus ===
                              "pending" && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber/15 text-amber">
                                Pending
                              </span>
                            )}
                        </div>

                        <span>
                          {new Date(
                            project.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {reassigningId ===
                      project._id ? (
                        <div className="flex flex-col gap-2 pt-3 border-t border-border">
                          <select
                            value={
                              selectedDesignerId
                            }
                            onChange={(e) =>
                              setSelectedDesignerId(
                                e.target.value
                              )
                            }
                            className="text-xs border border-border rounded-md px-2 py-1.5 bg-white text-charcoal cursor-pointer"
                          >
                            <option value="">
                              Select designer
                            </option>

                            {designers.map(
                              (d) => (
                                <option
                                  key={d._id}
                                  value={d._id}
                                >
                                  {d.fullName}
                                </option>
                              )
                            )}
                          </select>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAssignDesigner(
                                  project._id
                                )
                              }
                              disabled={
                                !selectedDesignerId ||
                                assignDesigner.isPending
                              }
                              className="flex-1 text-xs px-2.5 py-1.5 rounded-md bg-clay text-cream hover:bg-ember transition-colors disabled:opacity-60"
                            >
                              {assignDesigner.isPending
                                ? "..."
                                : "Assign"}
                            </button>

                            <button
                              onClick={() => {
                                setReassigningId(
                                  null
                                );

                                setSelectedDesignerId(
                                  ""
                                );
                              }}
                              className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-border text-charcoal hover:bg-panel transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                          {project.designerStatus ===
                          "rejected" ? (
                            <button
                              onClick={() =>
                                setReassigningId(
                                  project._id
                                )
                              }
                              className="flex-1 text-xs px-2.5 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                            >
                              Reassign designer
                            </button>
                          ) : !designer ? (
                            <button
                              onClick={() =>
                                setReassigningId(
                                  project._id
                                )
                              }
                              className="flex-1 text-xs px-2.5 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                            >
                              Assign designer
                            </button>
                          ) : null}

                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="flex-1 text-center text-xs px-3 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {data.pagination.totalPages >
              1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  disabled={page === 1}
                  className="text-sm text-muted hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <p className="text-xs text-muted">
                  Page {data.pagination.page} of{" "}
                  {data.pagination.totalPages}
                </p>

                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(
                        data.pagination.totalPages,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    page ===
                    data.pagination.totalPages
                  }
                  className="text-sm text-muted hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default AdminProjectsList;