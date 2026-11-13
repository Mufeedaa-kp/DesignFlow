import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useMyProjectRequests } from "../../hooks/useClientProjectRequests";
import { useMyProjects } from "../../../projects/hooks/useProjects";

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

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError } = useMyProjectRequests(
    page,
    LIMIT,
    search,
    status,
  );

  const requests = data?.requests ?? [];
  const totalPages = data?.pagination?.totalPages ?? 0;

  const projectByRequestId = useMemo(() => {
    const map = new Map<string, string>();

    projects.forEach((project) => {
      const sourceRequest = project.sourceRequest;
      const requestId =
        typeof sourceRequest === "string" ? sourceRequest : sourceRequest?._id;

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
    <>
      <section className="section pt-28">
        <div className="container-page space-y-6">
          <h1 className="font-serif text-3xl font-semibold text-charcoal">
            My requests
          </h1>

          {/* Toolbar */}

       
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search requests..."
                aria-label="Search project requests"
                className="w-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal outline-none focus:border-clay focus:ring-1 focus:ring-clay"
              />
            </div>

            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-border bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:border-clay focus:ring-1 focus:ring-clay lg:w-44"
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
                className="border border-border px-4 py-2.5 text-sm text-muted hover:bg-panel hover:text-charcoal"
              >
                Clear
              </button>
            )}

            <Link
              to="/client/requests/new"
              className="inline-flex items-center justify-center border border-[var(--color-brown)] bg-[var(--color-brown)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110"
            >
              + New Request
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-border bg-white">
                  <div className="aspect-[16/10] animate-pulse bg-panel" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-24 animate-pulse bg-panel" />
                    <div className="h-5 w-36 animate-pulse bg-panel" />
                    <div className="h-8 w-full animate-pulse bg-panel" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="border border-red-100 bg-red-50 p-5 text-sm text-red-500">
              Unable to load your project requests. Please try again.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && requests.length === 0 && (
            <div className="border border-border bg-white px-6 py-14 text-center">
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
                  className="mt-6 border border-[var(--color-brown)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)] hover:bg-[var(--color-brown)] hover:text-cream"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/client/requests/new"
                  className="mt-6 inline-block border border-[var(--color-brown)] bg-[var(--color-brown)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream hover:brightness-110"
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
                  <div className="absolute -top-5 right-0 text-[10px] text-muted">
                    Updating...
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

                    const categoryName = category?.name ?? "Interior Design";
                    const image = catalogItem?.image ?? category?.image;
                    const projectId = projectByRequestId.get(request._id);

                    return (
                      <div
                        key={request._id}
                        className="overflow-hidden border border-border bg-white transition hover:shadow-md"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] bg-panel">
                          {image ? (
                            <img
                              src={image}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[var(--color-brown-dark)]">
                              <span className="font-serif text-base text-cream">
                                DesignFlow
                              </span>
                            </div>
                          )}

                          <span
                            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              statusStyles[request.status] ??
                              "bg-[var(--color-surface)] text-muted"
                            }`}
                          >
                            {statusLabels[request.status] ?? request.status}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
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
                                ₹{(request.estimatedTotal ?? 0).toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/client/requests/${request._id}`}
                                className="border border-[var(--color-brown)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-brown)] transition hover:bg-[var(--color-brown)] hover:text-cream"
                              >
                                View
                              </Link>

                              {request.status === "approved" && projectId && (
                                <Link
                                  to={`/client/projects/${projectId}`}
                                  className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-cream transition hover:brightness-110"
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
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((c) => Math.max(1, c - 1))}
                    className="border border-border px-4 py-2 text-xs text-charcoal hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <span className="text-xs text-muted">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
                    className="border border-border px-4 py-2 text-xs text-charcoal hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MyProjectRequestsPage;