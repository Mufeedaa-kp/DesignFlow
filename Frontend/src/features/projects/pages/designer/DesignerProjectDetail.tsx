import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useProjectById,
  useAcceptAssignment,
  useRejectAssignment,
  useUpdateProjectStatus,
} from "../../hooks/useProjects";

import { useQuotationByProject } from "../../../quotations/hooks/useQuotations";

import { useDesignerMoodBoard } from "../../../moodboards/hooks/useMoodBoards";

import type {
  IProjectSourceRequest,
  ProjectStatus,
} from "../../types/project.types";

const quotationStatusLabels: Record<string, string> = {
  draft: "Draft",
  pending_admin_approval: "Pending Admin Approval",
  approved: "Approved",
  rejected: "Rejected",
  accepted: "Accepted",
};

const moodBoardStatusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Ready for Review",
  changes_requested: "Changes Requested",
  approved: "Approved",
};

const formatMoney = (amount?: number) => {
  if (amount === undefined || amount === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <div className="flex justify-between gap-4 py-2 border-b border-border last:border-b-0">
    <span className="text-xs text-muted">{label}</span>

    <span className="text-sm text-charcoal text-right">
      {value ?? "—"}
    </span>
  </div>
);

const PROJECT_STATUS_OPTIONS: {
  value: ProjectStatus;
  label: string;
}[] = [
  {
    value: "planning",
    label: "Planning",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-amber/15 text-amber",
  in_progress: "bg-clay/15 text-clay",
  completed: "bg-emerald-500/15 text-emerald-600",
};


const DesignerProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading,
    isError,
  } = useProjectById(id);

  const acceptAssignment = useAcceptAssignment();
  const rejectAssignment = useRejectAssignment();
  const updateStatus = useUpdateProjectStatus();

  const { data: quotation } = useQuotationByProject(
    id || ""
  );

  const { data: moodBoard } = useDesignerMoodBoard(
    id || ""
  );

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [isRejecting, setIsRejecting] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted">
          Loading project...
        </p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">
          Failed to load project details.
        </p>
      </div>
    );
  }

  const sourceRequest: IProjectSourceRequest | undefined =
    typeof project.sourceRequest === "object"
      ? project.sourceRequest
      : undefined;

  const client =
    typeof project.client === "object"
      ? project.client
      : undefined;

  const handleAcceptAssignment = async () => {
    try {
      await acceptAssignment.mutateAsync(project._id);

      toast.success("Assignment accepted");
    } catch (error) {
      console.error(
        "Failed to accept assignment:",
        error
      );

      toast.error("Couldn't accept assignment");
    }
  };

  const handleRejectAssignment = async () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      return;
    }

    try {
      await rejectAssignment.mutateAsync({
        id: project._id,
        reason,
      });

      setIsRejecting(false);
      setRejectionReason("");

      toast.success("Assignment rejected");
    } catch (error) {
      console.error(
        "Failed to reject assignment:",
        error
      );

      toast.error("Couldn't reject assignment");
    }
  };

  const handleStatusChange = (
    newStatus: ProjectStatus
  ) => {
    if (newStatus === project.status) {
      return;
    }

    updateStatus.mutate(
      {
        id: project._id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast.success("Project status updated");
        },
        onError: () => {
          toast.error("Couldn't update project status");
        },
      }
    );
  };

  const currentStatusIndex =
    PROJECT_STATUS_OPTIONS.findIndex(
      (option) => option.value === project.status
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/designer/projects"
          className="text-xs text-muted hover:text-charcoal transition-colors"
        >
          ← Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide font-semibold">
              Project Details
            </p>

            <h1 className="text-2xl font-semibold text-charcoal mt-2">
              {sourceRequest?.projectName || "Project"}
            </h1>

            <p className="text-sm text-muted mt-1">
              Created{" "}
              {new Date(
                project.createdAt
              ).toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Project Status */}
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold">
              Project Status
            </p>

            <div className="relative inline-block">
              {project.status === "completed" ? (
                <span
                  className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                    statusStyles[project.status]
                  }`}
                >
                  Completed
                </span>
              ) : (
                <select
                  value={project.status}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value as ProjectStatus
                    )
                  }
                  disabled={updateStatus.isPending}
                  className={`appearance-none text-xs font-semibold pl-3 pr-8 py-1.5 rounded-full border-none outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    statusStyles[project.status]
                  }`}
                >
                  {PROJECT_STATUS_OPTIONS.map(
                    (option, index) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={
                          index < currentStatusIndex
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              )}

              {project.status !== "completed" && (
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="9"
                  height="9"
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
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {project.designerStatus === "pending" && (
                <span className="px-3 py-1.5 rounded-full bg-amber/10 text-xs font-medium text-amber">
                  Assignment Pending
                </span>
              )}

              {project.designerStatus === "accepted" && (
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-600">
                  Assignment Accepted
                </span>
              )}

              {project.designerStatus === "rejected" && (
                <span className="px-3 py-1.5 rounded-full bg-red-50 text-xs font-medium text-red-500">
                  Assignment Rejected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Actions */}
      {project.designerStatus === "pending" && (
        <div className="bg-cream border border-border rounded-lg p-6 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Designer Assignment
          </p>

          <p className="text-sm text-charcoal mb-5">
            This project has been assigned to you.
            Accept the assignment to start working on
            the project.
          </p>

          {!isRejecting ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAcceptAssignment}
                disabled={
                  acceptAssignment.isPending
                }
                className="px-5 py-2.5 rounded-md bg-charcoal text-cream text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors disabled:opacity-50"
              >
                {acceptAssignment.isPending
                  ? "Accepting..."
                  : "Accept Assignment"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsRejecting(true)
                }
                className="px-5 py-2.5 rounded-md border border-border text-charcoal text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
              >
                Reject Assignment
              </button>
            </div>
          ) : (
            <div className="max-w-xl">
              <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                Rejection Reason
              </label>

              <textarea
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Please provide a reason for rejecting this assignment..."
                className="w-full border border-border rounded-md bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-charcoal resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleRejectAssignment}
                  disabled={
                    rejectAssignment.isPending ||
                    !rejectionReason.trim()
                  }
                  className="px-5 py-2.5 rounded-md bg-red-500 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {rejectAssignment.isPending
                    ? "Rejecting..."
                    : "Confirm Rejection"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectionReason("");
                  }}
                  className="px-5 py-2.5 rounded-md border border-border text-charcoal text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Client Information */}
      <div className="bg-cream border border-border rounded-lg p-8 mb-6">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-5">
          Client Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <InfoRow
            label="Name"
            value={
              client?.fullName ||
              sourceRequest?.personalInfo?.fullName
            }
          />

          <InfoRow
            label="Email"
            value={
              client?.email ||
              sourceRequest?.personalInfo?.email
            }
          />

          <InfoRow
            label="Phone"
            value={
              client?.phone ||
              sourceRequest?.personalInfo?.phone
            }
          />

          <InfoRow
            label="Address"
            value={
              client?.address ||
              sourceRequest?.personalInfo?.address
            }
          />
        </div>
      </div>

{/* Quotation */}
<div className="bg-cream border border-border rounded-lg p-8 mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
        Quotation
      </p>

      {quotation ? (
        <>
          <p className="text-sm text-charcoal">
            {quotationStatusLabels[quotation.status] ??
              quotation.status}
          </p>

          <p className="text-lg font-semibold text-charcoal mt-2">
            {formatMoney(quotation.total)}
          </p>
        </>
      ) : (
        <p className="text-sm text-muted">
          Create a quotation for this project.
        </p>
      )}
    </div>

    {quotation ? (
      <Link
        to={`/designer/projects/${project._id}/quotation`}
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
      >
        View Quotation
      </Link>
    ) : project.designerStatus === "accepted" ? (
      <Link
        to={`/designer/projects/${project._id}/quotation`}
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
      >
        Create Quotation
      </Link>
    ) : (
      <button
        type="button"
        disabled
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-gray-200 text-gray-400 cursor-not-allowed"
      >
        Create Quotation
      </button>
    )}
  </div>
</div>


{/* Mood Board Creation */}
<div className="bg-cream border border-border rounded-lg p-8 mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
        Mood Board
      </p>

      {moodBoard ? (
        <>
          <p className="text-sm text-charcoal">
            {moodBoardStatusLabels[moodBoard.status] ??
              moodBoard.status}
          </p>

          {moodBoard.versions?.length > 0 && (
            <p className="text-xs text-muted mt-1">
              {moodBoard.versions.length} version
              {moodBoard.versions.length !== 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : quotation?.status === "client_accepted" ? (
        <p className="text-sm text-charcoal">
          The quotation has been accepted. You can now create
          the mood board.
        </p>
      ) : (
        <p className="text-sm text-muted">
          The client must accept the quotation before you can
          create a mood board.
        </p>
      )}
    </div>

    {moodBoard ? (
      <Link
        to={`/designer/moodboards/${project._id}`}
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
      >
        View Mood Board
      </Link>
    ) : quotation?.status === "client_accepted" ? (
      <Link
        to={`/designer/moodboards/${project._id}`}
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
      >
        Create Mood Board
      </Link>
    ) : (
      <button
        type="button"
        disabled
        className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-gray-200 text-gray-400 cursor-not-allowed"
      >
        Create Mood Board
      </button>
    )}
  </div>
</div>


      {/* Project Details */}
      <div className="bg-cream border border-border rounded-lg p-8 mb-6">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-5">
          Project Details
        </p>

        <div>
          <InfoRow
            label="Category"
            value={
              typeof sourceRequest?.category ===
              "object"
                ? sourceRequest.category.name
                : sourceRequest?.category
            }
          />

          <InfoRow
            label="Catalog Item"
            value={
              typeof sourceRequest?.catalogItem ===
              "object"
                ? sourceRequest.catalogItem.name
                : sourceRequest?.catalogItem
            }
          />

          <InfoRow
            label="Need By"
            value={
              sourceRequest?.needBy
                ? new Date(
                    sourceRequest.needBy
                  ).toLocaleDateString("en-IN")
                : undefined
            }
          />

          <InfoRow
            label="Estimated Total"
            value={formatMoney(
              sourceRequest?.estimatedTotal
            )}
          />

          <InfoRow
            label="Description"
            value={sourceRequest?.description}
          />
        </div>
      </div>

{/* Selected Options */}
{((sourceRequest?.materials?.length ?? 0) > 0 ||
  (sourceRequest?.colorThemes?.length ?? 0) > 0) && (
  <div className="bg-cream border border-border rounded-lg p-8 mb-6">
    <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-5">
      Selected Options
    </p>

    <div className="space-y-5">
      {sourceRequest?.materials &&
        sourceRequest.materials.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-3">
              Materials
            </p>

            <div className="flex flex-wrap gap-2">
              {sourceRequest.materials.map(
                (material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border border-border rounded-md text-xs text-charcoal"
                  >
                    {typeof material === "object"
                      ? material.name
                      : material}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {sourceRequest?.colorThemes &&
        sourceRequest.colorThemes.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-3">
              Color Themes
            </p>

            <div className="flex flex-wrap gap-2">
              {sourceRequest.colorThemes.map(
                (theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border border-border rounded-md text-xs text-charcoal"
                  >
                    {typeof theme === "object"
                      ? theme.name
                      : theme}
                  </span>
                )
              )}
            </div>
          </div>
        )}
    </div>
  </div>
)}

      {/* Measurements */}
      {sourceRequest?.measurements && (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-5">
            Measurements
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-md p-4">
              <p className="text-xs text-muted">
                Height
              </p>

              <p className="text-sm font-medium text-charcoal mt-1">
                {sourceRequest.measurements.height}
              </p>
            </div>

            <div className="bg-white border border-border rounded-md p-4">
              <p className="text-xs text-muted">
                Width
              </p>

              <p className="text-sm font-medium text-charcoal mt-1">
                {sourceRequest.measurements.width}
              </p>
            </div>

            <div className="bg-white border border-border rounded-md p-4">
              <p className="text-xs text-muted">
                Square Feet
              </p>

              <p className="text-sm font-medium text-charcoal mt-1">
                {sourceRequest.measurements.squareFeet}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Requirements */}
      {(sourceRequest?.roomInfo ||
        sourceRequest?.additionalNotes) && (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-5">
            Requirements
          </p>

          {sourceRequest.roomInfo && (
            <div className="mb-5">
              <InfoRow
                label="Room Type"
                value={
                  sourceRequest.roomInfo
                    .customRoomType ||
                  sourceRequest.roomInfo.roomType
                }
              />

              <InfoRow
                label="Total Area"
                value={
                  sourceRequest.roomInfo.totalArea
                    ? `${sourceRequest.roomInfo.totalArea} sq.ft`
                    : undefined
                }
              />

              <InfoRow
                label="Preferred Style"
                value={
                  sourceRequest.roomInfo
                    .customStyle ||
                  sourceRequest.roomInfo.preferredStyle
                }
              />

              <InfoRow
                label="Budget"
                value={
                  sourceRequest.roomInfo.budgetRange
                }
              />

              <InfoRow
                label="Timeline"
                value={
                  sourceRequest.roomInfo
                    .customTimelineDate ||
                  sourceRequest.roomInfo
                    .preferredTimeline
                }
              />
            </div>
          )}

          {sourceRequest.additionalNotes && (
            <div>
              <p className="text-xs text-muted mb-2">
                Additional Notes
              </p>

              <p className="text-sm text-charcoal leading-6">
                {sourceRequest.additionalNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reference Images */}
      {sourceRequest?.referenceImages?.length ? (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
            Reference Images
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sourceRequest.referenceImages.map(
              (image, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className="aspect-square overflow-hidden rounded-md border border-border bg-white"
                >
                  <img
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

     
      {sourceRequest?.images?.length ? (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
            Reference Images
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sourceRequest.images.map(
              (image, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className="aspect-square overflow-hidden rounded-md border border-border bg-white"
                >
                  <img
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

      {/* Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setSelectedImage(null)
              }
              className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300"
            >
              Close
            </button>

            <img
              src={selectedImage}
              alt="Reference preview"
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerProjectDetail;