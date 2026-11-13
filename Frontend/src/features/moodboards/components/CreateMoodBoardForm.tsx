import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useCreateMoodBoard } from "../hooks/useMoodBoards";

import {
  moodBoardFormSchema,
  type MoodBoardFormValues,
} from "../schema/moodboard.schema";

import { getErrorMessage } from "../../../shared/utils/errors";

interface CreateMoodBoardFormProps {
  projectId: string;
  onSuccess?: () => void;
}

const CreateMoodBoardForm = ({
  projectId,
  onSuccess,
}: CreateMoodBoardFormProps) => {
  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const createMutation =
    useCreateMoodBoard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MoodBoardFormValues>({
    resolver: zodResolver(
      moodBoardFormSchema
    ),
    defaultValues: {
      designerNotes: "",
    },
  });

  const handleFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      toast.error(
        "Only JPG, JPEG, PNG, WEBP, and PDF files are allowed."
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    const oversizedFile = files.find(
      (file) =>
        file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(
        "Each file must be 10 MB or smaller."
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    if (files.length > 10) {
      toast.error(
        "You can upload a maximum of 10 files."
      );

      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(files);
  };

  const onSubmit = async (
    values: MoodBoardFormValues
  ) => {
    if (selectedFiles.length === 0) {
      toast.error(
        "Please select at least one design file."
      );
      return;
    }

    try {
      await createMutation.mutateAsync({
        data: {
          projectId,
          designerNotes: values.designerNotes,
        },
        files: selectedFiles,
      });

      toast.success(
        "Mood Board created successfully."
      );

      setSelectedFiles([]);
      reset();

      const fileInput =
        document.getElementById(
          "create-mood-board-files"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) ||
          "Failed to create Mood Board."
      );
    }
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-5">
        <h2 className="font-serif text-lg font-bold text-charcoal">
          Create Mood Board
        </h2>

        <p className="mt-1 text-sm text-muted">
          Upload the first design version for
          the client to review.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="create-designer-notes"
            className="mb-1.5 block text-sm font-medium text-charcoal"
          >
            Designer Notes
          </label>

          <textarea
            id="create-designer-notes"
            rows={4}
            {...register("designerNotes")}
            placeholder="Add notes about this design version..."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-charcoal outline-none focus:border-amber focus:ring-1 focus:ring-amber"
          />

          {errors.designerNotes && (
            <p className="mt-1 text-xs text-ember">
              {errors.designerNotes.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="create-mood-board-files"
            className="mb-1.5 block text-sm font-medium text-charcoal"
          >
            Design Files
          </label>

          <input
            id="create-mood-board-files"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFilesChange}
            className="block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />

          <p className="mt-1 text-xs text-muted">
            JPG, JPEG, PNG, WEBP or PDF.
            Maximum 10 MB per file. Maximum 10
            files.
          </p>

          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted">
                {selectedFiles.length} file
                {selectedFiles.length === 1
                  ? ""
                  : "s"}{" "}
                selected
              </p>

              <div className="mt-2 space-y-1">
                {selectedFiles.map(
                  (file, index) => (
                    <p
                      key={`${file.name}-${index}`}
                      className="truncate text-xs text-muted"
                    >
                      {file.name}
                    </p>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-clay px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending
            ? "Uploading..."
            : "Create Mood Board"}
        </button>
      </form>
    </section>
  );
};

export default CreateMoodBoardForm;