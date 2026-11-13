import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  useDesignerMoodBoards,
} from "../hooks/useMoodBoards";

import { getErrorMessage } from "../../../shared/utils/errors";
import SafeImage from "../../../shared/components/ui/SafeImage";
import SearchField from "../../../shared/components/ui/SearchField";

import {
  getProjectClientName,
  getProjectImage,
  getProjectName,
  getProjectSource,
} from "../../projects/utils/projectPresentation";

import {
  moodBoardStatusLabels,
  moodBoardStatusStyles,
} from "../utils/moodboardPresentation";

export default function DesignerMoodBoardsPage() {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useDesignerMoodBoards({
    page,
    limit,
    search,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const items = data?.data ?? [];

  const pagination =
    data?.pagination;

  const totalPages =
    pagination?.totalPages ?? 1;

  const total =
    pagination?.total ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted">
              Loading Mood Boards...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-ember/25 bg-surface p-6 text-center">
            <p className="text-sm text-ember">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-cream p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Mood Boards
            </h1>

            <p className="mt-1 text-sm text-muted">
              Create and manage mood boards for
              projects with an accepted quotation.
            </p>
          </div>

          <div className="text-sm text-muted">
            {total} project
            {total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Search */}

        <div className="mb-5">
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search project or client..."
            ariaLabel="Search mood boards"
          />
        </div>

        {/* Empty */}

        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              No projects found
            </h2>

            <p className="mt-1 text-sm text-muted">
              {search
                ? "No projects match your search."
                : "Projects become available after the client accepts your quotation."}
            </p>
          </div>
        ) : (
          <>
            {/* Cards */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const projectId =
                  item.project._id;

                const moodBoard =
                  item.moodBoard;

                const source = getProjectSource(
                  item.project.sourceRequest
                );

                const projectName =
                  getProjectName(source);

                const projectImage =
                  getProjectImage(source);

                const clientName =
                  getProjectClientName(item.client);

                return (
                  <Link
                    key={item._id}
                    to={`/designer/moodboards/${projectId}`}
                    className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-amber hover:shadow-sm"
                  >
                    <SafeImage
                      src={projectImage}
                      alt={projectName}
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-serif text-lg font-bold text-charcoal">
                            {projectName}
                          </h2>

                          <p className="mt-1 truncate text-xs text-muted">
                            {clientName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-muted">
                            {item.client?.email ||
                              "No email"}
                          </p>
                        </div>

                        {moodBoard ? (
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              moodBoardStatusStyles[
                                moodBoard.status
                              ]
                            }`}
                          >
                            {
                              moodBoardStatusLabels[
                                moodBoard.status
                              ]
                            }
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
                            Ready to create
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                        {moodBoard ? (
                          <>
                            <span className="text-muted">
                              Versions
                            </span>

                            <span className="font-medium text-charcoal">
                              {
                                moodBoard
                                  .versions
                                  .length
                              }
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-muted">
                              Mood Board
                            </span>

                            <span className="font-medium text-clay group-hover:underline">
                              Create →
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-xs text-muted">
                  Page {page} of{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          totalPages,
                          current + 1
                        )
                    )
                  }
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}