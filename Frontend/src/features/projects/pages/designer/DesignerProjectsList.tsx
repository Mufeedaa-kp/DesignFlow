import { useState } from "react";
import { Link } from "react-router-dom";

import { useMyAssignedProjects } from "../../hooks/useProjects";

import type {
  IProjectSourceRequest,
} from "../../types/project.types";

import { useSearch } from "../../../../shared/context/SearchContext";

const getProjectDisplay = (
  source: IProjectSourceRequest | null
) => {
  if (!source) return "Project";

  // New project request
  if (source.projectName) {
    return source.projectName;
  }

  // Fallback to catalog item name
  if (source.catalogItem) {
    if (typeof source.catalogItem === "string") {
      return "Project";
    }

    return source.catalogItem.name;
  }

  // Legacy request fallback
  if (source.roomInfo) {
    const { roomType, customRoomType } = source.roomInfo;

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
  if (!source?.catalogItem) return null;

  if (typeof source.catalogItem === "string") {
    return null;
  }

  return source.catalogItem.name;
};

const getCategoryDisplay = (
  source: IProjectSourceRequest | null
) => {
  if (!source?.category) return null;

  if (typeof source.category === "string") {
    return null;
  }

  return source.category.name;
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

const statusStyles: Record<string, string> = {
  planning: "bg-amber/15 text-amber",
  in_progress: "bg-clay/15 text-clay",
  completed: "bg-emerald-500/15 text-emerald-600",
};

const StatusPill = ({
  status,
}: {
  status: string;
}) => {
  const label =
    status === "in_progress"
      ? "In Progress"
      : status === "completed"
        ? "Completed"
        : "Planning";

  return (
    <span
      className={`inline-flex text-xs font-semibold px-2.5 py-1.5 rounded-full ${
        statusStyles[status] ??
        "bg-panel text-muted"
      }`}
    >
      {label}
    </span>
  );
};

const DesignerProjectsList = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useMyAssignedProjects();

  const { searchQuery } = useSearch();

  const [statusFilter, setStatusFilter] = useState("");

  const accepted = (projects ?? []).filter(
    (project) =>
      project.designerStatus === "accepted"
  );

  const filteredProjects = accepted.filter(
    (project) => {
      if (
        statusFilter &&
        project.status !== statusFilter
      ) {
        return false;
      }

      if (!searchQuery) return true;

      const client =
        typeof project.client === "string"
          ? null
          : project.client;

      const source =
        typeof project.sourceRequest === "string"
          ? null
          : project.sourceRequest;

      const projectName =
        getProjectDisplay(source);

      const designName =
        getDesignDisplay(source);

      const categoryName =
        getCategoryDisplay(source);

      const query =
        searchQuery.toLowerCase();

      return (
        client?.fullName
          ?.toLowerCase()
          .includes(query) ||
        projectName
          .toLowerCase()
          .includes(query) ||
        designName
          ?.toLowerCase()
          .includes(query) ||
        categoryName
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div className="max-w-6xl mx-auto">
      <p className="font-serif font-bold text-3xl text-charcoal mb-1">
        My Projects
      </p>

      <p className="text-sm text-muted mb-6">
        Projects you've accepted and are working on.
      </p>

      {/* Status Filters */}
      <div className="relative mb-6">
        <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setStatusFilter(tab.value)
              }
              className={`px-2.5 sm:px-4 py-3 text-[11px] sm:text-xs uppercase tracking-wide font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0 ${
                statusFilter === tab.value
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

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-muted">
          Loading projects...
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="text-sm text-ember">
          Couldn't load your projects. Try again.
        </p>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        filteredProjects.length === 0 && (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="font-serif text-xl text-charcoal mb-2">
              {searchQuery || statusFilter
                ? "No projects match"
                : "No projects yet"}
            </p>

            <p className="text-sm text-muted">
              {searchQuery || statusFilter
                ? "Try a different filter or search term."
                : "Accepted assignments will show up here."}
            </p>
          </div>
        )}

      {/* Projects */}
      {!isLoading &&
        !isError &&
        filteredProjects.length > 0 && (
          <>
            {/* Desktop / Tablet */}
            <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="border-b border-border bg-panel/30">
                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Room Type
                    </th>

                    <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">
                      Client
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

                      const source =
                        typeof project.sourceRequest ===
                        "string"
                          ? null
                          : project.sourceRequest;

                      const projectName =
                        getProjectDisplay(source);

                      const designName =
                        getDesignDisplay(source);

                      return (
                        <tr
                          key={project._id}
                          className="border-b border-border last:border-0 bg-cream"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">
                            <div>
                              <p>
                                {projectName}
                              </p>

                              {designName && (
                                <p className="text-xs text-muted mt-0.5">
                                  Design:{" "}
                                  {designName}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {client?.fullName ??
                              "Unknown client"}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <StatusPill
                              status={
                                project.status
                              }
                            />
                          </td>

                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {new Date(
                              project.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <Link
                              to={`/designer/projects/${project._id}`}
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

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {filteredProjects.map(
                (project) => {
                  const client =
                    typeof project.client ===
                    "string"
                      ? null
                      : project.client;

                  const source =
                    typeof project.sourceRequest ===
                    "string"
                      ? null
                      : project.sourceRequest;

                  const projectName =
                    getProjectDisplay(source);

                  const designName =
                    getDesignDisplay(source);

                  return (
                    <div
                      key={project._id}
                      className="bg-cream border border-border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {projectName}
                          </p>

                          {designName && (
                            <p className="text-xs text-muted">
                              Design:{" "}
                              {designName}
                            </p>
                          )}

                          <p className="text-xs text-muted mt-0.5">
                            {client?.fullName ??
                              "Unknown client"}
                          </p>
                        </div>

                        <StatusPill
                          status={
                            project.status
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-muted">
                          {new Date(
                            project.createdAt
                          ).toLocaleDateString()}
                        </span>

                        <Link
                          to={`/designer/projects/${project._id}`}
                          className="text-xs px-3 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
    </div>
  );
};

export default DesignerProjectsList;