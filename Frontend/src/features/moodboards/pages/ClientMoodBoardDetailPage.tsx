import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  useClientMoodBoard,
  useRequestMoodBoardChanges,
  useApproveMoodBoard,
} from "../hooks/useMoodBoards";

const changeRequestSchema = z.object({
  clientFeedback: z
    .string()
    .trim()
    .min(1, "Please describe the changes you need")
    .max(2000, "Feedback cannot exceed 2000 characters"),
});

import { getErrorMessage, notifyClientError } from "../../../shared/utils/errors";

type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;



const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-50 text-blue-700",
  changes_requested: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Ready for Review",
  changes_requested: "Changes Requested",
  approved: "Approved",
};

export default function ClientMoodBoardDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: moodBoard,
    isLoading,
    isError,
    error,
  } = useClientMoodBoard(projectId);

  const requestChangesMutation = useRequestMoodBoardChanges();
  const approveMutation = useApproveMoodBoard();

  const [showChangesForm, setShowChangesForm] = useState(false);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeRequestFormValues>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: {
      clientFeedback: "",
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-[#E8DED2] bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Loading mood board...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !moodBoard) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">
            {getErrorMessage(error) ||
              "Unable to load mood board."}
          </p>

          <Link
            to="/client/projects"
            className="mt-3 inline-block text-xs font-medium text-[#8B5E3C] hover:underline"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const version = moodBoard.currentVersion;

  const designer =
    typeof moodBoard.designer === "string"
      ? null
      : moodBoard.designer;

  const handleApprove = async () => {
    if (!projectId) return;

    try {
      await approveMutation.mutateAsync(projectId);

      toast.success("Mood board approved successfully");
    } catch (error) {
      notifyClientError(error);
    }
  };

  const handleReferenceImages = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        )
    );

    if (invalidFile) {
      toast.error(
        "Only JPG, PNG, and WEBP images are allowed."
      );
      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error("Each image must be smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setReferenceImages(files);
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const handleRequestChanges = async (
    values: ChangeRequestFormValues
  ) => {
    if (!projectId) return;

    try {
      await requestChangesMutation.mutateAsync({
        projectId,
        data: {
          clientFeedback: values.clientFeedback,
        },
        referenceImages,
      });

      toast.success("Change request sent to the designer");

      reset();
      setReferenceImages([]);
      setShowChangesForm(false);
    } catch (error) {
      notifyClientError(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/client/projects"
              className="text-xs font-medium text-[#8B5E3C] hover:underline"
            >
              ← Back to Projects
            </Link>

            <h1 className="mt-2 text-xl font-semibold text-[#2F2A26]">
              Mood Board
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review your designer's latest mood board.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
              statusStyles[moodBoard.status] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabels[moodBoard.status] ||
              moodBoard.status}
          </span>
        </div>

        {/* Designer */}
        <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
          <p className="text-xs text-gray-500">Designer</p>

          <p className="mt-1 text-sm font-medium text-[#2F2A26]">
            {designer?.fullName || "Assigned Designer"}
          </p>
        </div>

        {/* Draft */}
        {moodBoard.status === "draft" && (
          <div className="rounded-xl border border-[#E8DED2] bg-white p-8 text-center">
            <h2 className="text-base font-semibold text-[#2F2A26]">
              Your mood board is being prepared
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your designer is still working on the mood board.
              You will be able to review it once it is submitted.
            </p>
          </div>
        )}

      
        {version && moodBoard.status !== "draft" && (
          <>
        
            <div className="rounded-xl border border-[#E8DED2] bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    Current Version
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-[#2F2A26]">
                    Version {version.versionNumber}
                  </h2>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[version.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusLabels[version.status] ||
                    version.status}
                </span>
              </div>

             
              {version.designerNotes && (
                <div className="mt-5 rounded-lg bg-[#F8F6F2] p-4">
                  <p className="text-xs font-medium text-[#8B5E3C]">
                    Designer Notes
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {version.designerNotes}
                  </p>
                </div>
              )}

              
              {version.clientFeedback && (
                <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-medium text-amber-700">
                    Your Previous Feedback
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-800">
                    {version.clientFeedback}
                  </p>
                </div>
              )}
            </div>

           
            <div className="rounded-xl border border-[#E8DED2] bg-white p-5">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[#2F2A26]">
                  Mood Board Files
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Review the designs shared by your designer.
                </p>
              </div>

              {version.files?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {version.files.map((file) => (
                    <a
                      key={file.publicId}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-xl border border-[#E8DED2] bg-[#F8F6F2] transition hover:border-[#C68E4F]"
                    >
                      {file.fileType === "image" ? (
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl">
                              📄
                            </div>

                            <p className="mt-2 text-xs font-medium text-[#8B5E3C]">
                              Open PDF
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-[#E8DED2] bg-white p-3">
                        <p className="truncate text-xs font-medium text-[#2F2A26]">
                          {file.fileName}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No mood board files available.
                </p>
              )}
            </div>

            {/* Client Actions */}
            {moodBoard.status === "submitted" && (
              <div className="rounded-xl border border-[#E8DED2] bg-white p-5">
                {!showChangesForm ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowChangesForm(true)}
                      className="rounded-lg border border-[#D9C7A3] px-5 py-2.5 text-sm font-medium text-[#8B5E3C] transition hover:bg-[#F8F6F2]"
                    >
                      Request Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                      className="rounded-lg bg-[#8B5E3C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#70492F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {approveMutation.isPending
                        ? "Approving..."
                        : "Approve Mood Board"}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(
                      handleRequestChanges
                    )}
                    className="space-y-5"
                  >
                    {/* Feedback */}
                    <div>
                      <label className="text-sm font-medium text-[#2F2A26]">
                        What would you like to change?
                      </label>

                      <textarea
                        {...register("clientFeedback")}
                        rows={5}
                        placeholder="Describe the changes you would like..."
                        className="mt-2 w-full rounded-lg border border-[#D9C7A3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8B5E3C]"
                      />

                      {errors.clientFeedback && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.clientFeedback.message}
                        </p>
                      )}
                    </div>

                    {/* Reference Images */}
                    <div>
                      <label className="text-sm font-medium text-[#2F2A26]">
                        Reference Images
                      </label>

                      <p className="mt-1 text-xs text-gray-500">
                        Upload images to show your designer what you
                        would like to change.
                      </p>

                      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D9C7A3] bg-[#F8F6F2] px-4 py-6 text-center transition hover:border-[#8B5E3C]">
                        <span className="text-sm font-medium text-[#8B5E3C]">
                          + Upload Reference Images
                        </span>

                        <span className="mt-1 text-xs text-gray-500">
                          JPG, PNG or WEBP · Maximum 5 images · 10MB each
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleReferenceImages}
                          className="hidden"
                        />
                      </label>

                      {/* Selected Images */}
                      {referenceImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                          {referenceImages.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="group relative overflow-hidden rounded-lg border border-[#E8DED2] bg-white"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-24 w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeReferenceImage(index)
                                }
                                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                              >
                                ×
                              </button>

                              <p className="truncate px-2 py-1 text-[10px] text-gray-500">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          setReferenceImages([]);
                          setShowChangesForm(false);
                        }}
                        className="rounded-lg border border-[#D9C7A3] px-4 py-2 text-sm text-gray-600 transition hover:bg-[#F8F6F2]"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          requestChangesMutation.isPending
                        }
                        className="rounded-lg bg-[#8B5E3C] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#70492F] disabled:opacity-60"
                      >
                        {requestChangesMutation.isPending
                          ? "Sending..."
                          : "Send Request"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Approved */}
            {moodBoard.status === "approved" && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                <p className="text-sm font-semibold text-green-700">
                  Mood Board Approved
                </p>

                <p className="mt-1 text-xs text-green-600">
                  You have approved this mood board.
                </p>
              </div>
            )}

            {/* Changes Requested */}
            {moodBoard.status === "changes_requested" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                <p className="text-sm font-semibold text-amber-700">
                  Changes Requested
                </p>

                <p className="mt-1 text-xs text-amber-600">
                  Your feedback has been sent to the designer.
                  A revised mood board will appear here once it
                  is submitted.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}