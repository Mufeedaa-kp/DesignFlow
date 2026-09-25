import { Link, useParams } from "react-router-dom";
import { useProjectById } from "../../hooks/useProjects";
import { useQuotationByProject } from "../../../quotations/hooks/useQuotations";
import { useClientMoodBoard } from "../../../moodboards/hooks/useMoodBoards";

const ClientProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading,
    isError,
  } = useProjectById(id);

  const { data: quotation } = useQuotationByProject(
    id || "",
    Boolean(id)
  );

const { data: moodBoard } = useClientMoodBoard(
  id || ""
);


  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-muted">
          Loading project...
        </p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-red-600">
          Project not found.
        </p>

        <Link
          to="/client/dashboard"
          className="mt-4 inline-block text-sm font-medium text-clay hover:text-ember"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const sourceRequest =
    typeof project.sourceRequest === "string"
      ? undefined
      : project.sourceRequest;

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

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <Link
          to="/client/projects"
          className="text-xs font-medium text-muted hover:text-charcoal"
        >
          ← Back to Projects
        </Link>

        <h1 className="mt-3 text-lg font-semibold text-charcoal sm:text-xl">
          {sourceRequest?.projectName || "Project"}
        </h1>

        <p className="mt-1 text-sm text-muted">
          View your project details and quotation.
        </p>
      </div>

      {/* Project Preview */}
      <div className="overflow-hidden rounded-xl border border-border bg-cream">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="h-40 bg-panel sm:h-48 md:h-56">
            {projectImage ? (
              <img
                src={projectImage}
                alt={
                  sourceRequest?.projectName ||
                  "Project"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No image available
              </div>
            )}
          </div>

          {/* Basic Design Info */}
          <div className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Design
            </p>

            <h2 className="mt-1 text-base font-semibold text-charcoal sm:text-lg">
              {catalogItem?.name ||
                category?.name ||
                "Custom Design"}
            </h2>

            {catalogItem?.description && (
              <p className="mt-2 text-sm leading-6 text-muted">
                {catalogItem.description}
              </p>
            )}

            {sourceRequest?.measurements && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
                <div className="rounded-md bg-panel p-3">
                  <p className="text-[10px] uppercase text-muted">
                    Height
                  </p>

                  <p className="mt-1 text-sm font-medium text-charcoal">
                    {sourceRequest.measurements.height}
                  </p>
                </div>

                <div className="rounded-md bg-panel p-3">
                  <p className="text-[10px] uppercase text-muted">
                    Width
                  </p>

                  <p className="mt-1 text-sm font-medium text-charcoal">
                    {sourceRequest.measurements.width}
                  </p>
                </div>

                <div className="rounded-md bg-panel p-3">
                  <p className="text-[10px] uppercase text-muted">
                    Sq.ft
                  </p>

                  <p className="mt-1 text-sm font-medium text-charcoal">
                    {sourceRequest.measurements.squareFeet}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Project Status
            </p>

            <p className="mt-1 text-sm text-charcoal">
              {statusLabels[project.status] ||
                project.status}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Designer Status
            </p>

            <p className="mt-1 text-sm text-charcoal">
              {designerStatusLabels[
                project.designerStatus
              ] || project.designerStatus}
            </p>
          </div>

          {typeof project.designer !== "string" &&
            project.designer && (
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Designer
                </p>

                <p className="mt-1 truncate text-sm text-charcoal">
                  {project.designer.fullName}
                </p>

                <p className="mt-1 break-all text-xs text-muted">
                  {project.designer.email}
                </p>
              </div>
            )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Created
            </p>

            <p className="mt-1 text-sm text-charcoal">
              {new Date(
                project.createdAt
              ).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Quotation & Mood Board */}
      <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Project Documents
            </p>

            <p className="mt-1 text-sm text-charcoal">
              View your quotation and Mood Board.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {quotationSent ? (
              <Link
                to={`/client/projects/${project._id}/quotation`}
                className="w-full rounded-md bg-clay px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-ember sm:w-auto"
              >
                View Quotation
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-md bg-panel px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted sm:w-auto"
              >
                View Quotation
              </button>
            )}

            {moodBoardSent ? (
              <Link
                to={`/client/projects/${project._id}/mood-board`}
                className="w-full rounded-md bg-clay px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-ember sm:w-auto"
              >
                View Mood Board
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-md bg-panel px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted sm:w-auto"
              >
                View Mood Board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProjectDetail;