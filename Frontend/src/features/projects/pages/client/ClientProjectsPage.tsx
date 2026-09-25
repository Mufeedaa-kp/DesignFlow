import { Link } from "react-router-dom";

import { useMyProjects } from "../../hooks/useProjects";
import { useQuotationByProject } from "../../../quotations/hooks/useQuotations";
import { useClientMoodBoard } from "../../../moodboards/hooks/useMoodBoards";

import type { IProjectResponse } from "../../types/project.types";

const statusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  completed: "Completed",
};

const designerStatusLabels: Record<string, string> = {
  unassigned: "Not Assigned",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

interface ClientProjectCardProps {
  project: IProjectResponse;
}

const ClientProjectCard = ({
  project,
}: ClientProjectCardProps) => {
  const { data: quotation } = useQuotationByProject(
    project._id,
    true
  );

  const { data: moodBoard } = useClientMoodBoard(
    project._id
  );

  const quotationSent =
    quotation &&
    [
      "sent",
      "client_accepted",
      "client_rejected",
    ].includes(quotation.status);

  const moodBoardSent =
    moodBoard &&
    ["submitted", "approved"].includes(
      moodBoard.status
    );

  const sourceRequest =
    typeof project.sourceRequest === "string"
      ? undefined
      : project.sourceRequest;

  const designer =
    typeof project.designer === "string"
      ? undefined
      : project.designer;

  const catalogItem =
    typeof sourceRequest?.catalogItem === "string"
      ? undefined
      : sourceRequest?.catalogItem;

  const category =
    typeof sourceRequest?.category === "string"
      ? undefined
      : sourceRequest?.category;

  const projectImage =
    catalogItem?.image ||
    category?.image ||
    null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-cream shadow-sm transition-shadow hover:shadow-md">
      {/* Project Image */}
      <Link to={`/client/projects/${project._id}`}>
        <div className="h-36 w-full overflow-hidden bg-panel sm:h-40">
          {projectImage ? (
            <img
              src={projectImage}
              alt={
                sourceRequest?.projectName ||
                "Project"
              }
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              No image available
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-charcoal">
              {sourceRequest?.projectName ||
                "Project"}
            </h2>

            <p className="mt-1 text-xs text-muted">
              Created{" "}
              {new Date(
                project.createdAt
              ).toLocaleDateString("en-IN")}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-panel px-2.5 py-1 text-[10px] font-medium text-muted">
            {statusLabels[project.status] ||
              project.status}
          </span>
        </div>

        {/* Project Info */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted">
              Designer
            </span>

            <span className="truncate text-right text-xs font-medium text-charcoal">
              {designer?.fullName ||
                "Not assigned"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted">
              Assignment
            </span>

            <span className="text-right text-xs font-medium text-charcoal">
              {designerStatusLabels[
                project.designerStatus
              ] || project.designerStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-border pt-4 sm:grid-cols-2">
          <Link
            to={`/client/projects/${project._id}`}
            className="rounded-md border border-border px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal transition-colors hover:bg-panel"
          >
            View Project
          </Link>

          {quotationSent ? (
            <Link
              to={`/client/projects/${project._id}/quotation`}
              className="rounded-md bg-clay px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-ember"
            >
              View Quotation
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md bg-panel px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted"
            >
              View Quotation
            </button>
          )}

          {moodBoardSent ? (
            <Link
              to={`/client/moodboards/${project._id}`}
              className="rounded-md border border-[#D9C7A3] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#8B5E3C] transition hover:bg-[#F8F6F2]"
            >
              View Mood Board
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md bg-panel px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted"
            >
              View Mood Board
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ClientProjectsPage = () => {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useMyProjects();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-muted">
          Loading projects...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-red-600">
          Failed to load projects.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg font-semibold text-charcoal sm:text-xl">
          My Projects
        </h1>

        <p className="mt-1 text-sm text-muted">
          View your approved and ongoing projects.
        </p>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="rounded-lg border border-border bg-cream p-6 text-center sm:p-8">
          <p className="text-sm text-muted">
            No projects available yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ClientProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjectsPage;