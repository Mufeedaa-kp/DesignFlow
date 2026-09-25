import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  useClientMoodBoards,
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
      return "Ready for Review";
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

export default function ClientMoodBoardsPage() {
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
  } = useClientMoodBoards({
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
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#3F3026]">
              Mood Boards
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review your latest design versions.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {total} project
            {total !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder="Search project or designer..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-base font-medium text-[#3F3026]">
              No Mood Boards found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "No Mood Boards match your search."
                : "Your designer has not created a Mood Board yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const projectId =
                  typeof item.project ===
                  "string"
                    ? item.project
                    : item.project._id;

                const designer =
                  typeof item.designer ===
                  "string"
                    ? null
                    : item.designer;

                const latestVersion =
                  item.versions[
                    item.versions.length - 1
                  ];

                return (
                  <Link
                    key={item._id}
                    to={`/client/moodboards/${projectId}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#C68E4F] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold text-[#3F3026]">
                          Mood Board
                        </h2>

                        {designer && (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            Designer:{" "}
                            {designer.fullName}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(
                          item.status
                        )}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Current Version
                        </span>

                        <span className="font-medium text-gray-700">
                          {latestVersion
                            ? `Version ${latestVersion.versionNumber}`
                            : "No version"}
                        </span>
                      </div>

                      {latestVersion && (
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Design files
                          </span>

                          <span className="font-medium text-gray-700">
                            {
                              latestVersion
                                .files
                                .length
                            }
                          </span>
                        </div>
                      )}

                      <div className="mt-3 text-right">
                        <span className="text-xs font-medium text-[#8B5E3C] group-hover:underline">
                          View Mood Board →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

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
                  Page {page} of {totalPages}
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