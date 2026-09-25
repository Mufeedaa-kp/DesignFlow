import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  useAddMoodBoardVersion,
  useDesignerMoodBoard,
  useSubmitMoodBoard,
} from "../hooks/useMoodBoards";

import {
  moodBoardFormSchema,
  type MoodBoardFormValues,
} from "../schema/moodboard.schema";

import type {
  IMoodBoardFile,
  MoodBoardStatus,
} from "../types/moodboard.types";

import CreateMoodBoardForm from "../components/CreateMoodBoardForm";

import { getErrorMessage } from "../../../shared/utils/errors";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const getStatusLabel = (status: MoodBoardStatus) => {
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

const getStatusClass = (status: MoodBoardStatus) => {
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

const isImageFile = (file: IMoodBoardFile) => {
  return file.fileType === "image";
};

export default function DesignerMoodBoardDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();

  const {
    data: moodBoard,
    isLoading,
    isError,
    error,
    refetch,
  } = useDesignerMoodBoard(projectId);

  const addVersionMutation = useAddMoodBoardVersion();

  const submitMutation = useSubmitMoodBoard();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [selectedRequestVersion, setSelectedRequestVersion] =
    useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MoodBoardFormValues>({
    resolver: zodResolver(moodBoardFormSchema),
    defaultValues: {
      designerNotes: "",
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 files.");
      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10 MB limit.`);
        event.target.value = "";
        return;
      }
    }

    setSelectedFiles(files);
  };

  const handleAddVersion = async (
    values: MoodBoardFormValues
  ) => {
    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      await addVersionMutation.mutateAsync({
        projectId,
        data: {
          designerNotes: values.designerNotes,
        },
        files: selectedFiles,
      });

      toast.success("New Mood Board version created.");

      setSelectedFiles([]);
      reset();

      await refetch();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) ||
          "Failed to create new Mood Board version."
      );
    }
  };

  const handleSubmitMoodBoard = async () => {
    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }

    try {
      await submitMutation.mutateAsync(projectId);

      toast.success("Mood Board submitted to client.");

      await refetch();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) ||
          "Failed to submit Mood Board."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              Loading Mood Board...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const message = getErrorMessage(error);

    if (
      message.toLowerCase().includes("mood board not found") ||
      message.toLowerCase().includes("no mood board")
    ) {
      if (!projectId) {
        return (
          <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
            <div className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-white p-8 text-center">
              <p className="text-sm text-red-600">
                Project ID is missing.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() =>
                navigate("/designer/moodboards")
              }
              className="mb-5 text-sm text-[#8B5E3C] hover:underline"
            >
              ← Back to Mood Boards
            </button>

            <div className="mb-5">
              <h1 className="text-xl font-semibold text-[#3F3026]">
                New Mood Board
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Upload the first design version for this
                project.
              </p>
            </div>

            <CreateMoodBoardForm
              projectId={projectId}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="text-sm text-red-600">
              {message || "Failed to load Mood Board."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * No Mood Board yet.
   */
  if (!moodBoard) {
    if (!projectId) {
      return (
        <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
          <div className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="text-sm text-red-600">
              Project ID is missing.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              navigate("/designer/moodboards")
            }
            className="mb-5 text-sm text-[#8B5E3C] hover:underline"
          >
            ← Back to Mood Boards
          </button>

          <div className="mb-5">
            <h1 className="text-xl font-semibold text-[#3F3026]">
              New Mood Board
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Upload the first design version for this
              project.
            </p>
          </div>

          <CreateMoodBoardForm
            projectId={projectId}
            onSuccess={async () => {
              await refetch();
            }}
          />
        </div>
      </div>
    );
  }

  const latestVersion =
    moodBoard.versions[
      moodBoard.versions.length - 1
    ];

  const canSubmit =
    latestVersion?.status === "draft";

  const canCreateNewVersion =
    latestVersion?.status === "changes_requested";

  return (
    <div className="min-h-full bg-[#F8F6F2] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate("/designer/moodboards")
          }
          className="mb-5 text-sm text-[#8B5E3C] hover:underline"
        >
          ← Back to Mood Boards
        </button>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#3F3026]">
              Mood Board
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage design versions and client
              feedback.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
              moodBoard.status
            )}`}
          >
            {getStatusLabel(moodBoard.status)}
          </span>
        </div>

        {/* CURRENT VERSION */}
        {latestVersion && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Current Version
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#3F3026]">
                  Version {latestVersion.versionNumber}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                  latestVersion.status
                )}`}
              >
                {getStatusLabel(
                  latestVersion.status
                )}
              </span>
            </div>

            {latestVersion.designerNotes && (
              <div className="mt-4 rounded-lg bg-[#F8F6F2] p-3">
                <p className="text-xs font-medium text-gray-500">
                  Designer Notes
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {latestVersion.designerNotes}
                </p>
              </div>
            )}

            {latestVersion.clientFeedback && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-700">
                  Client Change Request
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">
                  {latestVersion.clientFeedback}
                </p>
              </div>
            )}

            {latestVersion.clientReferenceImages &&
              latestVersion.clientReferenceImages
                .length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Client Reference Images
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {latestVersion.clientReferenceImages.map(
                      (image, index) => (
                        <a
                          key={`${image}-${index}`}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={image}
                            alt={`Client reference ${
                              index + 1
                            }`}
                            className="h-32 w-full object-cover"
                          />
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {latestVersion.files.map((file) => (
                <a
                  key={file.publicId}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-[#C68E4F]"
                >
                  {isImageFile(file) ? (
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500">
                      PDF
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {file.fileName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Open file
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {canSubmit && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleSubmitMoodBoard}
                  disabled={submitMutation.isPending}
                  className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#754C31] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit to Client"}
                </button>
              </div>
            )}
          </section>
        )}

        {/* VERSION HISTORY */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#3F3026]">
              Version History
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              All mood board versions and client
              feedback.
            </p>
          </div>

          <div className="space-y-5">
            {moodBoard.versions
              .slice()
              .reverse()
              .map((version) => (
                <div
                  key={
                    version._id ??
                    version.versionNumber
                  }
                  className="rounded-xl border border-gray-200 bg-[#FAFAF9] p-4"
                >
                  {/* VERSION HEADER */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Mood Board Version
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-[#3F3026]">
                        Version {version.versionNumber}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {version.files.length} file
                        {version.files.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                        version.status
                      )}`}
                    >
                      {getStatusLabel(
                        version.status
                      )}
                    </span>
                  </div>

                  {/* DESIGNER NOTES */}
                  {version.designerNotes && (
                    <div className="mt-4 rounded-lg border border-gray-100 bg-white p-3">
                      <p className="text-xs font-medium text-gray-500">
                        Designer Notes
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                        {version.designerNotes}
                      </p>
                    </div>
                  )}

                  {/* DESIGN FILES */}
                  {version.files.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Design Files
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {version.files.map((file) => (
                          <a
                            key={file.publicId}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-[#C68E4F]"
                          >
                            {isImageFile(file) ? (
                              <img
                                src={file.url}
                                alt={file.fileName}
                                className="h-40 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-40 items-center justify-center bg-gray-100">
                                <span className="text-sm font-semibold text-gray-500">
                                  PDF
                                </span>
                              </div>
                            )}

                            <div className="p-3">
                              <p className="truncate text-sm font-medium text-gray-700">
                                {file.fileName}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Open file
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CLIENT CHANGE REQUEST */}
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {version.clientFeedback ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-medium text-amber-700">
                            Client Changes Requested
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            The client requested changes
                            for this version.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedRequestVersion(
                              version.versionNumber
                            )
                          }
                          className="w-fit rounded-lg border border-[#C68E4F] px-3 py-2 text-xs font-medium text-[#8B5E3C] transition hover:bg-[#F8F6F2]"
                        >
                          See Request
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        No client change request for this
                        version.
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* NEW VERSION */}
        {canCreateNewVersion && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#3F3026]">
                Create New Version
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Upload an updated design based on the
                client's requested changes.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleAddVersion)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Designer Notes
                </label>

                <textarea
                  {...register("designerNotes")}
                  rows={4}
                  placeholder="Add notes about this updated design version..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#C68E4F]"
                />

                {errors.designerNotes && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.designerNotes.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Design Files
                </label>

                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#F8F6F2] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#8B5E3C]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG, WEBP or PDF. Maximum 10 files,
                  10 MB each.
                </p>

                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-xs text-gray-600">
                    {selectedFiles.length} file
                    {selectedFiles.length !== 1
                      ? "s"
                      : ""}{" "}
                    selected.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={addVersionMutation.isPending}
                className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#754C31] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addVersionMutation.isPending
                  ? "Creating..."
                  : "Create New Version"}
              </button>
            </form>
          </section>
        )}

        {/* CHANGE REQUEST MODAL */}
        {selectedRequestVersion !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() =>
              setSelectedRequestVersion(null)
            }
          >
            <div
              className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Client Feedback
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#3F3026]">
                    Version {selectedRequestVersion}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRequestVersion(null)
                  }
                  className="text-sm text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const requestVersion =
                  moodBoard.versions.find(
                    (version) =>
                      version.versionNumber ===
                      selectedRequestVersion
                  );

                if (!requestVersion) {
                  return (
                    <p className="mt-5 text-sm text-gray-500">
                      Change request not found.
                    </p>
                  );
                }

                return (
                  <div className="mt-5">
                    {requestVersion.clientFeedback && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs font-medium text-amber-700">
                          Requested Changes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-900">
                          {requestVersion.clientFeedback}
                        </p>
                      </div>
                    )}

                    {requestVersion.clientReferenceImages &&
                      requestVersion.clientReferenceImages
                        .length > 0 && (
                        <div className="mt-5">
                          <p className="mb-2 text-xs font-medium text-gray-500">
                            Client Reference Images
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {requestVersion.clientReferenceImages.map(
                              (image, index) => (
                                <a
                                  key={`${image}-${index}`}
                                  href={image}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="overflow-hidden rounded-lg border border-gray-200"
                                >
                                  <img
                                    src={image}
                                    alt={`Client reference ${
                                      index + 1
                                    }`}
                                    className="h-32 w-full object-cover"
                                  />
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequestVersion(null)
                      }
                      className="mt-5 w-full rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#754C31]"
                    >
                      Close
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}