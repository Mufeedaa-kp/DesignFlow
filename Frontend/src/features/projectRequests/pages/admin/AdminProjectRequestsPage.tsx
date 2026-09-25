import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import {
  useAdminProjectRequests,
  useApproveProjectRequest,
  useRejectProjectRequest,
} from "../../hooks/useAdminProjectRequests";

import type {
  IProjectRequest,
} from "../../types/projectRequest.types";



const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;



const statusDotColors: Record<string, string> = {
  pending: "bg-amber",
  approved: "bg-emerald-500",
  rejected: "bg-ember",
};

const statusTextColors: Record<string, string> = {
  pending: "text-amber",
  approved: "text-emerald-600",
  rejected: "text-ember",
};


const getCategoryName = (
  request: IProjectRequest
) => {
  if (
    typeof request.category === "object" &&
    request.category
  ) {
    return request.category.name;
  }

  return "—";
};

const getCatalogItemName = (
  request: IProjectRequest
) => {
  if (
    typeof request.catalogItem === "object" &&
    request.catalogItem
  ) {
    return request.catalogItem.name;
  }

  return "—";
};



const AdminProjectRequestsPage = () => {
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] =
    useState<string>("");

  const [actingOnId, setActingOnId] =
    useState<string | null>(null);

  const [rejectingId, setRejectingId] =
    useState<string | null>(null);

  const [
    rejectionReasonInput,
    setRejectionReasonInput,
  ] = useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const limit = 10;

 

  const {
    data,
    isLoading,
    isError,
  } = useAdminProjectRequests(
    page,
    limit,
    activeTab
  );



  const approveMutation =
    useApproveProjectRequest();

  const rejectMutation =
    useRejectProjectRequest();

  const requests = data?.requests ?? [];



  const filteredRequests =
    requests.filter((request) => {
      if (!searchQuery.trim()) {
        return true;
      }

      const query =
        searchQuery.toLowerCase();

      const projectName =
        request.projectName?.toLowerCase() ?? "";

      const fullName =
        request.personalInfo?.fullName?.toLowerCase() ??
        "";

      const email =
        request.personalInfo?.email?.toLowerCase() ??
        "";

      const category =
        getCategoryName(request).toLowerCase();

      const catalogItem =
        getCatalogItemName(request).toLowerCase();

      return (
        projectName.includes(query) ||
        fullName.includes(query) ||
        email.includes(query) ||
        category.includes(query) ||
        catalogItem.includes(query)
      );
    });



  const handleTabChange = (
    value: string
  ) => {
    setActiveTab(value);
    setPage(1);
  };



  const handleApprove = async (
    id: string
  ) => {
    setActingOnId(id);

    try {
      await approveMutation.mutateAsync(id);

      toast.success(
        "Request approved — project created"
      );
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message ||
              "Approve failed"
          : "Approve failed"
      );
    } finally {
      setActingOnId(null);
    }
  };



  const startReject = (id: string) => {
    setRejectingId(id);
    setRejectionReasonInput("");
  };


  const cancelReject = () => {
    setRejectingId(null);
    setRejectionReasonInput("");
  };


  const confirmReject = async (
    id: string
  ) => {
    if (!rejectionReasonInput.trim()) {
      toast.error(
        "Please enter a reason for rejection"
      );

      return;
    }

    setActingOnId(id);

    try {
      await rejectMutation.mutateAsync({
        id,
        rejectionReason:
          rejectionReasonInput.trim(),
      });

      toast.success(
        "Request rejected"
      );

      cancelReject();
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message ||
              "Reject failed"
          : "Reject failed"
      );
    } finally {
      setActingOnId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      

      <p className="mb-2 font-serif text-3xl font-bold text-charcoal">
        Requests
      </p>

      <p className="mb-8 text-sm text-muted">
        All client project requests and their
        outcomes.
      </p>


      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search by project, client, category or design..."
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-amber sm:max-w-md"
        />
      </div>


      <div className="mb-8 flex items-center gap-6 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() =>
              handleTabChange(tab.value)
            }
            className={`whitespace-nowrap border-b-2 pb-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.value
                ? "border-clay text-charcoal"
                : "border-transparent text-muted hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {isLoading && (
        <p className="text-sm text-muted">
          Loading requests...
        </p>
      )}


      {isError && (
        <p className="text-sm text-ember">
          Couldn't load requests. Try again.
        </p>
      )}


      {!isLoading &&
        !isError &&
        filteredRequests.length === 0 && (
          <div className="rounded-lg border border-border p-12 text-center">
            <p className="mb-2 font-serif text-xl text-charcoal">
              {searchQuery
                ? "No requests match your search"
                : "No requests here"}
            </p>

            <p className="text-sm text-muted">
              {searchQuery
                ? "Try a different project, client, category or design."
                : "Nothing matches this filter yet."}
            </p>
          </div>
        )}


      {!isLoading &&
        !isError &&
        filteredRequests.length > 0 && (

          <>

            <div className="hidden overflow-x-auto rounded-lg border border-border scrollbar-hide md:block">
              <table className="w-full min-w-205 border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-panel/30">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      Project
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      Client
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      Category
                    </th>

                    

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      Estimated Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                      Status
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map(
                    (
                      request: IProjectRequest
                    ) => (
                      <tr
                        key={request._id}
                        className="border-b border-border bg-cream align-top last:border-0"
                      >
                        {/* Project */}

                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm font-medium text-charcoal">
                            {request.projectName ||
                              "Untitled Project"}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Client */}

                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                          <div>
                            {request
                              .personalInfo
                              ?.fullName ?? "—"}
                          </div>

                          <div>
                            {request
                              .personalInfo
                              ?.email ?? "—"}
                          </div>

                          <div>
                            {request
                              .personalInfo
                              ?.phone ?? "—"}
                          </div>
                        </td>

                        {/* Category */}

                        <td className="whitespace-nowrap px-4 py-3 text-sm text-charcoal">
                          {getCategoryName(
                            request
                          )}
                        </td>

                       
                        {/* Estimated Total */}

                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                          ₹
                          {request.estimatedTotal.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium capitalize">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                statusDotColors[
                                  request.status
                                ] ??
                                "bg-muted"
                              }`}
                            />

                            <span
                              className={
                                statusTextColors[
                                  request.status
                                ] ??
                                "text-muted"
                              }
                            >
                              {request.status}
                            </span>
                          </span>

                          {request.status ===
                            "rejected" &&
                            request.rejectionReason && (
                              <p className="mx-auto mt-1 max-w-35 text-[10px] text-ember">
                                {
                                  request.rejectionReason
                                }
                              </p>
                            )}
                        </td>

                        {/* Actions */}

                        <td className="px-4 py-3">
                          {rejectingId ===
                          request._id ? (
                            <div className="flex min-w-45 flex-col gap-2">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Reason for rejection..."
                                value={
                                  rejectionReasonInput
                                }
                                onChange={(e) =>
                                  setRejectionReasonInput(
                                    e.target.value
                                  )
                                }
                                className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-charcoal focus:border-amber focus:outline-none"
                              />

                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    confirmReject(
                                      request._id
                                    )
                                  }
                                  disabled={
                                    actingOnId ===
                                      request._id ||
                                    !rejectionReasonInput.trim()
                                  }
                                  className="rounded-md bg-ember px-3 py-1.5 text-xs text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
                                >
                                  {actingOnId ===
                                  request._id
                                    ? "..."
                                    : "Confirm"}
                                </button>

                                <button
                                  onClick={
                                    cancelReject
                                  }
                                  className="rounded-md border border-border px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-panel"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                              {request.status ===
                                "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprove(
                                        request._id
                                      )
                                    }
                                    disabled={
                                      actingOnId ===
                                      request._id
                                    }
                                    className="rounded-md bg-clay px-3 py-1.5 text-xs text-cream transition-colors hover:bg-ember disabled:opacity-60"
                                  >
                                    {actingOnId ===
                                        request._id &&
                                    approveMutation.isPending
                                      ? "..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      startReject(
                                        request._id
                                      )
                                    }
                                    disabled={
                                      actingOnId ===
                                      request._id
                                    }
                                    className="rounded-md border border-border px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-panel disabled:opacity-60"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              <Link
                                to={`/admin/requests/${request._id}`}
                                className="rounded-md bg-panel px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-border"
                              >
                                View
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

  

            <div className="space-y-3 md:hidden">
              {filteredRequests.map(
                (
                  request: IProjectRequest
                ) => (
                  <div
                    key={request._id}
                    className="rounded-lg border border-border bg-cream p-4"
                  >
                    {/* Header */}

                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {request.projectName ||
                            "Untitled Project"}
                        </p>

                        <p className="text-xs text-muted">
                          {
                            request.personalInfo
                              ?.fullName
                          }
                        </p>

                        <p className="text-xs text-muted">
                          {
                            request.personalInfo
                              ?.email
                          }
                        </p>

                        <p className="text-xs text-muted">
                          {
                            request.personalInfo
                              ?.phone
                          }
                        </p>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium capitalize">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            statusDotColors[
                              request.status
                            ] ?? "bg-muted"
                          }`}
                        />

                        <span
                          className={
                            statusTextColors[
                              request.status
                            ] ?? "text-muted"
                          }
                        >
                          {request.status}
                        </span>
                      </span>
                    </div>

                    {/* Details */}

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span>
                        {getCategoryName(
                          request
                        )}
                      </span>

                      <span>
                        {getCatalogItemName(
                          request
                        )}
                      </span>

                      <span>
                        ₹
                        {request.estimatedTotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    {/* Rejection Reason */}

                    {request.status ===
                      "rejected" &&
                      request.rejectionReason && (
                        <p className="mb-3 text-[11px] text-ember">
                          {
                            request.rejectionReason
                          }
                        </p>
                      )}

                    {/* Reject Form */}

                    {rejectingId ===
                    request._id ? (
                      <div className="flex flex-col gap-2 border-t border-border pt-3">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Reason for rejection..."
                          value={
                            rejectionReasonInput
                          }
                          onChange={(e) =>
                            setRejectionReasonInput(
                              e.target.value
                            )
                          }
                          className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-charcoal focus:border-amber focus:outline-none"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              confirmReject(
                                request._id
                              )
                            }
                            disabled={
                              actingOnId ===
                                request._id ||
                              !rejectionReasonInput.trim()
                            }
                            className="flex-1 rounded-md bg-ember px-3 py-1.5 text-xs text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
                          >
                            {actingOnId ===
                            request._id
                              ? "..."
                              : "Confirm"}
                          </button>

                          <button
                            onClick={cancelReject}
                            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-panel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 border-t border-border pt-3">
                        {request.status ===
                          "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(
                                  request._id
                                )
                              }
                              disabled={
                                actingOnId ===
                                request._id
                              }
                              className="flex-1 rounded-md bg-clay px-3 py-1.5 text-xs text-cream transition-colors hover:bg-ember disabled:opacity-60"
                            >
                              {actingOnId ===
                                  request._id &&
                              approveMutation.isPending
                                ? "..."
                                : "Approve"}
                            </button>

                            <button
                              onClick={() =>
                                startReject(
                                  request._id
                                )
                              }
                              disabled={
                                actingOnId ===
                                request._id
                              }
                              className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-panel disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <Link
                          to={`/admin/requests/${request._id}`}
                          className={`rounded-md bg-panel px-3 py-1.5 text-xs text-charcoal transition-colors hover:bg-border ${
                            request.status ===
                            "pending"
                              ? ""
                              : "flex-1 text-center"
                          }`}
                        >
                          View
                        </Link>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

           

            {data?.pagination &&
              data.pagination.totalPages >
                1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.max(1, p - 1)
                      )
                    }
                    disabled={page === 1}
                    className="text-sm text-muted transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <p className="text-xs text-muted">
                    Page {page} of{" "}
                    {data.pagination.totalPages}
                  </p>

                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          data.pagination
                            .totalPages,
                          p + 1
                        )
                      )
                    }
                    disabled={
                      page ===
                      data.pagination.totalPages
                    }
                    className="text-sm text-muted transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
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

export default AdminProjectRequestsPage;