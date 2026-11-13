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

    const inputClass = (hasError?: boolean) =>
    `w-full border bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition placeholder:text-muted focus:border-[var(--color-brown)] focus:ring-1 focus:ring-[var(--color-brown)] ${
      hasError ? "border-red-400" : "border-border"
    }`;
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="border border-border bg-white p-6 sm:p-8"
    >
      {/* Project Name */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Project name</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Give your project a name so you can easily identify it later.
        </p>

        <input
          type="text"
          maxLength={100}
          placeholder="e.g. My New Kitchen"
          {...register("projectName")}
          className={inputClass(!!errors.projectName)}
        />

        {errors.projectName && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.projectName.message}
          </p>
        )}
      </section>

      <div className="my-8 border-t border-border" />

      {/* Measurements */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Measurements</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Enter the approximate dimensions of your space.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Height
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter height"
              {...register("measurements.height", { valueAsNumber: true })}
              className={inputClass(!!errors.measurements?.height)}
            />
            {errors.measurements?.height && (
              <p className="mt-1 text-xs text-red-500">
                {errors.measurements.height.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Width
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter width"
              {...register("measurements.width", { valueAsNumber: true })}
              className={inputClass(!!errors.measurements?.width)}
            />
            {errors.measurements?.width && (
              <p className="mt-1 text-xs text-red-500">
                {errors.measurements.width.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Unit
            </label>
            <select
              {...register("measurements.unit")}
              className={inputClass(!!errors.measurements?.unit)}
            >
              <option value="ft">Feet (ft)</option>
              <option value="cm">Centimeters (cm)</option>
            </select>
            {errors.measurements?.unit && (
              <p className="mt-1 text-xs text-red-500">
                {errors.measurements.unit.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 max-w-sm">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
            Square feet
          </label>
          <input
            type="number"
            readOnly
            {...register("measurements.squareFeet", { valueAsNumber: true })}
            className="w-full cursor-not-allowed border border-border bg-panel px-3 py-2.5 text-sm text-charcoal outline-none"
          />
          <p className="mt-1 text-xs text-muted">
            Automatically calculated from height and width.
          </p>
          {errors.measurements?.squareFeet && (
            <p className="mt-1 text-xs text-red-500">
              {errors.measurements.squareFeet.message}
            </p>
          )}
        </div>
      </section>

      <div className="my-8 border-t border-border" />

      {/* Description */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">
          Project description
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Tell us more about what you are looking for.
        </p>

        <textarea
          rows={5}
          maxLength={2000}
          placeholder="Describe your requirements, preferred style, storage needs, colors, or anything else we should know..."
          {...register("description")}
          className={`${inputClass(!!errors.description)} resize-none leading-6`}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.description.message}
          </p>
        )}

        <p className="mt-1.5 text-right text-[11px] text-muted">
          Maximum 2000 characters
        </p>
      </section>

      <div className="my-8 border-t border-border" />

      {/* Reference Images */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Reference images</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Upload images that show your preferred design, style, colors, or
          inspiration.
        </p>

        <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--color-brown)] bg-panel px-4 py-8 text-center transition hover:bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)]">
            Click to upload images
          </span>
          <span className="mt-1.5 text-xs text-muted">
            JPG, JPEG, PNG, WEBP, GIF, HEIC • Maximum 10 images
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
            multiple
            onChange={handleReferenceImagesChange}
            className="hidden"
          />
        </label>

        {referenceImages.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
              Uploaded images
            </p>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
              {referenceImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden border border-border bg-panel"
                >
                  <img
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="my-8 border-t border-border" />

      {/* Need By */}
      <section>
        <h2 className="font-serif text-2xl text-charcoal">Required by</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Let us know when you would ideally like the project completed.
        </p>

        <div className="max-w-sm">
          <input
            type="date"
            min={today}
            {...register("needBy")}
            className={inputClass(!!errors.needBy)}
          />
          {errors.needBy && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.needBy.message}
            </p>
          )}
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-panel"
        >
          Back
        </button>
        <button
          type="submit"
          className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default ProjectRequestRequirementsPage;