import { useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  useAddMoodBoardVersion,
  useDesignerMoodBoard,
  useSubmitMoodBoard,
} from "../hooks/useMoodBoards";

import { useQuotationByProject } from "../../quotations/hooks/useQuotations";

import { useProjectById } from "../../projects/hooks/useProjects";

import ProjectSummaryCard from "../../projects/components/ProjectSummaryCard";

import {
  getProjectCategoryName,
  getProjectClientName,
  getProjectImage,
  getProjectName,
  getProjectSource,
} from "../../projects/utils/projectPresentation";

import {
  moodBoardFormSchema,
  type MoodBoardFormValues,
} from "../schema/moodboard.schema";

import type {
  IMoodBoardFile,
} from "../types/moodboard.types";

import CreateMoodBoardForm from "../components/CreateMoodBoardForm";

import SafeImage from "../../../shared/components/ui/SafeImage";

import {
  getApiError,
  getErrorMessage,
} from "../../../shared/utils/errors";

import {
  moodBoardStatusLabels,
  moodBoardStatusStyles,
} from "../utils/moodboardPresentation";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const isImageFile = (file: IMoodBoardFile) => {
  return file.fileType === "image";
};

export default function DesignerMoodBoardDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const location = useLocation();

  const projectOrigin =
    `${location.pathname}${location.search}`;

  const {
    data: moodBoard,
    isLoading,
    isError,
    error,
    refetch,
  } = useDesignerMoodBoard(projectId);

  const projectQuery = useProjectById(
    projectId ?? ""
  );

  const quotationQuery = useQuotationByProject(
    projectId ?? "",
    Boolean(projectId)
  );

  const addVersionMutation = useAddMoodBoardVersion();

  const submitMutation = useSubmitMoodBoard();

  const projectData = projectQuery.data;

  const projectSource = getProjectSource(
    projectData?.sourceRequest
  );

  const projectName = getProjectName(projectSource);

  const projectImage = getProjectImage(projectSource);

  const projectCategory =
    getProjectCategoryName(projectSource);

  const projectClientName = getProjectClientName(
    projectData?.client
  );

  const quotationErrorDetails = getApiError(
    quotationQuery.error
  );

  const quotationMissing =
    quotationQuery.isError &&
    quotationErrorDetails.status === 404;

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

  if (!projectId) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-ember/25 bg-surface p-8 text-center">
          <p className="text-sm text-ember">
            Project ID is missing.
          </p>
        </div>
      </div>
    );
  }

  if (
    isLoading ||
    projectQuery.isLoading ||
    (!moodBoard && quotationQuery.isLoading)
  ) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted">
              Loading Mood Board...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    projectQuery.isError ||
    !projectData
  ) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-ember/25 bg-surface p-6">
          <h2 className="font-serif text-xl font-bold text-ember">
            Unable to load project
          </h2>

          <p className="mt-2 text-sm text-ember">
            {getErrorMessage(projectQuery.error)}
          </p>

          <Link
            to="/designer/moodboards"
            className="mt-4 inline-flex text-sm font-medium text-clay hover:underline"
          >
            Back to Mood Boards
          </Link>
        </div>
      </div>
    );
  }

  if (isError && !moodBoard) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-ember/25 bg-surface p-6 text-center">
            <p className="text-sm text-ember">
              {getErrorMessage(error) ||
                "Failed to load Mood Board."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    !moodBoard &&
    quotationQuery.isError &&
    !quotationMissing
  ) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-ember/25 bg-surface p-6">
          <h2 className="font-serif text-xl font-bold text-ember">
            Unable to check quotation
          </h2>

          <p className="mt-2 text-sm text-ember">
            {getErrorMessage(quotationQuery.error)}
          </p>

          <Link
            to="/designer/moodboards"
            className="mt-4 inline-flex text-sm font-medium text-clay hover:underline"
          >
            Back to Mood Boards
          </Link>
        </div>
      </div>
    );
  }

  /*
   * No Mood Board yet.
   */
  if (!moodBoard) {
    const quotationAccepted =
      quotationQuery.data?.status ===
      "client_accepted";

    if (!quotationAccepted) {
      return (
        <div className="min-h-full bg-cream p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/designer/moodboards"
              className="mb-5 inline-flex text-sm text-clay hover:underline"
            >
              ← Back to Mood Boards
            </Link>

            <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                Quotation required
              </span>

              <h1 className="mt-4 font-serif text-2xl font-bold text-charcoal">
                Mood Board not available yet
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                The client must accept the quotation
                before you can create a mood board for
                this project.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/designer/projects/${projectId}/quotation`}
                  className="rounded-lg bg-clay px-4 py-2 text-sm font-medium text-cream hover:bg-ember"
                >
                  View Quotation
                </Link>

                <Link
                  to={`/designer/projects/${projectId}`}
                  state={{ from: projectOrigin }}
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-charcoal hover:bg-panel"
                >
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/designer/moodboards"
            className="mb-5 inline-flex text-sm text-clay hover:underline"
          >
            ← Back to Mood Boards
          </Link>

          <div className="mb-5">
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              New Mood Board
            </h1>

            <p className="mt-1 text-sm text-muted">
              Upload the first design version for this
              project.
            </p>
          </div>

          <ProjectSummaryCard
            image={projectImage}
            projectName={projectName}
            clientName={projectClientName}
            aside={
              <span className="inline-flex rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                Ready to create
              </span>
            }
            meta={
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Category
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {projectCategory ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Required by
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {projectSource?.needBy
                      ? new Date(
                          projectSource.needBy
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </p>
                </div>
              </>
            }
          />

          <div className="mt-6">
            <CreateMoodBoardForm
              projectId={projectId}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </div>
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
    <div className="min-h-full bg-cream p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/designer/moodboards"
          className="mb-5 inline-flex text-sm text-clay hover:underline"
        >
          ← Back to Mood Boards
        </Link>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Mood Board
            </h1>

            <p className="mt-1 text-sm text-muted">
              Manage design versions and client
              feedback.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
              moodBoardStatusStyles[
                moodBoard.status
              ]
            }`}
          >
            {moodBoardStatusLabels[moodBoard.status]}
          </span>
        </div>

        <div className="mb-6">
          <ProjectSummaryCard
            image={projectImage}
            projectName={projectName}
            clientName={projectClientName}
            meta={
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Category
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {projectCategory ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Versions
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {moodBoard.versions.length}
                  </p>
                </div>
              </>
            }
          />
        </div>

        {/* CURRENT VERSION */}
        {latestVersion && (
          <section className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Current Version
                </p>

                <h2 className="mt-1 font-serif text-lg font-bold text-charcoal">
                  Version {latestVersion.versionNumber}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  moodBoardStatusStyles[
                    latestVersion.status
                  ]
                }`}
              >
                {
                  moodBoardStatusLabels[
                    latestVersion.status
                  ]
                }
              </span>
            </div>

            {latestVersion.designerNotes && (
              <div className="mt-4 rounded-lg bg-cream p-3">
                <p className="text-xs font-medium text-muted">
                  Designer Notes
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-charcoal">
                  {latestVersion.designerNotes}
                </p>
              </div>
            )}

            {latestVersion.clientFeedback && (
              <div className="mt-4 rounded-lg border border-amber/30 bg-amber/10 p-3">
                <p className="text-xs font-medium text-amber">
                  Client Change Request
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-charcoal">
                  {latestVersion.clientFeedback}
                </p>
              </div>
            )}

            {latestVersion.clientReferenceImages &&
              latestVersion.clientReferenceImages
                .length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted">
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
                          className="overflow-hidden rounded-lg border border-border"
                        >
                          <SafeImage
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
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-amber"
                >
                  {isImageFile(file) ? (
                    <SafeImage
                      src={file.url}
                      alt={file.fileName}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-panel text-xs font-semibold text-muted">
                      PDF
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal">
                      {file.fileName}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Open file
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {canSubmit && (
              <div className="mt-5 border-t border-border/70 pt-4">
                <button
                  type="button"
                  onClick={handleSubmitMoodBoard}
                  disabled={submitMutation.isPending}
                  className="rounded-lg bg-clay px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-50"
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
        <section className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Version History
            </h2>

            <p className="mt-1 text-xs text-muted">
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
                  className="rounded-xl border border-border bg-cream p-4"
                >
                  {/* VERSION HEADER */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Mood Board Version
                      </p>

                      <h3 className="mt-1 font-serif text-lg font-bold text-charcoal">
                        Version {version.versionNumber}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        {version.files.length} file
                        {version.files.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        moodBoardStatusStyles[
                          version.status
                        ]
                      }`}
                    >
                      {
                        moodBoardStatusLabels[
                          version.status
                        ]
                      }
                    </span>
                  </div>

                  {/* DESIGNER NOTES */}
                  {version.designerNotes && (
                    <div className="mt-4 rounded-lg border border-border/70 bg-surface p-3">
                      <p className="text-xs font-medium text-muted">
                        Designer Notes
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm text-charcoal">
                        {version.designerNotes}
                      </p>
                    </div>
                  )}

                  {/* DESIGN FILES */}
                  {version.files.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-muted">
                        Design Files
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {version.files.map((file) => (
                          <a
                            key={file.publicId}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden rounded-lg border border-border bg-surface transition hover:border-amber"
                          >
                            {isImageFile(file) ? (
                              <SafeImage
                                src={file.url}
                                alt={file.fileName}
                                className="h-40 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-40 items-center justify-center bg-panel">
                                <span className="text-sm font-semibold text-muted">
                                  PDF
                                </span>
                              </div>
                            )}

                            <div className="p-3">
                              <p className="truncate text-sm font-medium text-charcoal">
                                {file.fileName}
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                Open file
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CLIENT CHANGE REQUEST */}
                  <div className="mt-4 border-t border-border pt-4">
                    {version.clientFeedback ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-medium text-amber">
                            Client Changes Requested
                          </p>

                          <p className="mt-1 text-xs text-muted">
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
                          className="w-fit rounded-lg border border-amber px-3 py-2 text-xs font-medium text-clay transition hover:bg-cream"
                        >
                          See Request
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted">
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
          <section className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4">
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Create New Version
              </h2>

              <p className="mt-1 text-xs text-muted">
                Upload an updated design based on the
                client's requested changes.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleAddVersion)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">
                  Designer Notes
                </label>

                <textarea
                  {...register("designerNotes")}
                  rows={4}
                  placeholder="Add notes about this updated design version..."
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-amber"
                />

                {errors.designerNotes && (
                  <p className="mt-1 text-xs text-ember">
                    {errors.designerNotes.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">
                  Design Files
                </label>

                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="block w-full rounded-lg border border-border bg-surface p-2 text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-medium file:text-clay"
                />

                <p className="mt-1 text-xs text-muted">
                  JPG, PNG, WEBP or PDF. Maximum 10 files,
                  10 MB each.
                </p>

                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-xs text-muted">
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
                className="rounded-lg bg-clay px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-50"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4"
            onClick={() =>
              setSelectedRequestVersion(null)
            }
          >
            <div
              className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Client Feedback
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-bold text-charcoal">
                    Version {selectedRequestVersion}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRequestVersion(null)
                  }
                  className="text-sm text-muted hover:text-charcoal"
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
                    <p className="mt-5 text-sm text-muted">
                      Change request not found.
                    </p>
                  );
                }

                return (
                  <div className="mt-5">
                    {requestVersion.clientFeedback && (
                      <div className="rounded-lg border border-amber/30 bg-amber/10 p-4">
                        <p className="text-xs font-medium text-amber">
                          Requested Changes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                          {requestVersion.clientFeedback}
                        </p>
                      </div>
                    )}

                    {requestVersion.clientReferenceImages &&
                      requestVersion.clientReferenceImages
                        .length > 0 && (
                        <div className="mt-5">
                          <p className="mb-2 text-xs font-medium text-muted">
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
                                  className="overflow-hidden rounded-lg border border-border"
                                >
                                  <SafeImage
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
                      className="mt-5 w-full rounded-lg bg-clay px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ember"
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