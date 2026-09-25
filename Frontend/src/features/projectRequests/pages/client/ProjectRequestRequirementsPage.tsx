import { useEffect, type ChangeEvent } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  projectRequestRequirementsSchema,
} from "../../schema/projectRequest.schema";

import type {
  ProjectRequestRequirementsFormValues,
} from "../../schema/projectRequest.schema";

interface ProjectRequestRequirementsPageProps {
  projectName: string;

  measurements: {
    height: number;
    width: number;
    unit: "ft" | "cm";
    squareFeet: number;
  };

  description: string;
  referenceImages: string[];
  needBy: string;

  onRequirementsSubmit: (
    data: Pick<
      ProjectRequestRequirementsFormValues,
      | "projectName"
      | "measurements"
      | "description"
      | "needBy"
    >
  ) => void;

  onReferenceImagesChange: (
    files: File[]
  ) => void;

  onBack: () => void;
}

const ProjectRequestRequirementsPage = ({
  projectName,
  measurements,
  description,
  referenceImages,
  needBy,
  onRequirementsSubmit,
  onReferenceImagesChange,
  onBack,
}: ProjectRequestRequirementsPageProps) => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

const {
  register,
  handleSubmit,
  setValue,
  control,
  formState: {
    errors,
  },
} = useForm<ProjectRequestRequirementsFormValues>({
    resolver: zodResolver(
      projectRequestRequirementsSchema
    ),

    defaultValues: {
      projectName,

      measurements: {
        height:
          measurements.height || undefined,

        width:
          measurements.width || undefined,

        unit:
          measurements.unit || "ft",

        squareFeet:
          measurements.squareFeet ||
          undefined,
      },

      description,
      needBy,
    },
  });

const height = useWatch({
  control,
  name: "measurements.height",
});

const width = useWatch({
  control,
  name: "measurements.width",
});

const unit = useWatch({
  control,
  name: "measurements.unit",
});

  useEffect(() => {
    if (
      !height ||
      !width ||
      height <= 0 ||
      width <= 0
    ) {
      setValue(
        "measurements.squareFeet",
        0
      );

      return;
    }

    let squareFeet = 0;

    if (unit === "ft") {
      squareFeet = height * width;
    }

    if (unit === "cm") {
      squareFeet =
        (height / 30.48) *
        (width / 30.48);
    }

    setValue(
      "measurements.squareFeet",
      Number(squareFeet.toFixed(2))
    );
  }, [
    height,
    width,
    unit,
    setValue,
  ]);

  const handleReferenceImagesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) return;

    const selectedFiles = Array.from(files);

    onReferenceImagesChange(
      selectedFiles
    );

    event.target.value = "";
  };

  const handleFormSubmit = (
    data: ProjectRequestRequirementsFormValues
  ) => {
    onRequirementsSubmit({
      projectName: data.projectName,
      measurements: data.measurements,
      description: data.description,
      needBy: data.needBy,
    });
  };

  return (
    <>
      {/* Header */}

      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#3F342C] sm:text-2xl">
          Project Requirements
        </h1>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
          Provide the measurements and details needed
          for your interior design project.
        </p>
      </div>

      {/* Progress */}

      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-400">
          1. Category
        </span>

        <span className="text-[#D9C7A3]">
          →
        </span>

        <span className="text-gray-400">
          2. Design
        </span>

        <span className="text-[#D9C7A3]">
          →
        </span>

        <span className="text-gray-400">
          3. Options
        </span>

        <span className="text-[#D9C7A3]">
          →
        </span>

        <span className="font-medium text-[#8B5E3C]">
          4. Requirements
        </span>

        <span className="text-[#D9C7A3]">
          →
        </span>

        <span className="text-gray-400">
          5. Review
        </span>
      </div>

      <form
        onSubmit={handleSubmit(
          handleFormSubmit
        )}
        className="rounded-xl border border-[#EDE5DC] bg-[#FFFDFC] p-4 shadow-sm sm:p-5"
      >
        {/* Project Name */}

        <section className="rounded-lg bg-[#F8F6F2] p-4">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[#3F342C] sm:text-lg">
              Project Name
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Give your project a name so you can
              easily identify it later.
            </p>
          </div>

          <input
            type="text"
            maxLength={100}
            placeholder="e.g. My New Kitchen"
            {...register("projectName")}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
              errors.projectName
                ? "border-red-400"
                : "border-[#E4D9CD]"
            }`}
          />

          {errors.projectName && (
            <p className="mt-1.5 text-xs text-red-500">
              {
                errors.projectName
                  .message
              }
            </p>
          )}
        </section>

        <div className="my-6 border-t border-[#EDE5DC]" />

        {/* Measurements */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#3F342C] sm:text-lg">
              Measurements
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Enter the approximate dimensions of your
              space.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Height */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
                Height
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter height"
                {...register(
                  "measurements.height",
                  {
                    valueAsNumber: true,
                  }
                )}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
                  errors.measurements?.height
                    ? "border-red-400"
                    : "border-[#E4D9CD]"
                }`}
              />

              {errors.measurements?.height && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.measurements
                      .height
                      .message
                  }
                </p>
              )}
            </div>

            {/* Width */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
                Width
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter width"
                {...register(
                  "measurements.width",
                  {
                    valueAsNumber: true,
                  }
                )}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
                  errors.measurements?.width
                    ? "border-red-400"
                    : "border-[#E4D9CD]"
                }`}
              />

              {errors.measurements?.width && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.measurements
                      .width
                      .message
                  }
                </p>
              )}
            </div>

            {/* Unit */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
                Measurement Unit
              </label>

              <select
                {...register(
                  "measurements.unit"
                )}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
                  errors.measurements?.unit
                    ? "border-red-400"
                    : "border-[#E4D9CD]"
                }`}
              >
                <option value="ft">
                  Feet (ft)
                </option>

                <option value="cm">
                  Centimeters (cm)
                </option>
              </select>

              {errors.measurements?.unit && (
                <p className="mt-1 text-[11px] text-red-500">
                  {
                    errors.measurements
                      .unit
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* Square Feet */}

          <div className="mt-3 max-w-sm">
            <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm">
              Square Feet
            </label>

            <input
              type="number"
              readOnly
              {...register(
                "measurements.squareFeet",
                {
                  valueAsNumber: true,
                }
              )}
              className="w-full cursor-not-allowed rounded-lg border border-[#E4D9CD] bg-[#F8F6F2] px-3 py-2.5 text-sm text-gray-700 outline-none"
            />

            <p className="mt-1 text-[11px] text-gray-400">
              Automatically calculated from height and
              width.
            </p>

            {errors.measurements?.squareFeet && (
              <p className="mt-1 text-[11px] text-red-500">
                {
                  errors.measurements
                    .squareFeet
                    .message
                }
              </p>
            )}
          </div>
        </section>

        <div className="my-6 border-t border-[#EDE5DC]" />

        {/* Description */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#3F342C] sm:text-lg">
              Project Description
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Tell us more about what you are looking
              for.
            </p>
          </div>

          <textarea
            rows={5}
            maxLength={2000}
            placeholder="Describe your requirements, preferred style, storage needs, colors, or anything else we should know..."
            {...register("description")}
            className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm leading-5 outline-none transition placeholder:text-gray-400 focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
              errors.description
                ? "border-red-400"
                : "border-[#E4D9CD]"
            }`}
          />

          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500">
              {
                errors.description
                  .message
              }
            </p>
          )}

          <p className="mt-1.5 text-right text-[10px] text-gray-400">
            Maximum 2000 characters
          </p>
        </section>

        <div className="my-6 border-t border-[#EDE5DC]" />

        {/* Reference Images */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#3F342C] sm:text-lg">
              Reference Images
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Upload images that show your preferred
              design, style, colors, or inspiration.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D9C7A3] bg-[#F8F6F2] px-4 py-7 text-center transition hover:bg-[#F3EDE5]">
            <span className="text-xs font-medium text-[#5B4638] sm:text-sm">
              Click to upload images
            </span>

            <span className="mt-1.5 text-[10px] text-gray-400 sm:text-xs">
              JPG, JPEG, PNG, WEBP, GIF, HEIC •
              Maximum 10 images
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
              multiple
              onChange={
                handleReferenceImagesChange
              }
              className="hidden"
            />
          </label>

          {referenceImages.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                Uploaded Images
              </p>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
                {referenceImages.map(
                  (image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-lg border border-[#E4D9CD] bg-[#F8F6F2]"
                    >
                      <img
                        src={image}
                        alt={`Reference ${
                          index + 1
                        }`}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        <div className="my-6 border-t border-[#EDE5DC]" />

        {/* Need By */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#3F342C] sm:text-lg">
              Required By
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Let us know when you would ideally like
              the project to be completed.
            </p>
          </div>

          <div className="max-w-sm">
            <input
              type="date"
              min={today}
              {...register("needBy")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#D9C7A3] ${
                errors.needBy
                  ? "border-red-400"
                  : "border-[#E4D9CD]"
              }`}
            />

            {errors.needBy && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.needBy.message}
              </p>
            )}
          </div>
        </section>

        {/* Navigation */}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#8B5E3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
};

export default ProjectRequestRequirementsPage;