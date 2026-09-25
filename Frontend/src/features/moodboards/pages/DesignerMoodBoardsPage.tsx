import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  useDesignerMoodBoards,
} from "../hooks/useMoodBoards";

import { getErrorMessage } from "../../../shared/utils/errors";

import type {
  MoodBoardStatus,
} from "../types/moodboard.types";

const getStatusLabel = (
  status: MoodBoardStatus
) => {
  switch (status) {
    case "draft":
      return "Draft";

    case "submitted":
      return "Submitted";

    case "changes_requested":
      return "Changes Requested";

    case "approved":
      return "Approved";

    default:
      return status;
  }
};

const getStatusClass = (
  status: MoodBoardStatus
) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-700";

    case "submitted":
      return "bg-blue-50 text-blue-700";

    case "changes_requested":
      return "bg-amber-50 text-amber-700";

    case "approved":
      return "bg-green-50 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

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
      <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              Loading Mood Boards...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="text-sm text-red-600">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#3F3026]">
              Mood Boards
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage design boards for your
              assigned projects.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {total} project
            {total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Search */}

        <div className="mb-5">
          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder="Search client name or email..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Empty */}

        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-base font-medium text-[#3F3026]">
              No projects found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "No projects match your search."
                : "You don't have any accepted projects yet."}
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

                return (
                  <Link
                    key={item._id}
                    to={`/designer/moodboards/${projectId}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#C68E4F] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-[#3F3026]">
                          {item.client
                            ?.fullName ||
                            "Client"}
                        </h2>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {item.client
                            ?.email ||
                            "No email"}
                        </p>
                      </div>

                      {moodBoard ? (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                            moodBoard.status
                          )}`}
                        >
                          {getStatusLabel(
                            moodBoard.status
                          )}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                          Not Created
                        </span>
                      )}
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3">
                      {moodBoard ? (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Versions
                          </span>

                          <span className="font-medium text-gray-700">
                            {
                              moodBoard
                                .versions
                                .length
                            }
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Mood Board
                          </span>

                          <span className="font-medium text-[#8B5E3C] group-hover:underline">
                            Create →
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
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
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-xs text-gray-500">
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
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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