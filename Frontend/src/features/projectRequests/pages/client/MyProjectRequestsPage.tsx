import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useMyProjectRequests } from "../../hooks/useClientProjectRequests";
import { useMyProjects } from "../../../projects/hooks/useProjects";

import SearchField from "../../../../shared/components/ui/SearchField";

const LIMIT = 9;

const statusStyles: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const MyProjectRequestsPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");


  const { data: projects = [] } = useMyProjects();

//debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useMyProjectRequests(page, LIMIT, search, status);

  const requests = data?.requests ?? [];
  const totalPages = data?.pagination?.totalPages ?? 0;


  const projectByRequestId = useMemo(() => {
    const map = new Map<string, string>();

    projects.forEach((project) => {
      const sourceRequest = project.sourceRequest;

      const requestId =
        typeof sourceRequest === "string"
          ? sourceRequest
          : sourceRequest?._id;

      if (requestId) {
        map.set(requestId, project._id);
      }
    });

    return map;
  }, [projects]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
            Your designs
          </p>

          <h1 className="mt-1 font-serif text-2xl font-bold text-charcoal">
            My Project Requests
          </h1>

          <p className="mt-1 text-sm text-muted">
            View and manage your interior design requests.
          </p>
        </div>

        <Link
          to="/client/requests/new"
          className="inline-flex items-center justify-center rounded-lg bg-clay px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-cream transition hover:bg-ember"
        >
          + New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search requests..."
            ariaLabel="Search project requests"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            handleStatusChange(event.target.value)
          }
          className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:border-clay focus:ring-1 focus:ring-clay sm:w-44"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {(search || status) && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:bg-panel hover:text-charcoal"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-white"
            >
              <div className="h-32 animate-pulse bg-panel" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-24 animate-pulse rounded bg-panel" />
                <div className="h-5 w-36 animate-pulse rounded bg-panel" />
                <div className="h-8 w-full animate-pulse rounded bg-panel" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-500">
          Unable to load your project requests. Please try again.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && requests.length === 0 && (
        <div className="rounded-xl border border-border bg-white px-6 py-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {search || status
              ? "No matching requests"
              : "No project requests yet"}
          </h2>

          <p className="mt-2 text-sm text-muted">
            {search || status
              ? "Try changing your search or filter."
              : "Create your first interior design request to get started."}
          </p>

          {search || status ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-clay px-4 py-2 text-xs font-semibold text-clay hover:bg-clay hover:text-cream"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/client/requests/new"
              className="mt-5 inline-block rounded-lg bg-clay px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-ember"
            >
              Create Request
            </Link>
          )}
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && requests.length > 0 && (
        <>
          <div className="relative">
            {isFetching && (
              <div className="absolute right-0 -top-7 text-[10px] text-muted">
                Updating...
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => {
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
                  "Project Request";

                const categoryName =
                  category?.name ?? "Interior Design";

                const image =
                  catalogItem?.image ?? category?.image;

               
                const projectId =
                  projectByRequestId.get(request._id);

                return (
                  <div
                    key={request._id}
                    className="overflow-hidden rounded-xl border border-border bg-white transition hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-32 bg-panel">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-base text-clay">
                            Design Flow
                          </span>
                        </div>
                      )}

                      {/* Status */}
                      <span
                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          statusStyles[request.status] ??
                          "bg-white text-muted"
                        }`}
                      >
                        {statusLabels[request.status] ??
                          request.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                        {categoryName}
                      </p>

                      <h2 className="mt-1 truncate font-serif text-lg font-semibold text-charcoal">
                        {title}
                      </h2>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted">
                            Estimate
                          </p>

                          <p className="mt-0.5 text-sm font-medium text-charcoal">
                            ₹
                            {(
                              request.estimatedTotal ?? 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/client/requests/${request._id}`}
                            className="rounded-lg border border-clay px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-clay transition hover:bg-clay hover:text-cream"
                          >
                            View
                          </Link>

                          {request.status === "approved" &&
                            projectId && (
                              <Link
                                to={`/client/projects/${projectId}`}
                                className="rounded-lg bg-clay px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-cream transition hover:bg-ember"
                              >
                                Project
                              </Link>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="rounded-lg border border-border px-3 py-2 text-xs text-charcoal hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>

              <span className="text-xs text-muted">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                className="rounded-lg border border-border px-3 py-2 text-xs text-charcoal hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProjectRequestsPage;