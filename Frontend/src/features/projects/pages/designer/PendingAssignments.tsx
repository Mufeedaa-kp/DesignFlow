import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";

import {
  useMyAssignedProjects,
  useAcceptAssignment,
  useRejectAssignment,
} from "../../hooks/useProjects";

import type {
  IProjectResponse,
  IProjectSourceRequest,
} from "../../types/project.types";

const formatMoney = (n?: number) =>
  n ? `₹${n.toLocaleString()}` : "—";

const getClientName = (
  client: IProjectResponse["client"]
) =>
  typeof client === "string"
    ? client
    : client.fullName;

const getSourceRequest = (
  sourceRequest: IProjectResponse["sourceRequest"]
) =>
  typeof sourceRequest === "string"
    ? null
    : sourceRequest;

const getProjectName = (
  source: IProjectSourceRequest | null
) => {
  if (!source) return "Project";

  if (source.projectName) {
    return source.projectName;
  }

  if (
    source.catalogItem &&
    typeof source.catalogItem !== "string"
  ) {
    return source.catalogItem.name;
  }

  if (source.roomInfo) {
    if (
      source.roomInfo.roomType === "other" &&
      source.roomInfo.customRoomType
    ) {
      return source.roomInfo.customRoomType;
    }

    return source.roomInfo.roomType ?? "Project";
  }

  return "Project";
};

const getDesignName = (
  source: IProjectSourceRequest | null
) => {
  if (!source?.catalogItem) return null;

  if (typeof source.catalogItem === "string") {
    return null;
  }

  return source.catalogItem.name;
};

const getCategoryName = (
  source: IProjectSourceRequest | null
) => {
  if (!source?.category) return null;

  if (typeof source.category === "string") {
    return null;
  }

  return source.category.name;
};

const PendingAssignments = () => {
  const {
    data: projects,
    isLoading,
  } = useMyAssignedProjects();

  const acceptMutation =
    useAcceptAssignment();

  const rejectMutation =
    useRejectAssignment();

  const [rejectingId, setRejectingId] =
    useState<string | null>(null);

  const [reason, setReason] = useState("");

  const pending =
    projects?.filter(
      (p) => p.designerStatus === "pending"
    ) ?? [];

  const handleAccept = (id: string) => {
    acceptMutation.mutate(id);
  };

  const openReject = (id: string) => {
    setRejectingId(id);
    setReason("");
  };

  const closeReject = () => {
    setRejectingId(null);
    setReason("");
  };

  const handleRejectSubmit = () => {
    if (!reason.trim() || !rejectingId) return;

    rejectMutation.mutate(
      {
        id: rejectingId,
        reason,
      },
      {
        onSuccess: closeReject,
      }
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-charcoal mb-1">
          Pending Assignments
        </h1>

        <p className="text-sm text-muted">
          Projects waiting on your response.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-muted">
          Loading...
        </p>
      )}

      {!isLoading && pending.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-8 shadow-sm text-center">
          <p className="text-sm text-muted">
            No pending assignments right now.
          </p>
        </div>
      )}

      {!isLoading && pending.length > 0 && (
        <div className="space-y-4">
          {pending.map((project) => {
            const source = getSourceRequest(
              project.sourceRequest
            );

            const client =
              typeof project.client === "string"
                ? null
                : project.client;

            const projectName =
              getProjectName(source);

            const designName =
              getDesignName(source);

            const categoryName =
              getCategoryName(source);

            return (
              <div
                key={project._id}
                className="bg-surface rounded-xl border border-border p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-serif font-bold text-lg text-charcoal">
                      {projectName}
                    </p>

                    <p className="text-xs text-muted mb-3">
                      {getClientName(project.client)}
                      {client?.email
                        ? ` · ${client.email}`
                        : ""}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mb-3">
                      {categoryName && (
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Category
                          </p>

                          <p className="text-sm text-charcoal">
                            {categoryName}
                          </p>
                        </div>
                      )}

                      {designName && (
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Design
                          </p>

                          <p className="text-sm text-charcoal">
                            {designName}
                          </p>
                        </div>
                      )}

                      {source?.measurements && (
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Area
                          </p>

                          <p className="text-sm text-charcoal">
                            {
                              source.measurements
                                .squareFeet
                            }{" "}
                            sq ft
                          </p>
                        </div>
                      )}

                      {source?.measurements && (
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Dimensions
                          </p>

                          <p className="text-sm text-charcoal">
                            {
                              source.measurements
                                .height
                            }{" "}
                            ×{" "}
                            {
                              source.measurements
                                .width
                            }{" "}
                            ft
                          </p>
                        </div>
                      )}
                    </div>

                    {source?.roomInfo && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mb-3">
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Budget
                          </p>

                          <p className="text-sm text-charcoal">
                            {source.roomInfo
                              .budgetRange ??
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Style
                          </p>

                          <p className="text-sm text-charcoal">
                            {source.roomInfo
                              .customStyle ??
                              source.roomInfo
                                .preferredStyle ??
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Timeline
                          </p>

                          <p className="text-sm text-charcoal">
                            {source.roomInfo
                              .customTimelineDate
                              ? `By ${new Date(
                                  source.roomInfo.customTimelineDate
                                ).toLocaleDateString()}`
                              : source.roomInfo
                                  .preferredTimeline ??
                                "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wide">
                            Area
                          </p>

                          <p className="text-sm text-charcoal">
                            {source.roomInfo
                              .totalArea ?? "—"}{" "}
                            sq ft
                            {source.roomInfo
                              .width !==
                              undefined &&
                            source.roomInfo
                              .length !==
                              undefined
                              ? ` (${source.roomInfo.width} × ${source.roomInfo.length} ft)`
                              : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    {source?.estimatedTotal !==
                      undefined &&
                      source.estimatedTotal > 0 && (
                        <p className="text-xs text-muted mb-3">
                          Estimated total:{" "}
                          <span className="text-charcoal font-medium">
                            {formatMoney(
                              source.estimatedTotal
                            )}
                          </span>
                        </p>
                      )}

                    <Link
                      to={`/designer/projects/${project._id}`}
                      className="text-xs text-amber underline underline-offset-2 hover:text-clay transition-colors"
                    >
                      View full details →
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                    <button
                      onClick={() =>
                        handleAccept(project._id)
                      }
                      disabled={
                        acceptMutation.isPending
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-olive/10 text-olive hover:bg-olive/20 disabled:opacity-50"
                    >
                      <FiCheck size={14} /> Accept
                    </button>

                    <button
                      onClick={() =>
                        openReject(project._id)
                      }
                      disabled={
                        rejectMutation.isPending
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-ember/10 text-ember hover:bg-ember/20 disabled:opacity-50"
                    >
                      <FiX size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectingId && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="font-serif font-bold text-lg text-charcoal mb-3">
              Reject assignment
            </h3>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Reason for rejecting this assignment..."
              className="mb-4 min-h-25 w-full rounded-lg border border-border bg-surface p-3 text-sm text-charcoal outline-none focus:border-amber"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeReject}
                className="text-xs font-semibold px-3 py-2 rounded-lg text-muted hover:bg-panel"
              >
                Cancel
              </button>

              <button
                onClick={handleRejectSubmit}
                disabled={
                  !reason.trim() ||
                  rejectMutation.isPending
                }
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-ember text-cream hover:bg-charcoal disabled:opacity-50"
              >
                Submit rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingAssignments;