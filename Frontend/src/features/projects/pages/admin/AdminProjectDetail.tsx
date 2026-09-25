import { useParams, Link } from "react-router-dom";
import {
  useProjectById,
  useAssignDesigner,
} from "../../hooks/useProjects";

import type {
  IProjectSourceRequest,
} from "../../types/project.types";

import { useQuotationByProject } from "../../../quotations/hooks/useQuotations";
import { useAdminMoodBoard } from "../../../moodboards/hooks/useMoodBoards";

import toast from "react-hot-toast";
import { useState, type ReactNode } from "react";
import { useAllUsers } from "../../../users/hooks/useUsers";

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-border last:border-0">
    <span className="text-xs text-muted uppercase tracking-wide">
      {label}
    </span>

    <span className="text-sm text-charcoal text-right">
      {value || "—"}
    </span>
  </div>
);

const statusStyles: Record<string, string> = {
  planning: "bg-amber/15 text-amber",
  in_progress: "bg-clay/15 text-clay",
  completed: "bg-emerald-500/15 text-emerald-600",
};

const projectStatusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "Production",
  completed: "Completed",
};

const designerStatusStyles: Record<string, string> = {
  pending: "bg-amber/15 text-amber",
  accepted: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
  unassigned: "bg-panel text-muted",
};

const designerStatusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  unassigned: "Unassigned",
};

const formatMoney = (value?: number) =>
  value !== undefined
    ? `₹${value.toLocaleString()}`
    : "—";

const getObjectName = (
  value:
    | string
    | { name?: string }
    | undefined
) => {
  if (!value) return "—";

  if (typeof value === "string") {
    return value;
  }

  return value.name ?? "—";
};

const getCategoryName = (
  category: IProjectSourceRequest["category"]
) => {
  return getObjectName(category);
};

const getCatalogItemName = (
  catalogItem: IProjectSourceRequest["catalogItem"]
) => {
  return getObjectName(catalogItem);
};

const getMaterialNames = (
  materials: IProjectSourceRequest["materials"]
) => {
  if (!materials || materials.length === 0) {
    return "—";
  }

  return materials
    .map((material) => getObjectName(material))
    .join(", ");
};

const getColorThemeNames = (
  colorThemes: IProjectSourceRequest["colorThemes"]
) => {
  if (!colorThemes || colorThemes.length === 0) {
    return "—";
  }

  return colorThemes
    .map((theme) => getObjectName(theme))
    .join(", ");
};

const quotationStatusLabels: Record<string, string> = {
  draft: "Draft",
  pending_admin_approval: "Pending Admin Approval",
  admin_rejected: "Admin Rejected",
  sent: "Sent to Client",
  client_accepted: "Client Accepted",
  client_rejected: "Client Rejected",
  expired: "Expired",
};

const moodBoardStatusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Ready for Review",
  changes_requested: "Changes Requested",
  approved: "Approved",
};

const AdminProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading,
    isError,
  } = useProjectById(id);

  const {
    data: quotation,
  } = useQuotationByProject(
    id || "",
    Boolean(id)
  );

  const { data: moodBoard } = useAdminMoodBoard(
  id || ""
);

  const assignDesigner = useAssignDesigner();

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [isReassigning, setIsReassigning] =
    useState(false);

  const [selectedDesignerId, setSelectedDesignerId] =
    useState("");

  const { data: designersData } =
    useAllUsers(1, "designer");

  const designers = designersData?.users ?? [];

  if (isLoading) {
    return (
      <p className="text-sm text-muted">
        Loading project...
      </p>
    );
  }

  if (isError || !project) {
    return (
      <p className="text-sm text-ember">
        Couldn't load this project.
      </p>
    );
  }

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

  const isLockedIn =
    project.designerStatus === "accepted";

  const isNewProject =
    Boolean(
      source?.projectName ||
      source?.catalogItem ||
      source?.measurements
    );

  const referenceImages =
    source?.referenceImages?.length
      ? source.referenceImages
      : source?.images ?? [];

  const projectTitle =
    source?.projectName ||
    getCatalogItemName(source?.catalogItem) ||
    getCategoryName(source?.category) ||
    "Project";

  const handleAssignDesigner = () => {
    if (!selectedDesignerId) return;

    assignDesigner.mutate(
      {
        id: project._id,
        designerId: selectedDesignerId,
      },
      {
        onSuccess: () => {
          toast.success(
            designer
              ? "Designer updated"
              : "Designer assigned"
          );

          setSelectedDesignerId("");
          setIsReassigning(false);
        },

        onError: () => {
          toast.error(
            "Couldn't assign designer"
          );
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Back */}

      <Link
        to="/admin/projects"
        className="text-sm text-muted hover:text-charcoal transition-colors mb-4 inline-block"
      >
        ← Back to Projects
      </Link>

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <p className="font-serif font-bold text-3xl text-charcoal">
            {projectTitle}
          </p>

          {source?.projectName &&
            source.category && (
              <p className="text-sm text-muted mt-1">
                {getCategoryName(source.category)}
              </p>
            )}
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${
            statusStyles[project.status] ??
            "bg-panel text-muted"
          }`}
        >
          {projectStatusLabels[project.status] ??
            project.status}
        </span>
      </div>

      <p className="text-xs text-muted -mt-6 mb-6">
        Only the assigned designer can update
        project status.
      </p>

      {/* People */}

      <div className="bg-cream border border-border rounded-lg p-8 mb-6">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
          People
        </p>

        <Row
          label="Client"
          value={
            client
              ? `${client.fullName} (${client.email})`
              : "Unknown"
          }
        />

        {/* Designer */}

        <div className="flex justify-between items-start py-2.5 border-b border-border">
          <span className="text-xs text-muted uppercase tracking-wide pt-1.5">
            Designer
          </span>

          {isReassigning || !designer ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedDesignerId}
                onChange={(e) =>
                  setSelectedDesignerId(
                    e.target.value
                  )
                }
                className="text-sm border border-border rounded-md px-2 py-1.5 bg-white text-charcoal cursor-pointer"
              >
                <option value="">
                  Select designer
                </option>

                {designers.map((d) => (
                  <option
                    key={d._id}
                    value={d._id}
                  >
                    {d.fullName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignDesigner}
                disabled={
                  !selectedDesignerId ||
                  assignDesigner.isPending
                }
                className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-md bg-clay text-cream hover:bg-ember transition-colors disabled:opacity-60"
              >
                {assignDesigner.isPending
                  ? "..."
                  : designer
                  ? "Update"
                  : "Assign"}
              </button>

              {designer && (
                <button
                  onClick={() => {
                    setIsReassigning(false);
                    setSelectedDesignerId("");
                  }}
                  className="text-xs text-muted hover:text-charcoal"
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm text-charcoal">
                  {designer.fullName} (
                  {designer.email})
                </p>

                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    designerStatusStyles[
                      project.designerStatus
                    ] ??
                    designerStatusStyles.unassigned
                  }`}
                >
                  {designerStatusLabels[
                    project.designerStatus
                  ] ??
                    project.designerStatus}
                </span>
              </div>

              {!isLockedIn && (
                <button
                  onClick={() => {
                    setSelectedDesignerId(
                      designer._id
                    );

                    setIsReassigning(true);
                  }}
                  className="text-xs text-amber underline underline-offset-2 hover:opacity-80 mt-0.5"
                >
                  Change
                </button>
              )}
            </div>
          )}
        </div>

        {/* Designer rejection */}

        {project.designerStatus ===
          "rejected" &&
          project.designerRejectionReason && (
            <div className="bg-red-50 border border-red-100 rounded-md px-4 py-3 mt-1 mb-1">
              <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">
                Rejection reason
              </p>

              <p className="text-sm text-red-700">
                {
                  project.designerRejectionReason
                }
              </p>
            </div>
          )}

        <Row
          label="Created"
          value={new Date(
            project.createdAt
          ).toLocaleDateString()}
        />
      </div>

      {/* ========================= */}
      {/* QUOTATION                  */}
      {/* ========================= */}

      {quotation && (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                Quotation
              </p>

              <p className="text-sm text-charcoal">
                {quotationStatusLabels[
                  quotation.status
                ] ?? quotation.status}
              </p>

              <p className="text-xs text-muted mt-1">
                Total:{" "}
                {formatMoney(quotation.total)}
              </p>
            </div>

            <Link
              to={`/admin/projects/${project._id}/quotation`}
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
            >
              {quotation.status ===
              "pending_admin_approval"
                ? "Review Quotation"
                : "View Quotation"}
            </Link>
          </div>
        </div>
      )}

   

      {moodBoard && (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                Mood Board
              </p>

              <p className="text-sm text-charcoal">
                {moodBoardStatusLabels[
                  moodBoard.status
                ] ?? moodBoard.status}
              </p>

              {moodBoard.versions?.length > 0 && (
                <p className="text-xs text-muted mt-1">
                  {moodBoard.versions.length} version
                  {moodBoard.versions.length !== 1
                    ? "s"
                    : ""}
                </p>
              )}
            </div>

            <Link
              to={`/admin/projects/${project._id}/moodboard`}
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-md bg-clay text-cream hover:bg-ember transition-colors text-center"
            >
              View Mood Board
            </Link>
          </div>
        </div>
      )}



      {isNewProject && source && (
        <>
          {/* Project Details */}

          <div className="bg-cream border border-border rounded-lg p-8 mb-6">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
              Project Details
            </p>

            <Row
              label="Project Name"
              value={source.projectName}
            />

            <Row
              label="Category"
              value={getCategoryName(
                source.category
              )}
            />

            <Row
              label="Design"
              value={getCatalogItemName(
                source.catalogItem
              )}
            />

            <Row
              label="Estimated Total"
              value={formatMoney(
                source.estimatedTotal
              )}
            />
          </div>

          {/* Materials & Colors */}

          <div className="bg-cream border border-border rounded-lg p-8 mb-6">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
              Selected Options
            </p>

            <Row
              label="Materials"
              value={getMaterialNames(
                source.materials
              )}
            />

            <Row
              label="Color Themes"
              value={getColorThemeNames(
                source.colorThemes
              )}
            />
          </div>

          {/* Measurements */}

          {source.measurements && (
            <div className="bg-cream border border-border rounded-lg p-8 mb-6">
              <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                Measurements
              </p>

              <Row
                label="Height"
                value={`${source.measurements.height} ft`}
              />

              <Row
                label="Width"
                value={`${source.measurements.width} ft`}
              />

              <Row
                label="Square Feet"
                value={`${source.measurements.squareFeet} sq ft`}
              />
            </div>
          )}

          {/* Requirements */}

          {(source.description ||
            source.needBy) && (
            <div className="bg-cream border border-border rounded-lg p-8 mb-6">
              <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                Requirements
              </p>

              {source.description && (
                <div className="py-2.5 border-b border-border">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">
                    Description
                  </p>

                  <p className="text-sm text-charcoal whitespace-pre-wrap">
                    {source.description}
                  </p>
                </div>
              )}

              {source.needBy && (
                <Row
                  label="Need By"
                  value={new Date(
                    `${source.needBy}T00:00:00`
                  ).toLocaleDateString()}
                />
              )}
            </div>
          )}
        </>
      )}

  
      {!isNewProject && source?.roomInfo && (
        <div className="bg-cream border border-border rounded-lg p-8 mb-6">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
            Room Details
          </p>

          <Row
            label="Room Type"
            value={
              source.roomInfo.customRoomType ||
              source.roomInfo.roomType
            }
          />

          {source.roomInfo.totalArea !==
            undefined && (
            <Row
              label="Total Area"
              value={`${source.roomInfo.totalArea} sq ft`}
            />
          )}

          {source.roomInfo.width !==
              undefined &&
            source.roomInfo.length !==
              undefined && (
              <Row
                label="Dimensions"
                value={`${source.roomInfo.width} × ${source.roomInfo.length} ft`}
              />
            )}

          <Row
            label="Budget"
            value={source.roomInfo.budgetRange}
          />

          <Row
            label="Style"
            value={
              source.roomInfo.customStyle ||
              source.roomInfo.preferredStyle
            }
          />

          <Row
            label="Timeline"
            value={
              source.roomInfo.customTimelineDate
                ? `By ${new Date(
                    source.roomInfo.customTimelineDate
                  ).toLocaleDateString()}`
                : source.roomInfo.preferredTimeline
            }
          />

          {source.estimatedTotal !==
              undefined &&
            source.estimatedTotal > 0 && (
              <Row
                label="Estimated Total"
                value={formatMoney(
                  source.estimatedTotal
                )}
              />
            )}
        </div>
      )}

      {/* ========================= */}
      {/* IMAGES                     */}
      {/* ========================= */}

      {referenceImages.length > 0 && (
        <div className="bg-cream border border-border rounded-lg p-8">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
            {isNewProject
              ? `Reference Images (${referenceImages.length})`
              : `Room Images (${referenceImages.length})`}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {referenceImages.map((url) => (
              <img
                key={url}
                src={url}
                alt="Project reference"
                onClick={() =>
                  setSelectedImage(url)
                }
                className="aspect-square object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}

      {selectedImage && (
        <div
          onClick={() =>
            setSelectedImage(null)
          }
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer p-8"
        >
          <img
            src={selectedImage}
            alt="Project reference preview"
            onClick={(e) =>
              e.stopPropagation()
            }
            className="max-w-full max-h-full object-contain rounded-lg"
          />

          <button
            onClick={() =>
              setSelectedImage(null)
            }
            className="absolute top-6 right-6 text-white text-2xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProjectDetail;