import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createColorThemeSchema,
  updateColorThemeSchema,
  type ColorThemeFormValues,
} from "../schema/colorTheme.schema";

import type { IColorTheme } from "../types/catalog.types";

interface ColorThemeFormProps {
  colorTheme?: IColorTheme;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ColorThemeForm = ({
  colorTheme,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ColorThemeFormProps) => {
  const isEditMode = Boolean(colorTheme);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ColorThemeFormValues>({
    resolver: zodResolver(
      isEditMode
        ? updateColorThemeSchema
        : createColorThemeSchema
    ),
    defaultValues: {
      name: colorTheme?.name ?? "",
    },
  });

  const handleFormSubmit = (
    data: ColorThemeFormValues
  ) => {
    const formData = new FormData();

    formData.append("name", data.name);

    if (data.image) {
      Array.from(data.image).forEach((file) => {
        formData.append("image", file);
      });
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 rounded-xl bg-white p-5 shadow-sm"
    >
      {/* Name */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Color Theme Name
        </label>

        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Warm Beige"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]/20"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message?.toString()}
          </p>
        )}
      </div>

      {/* Current Image */}

      {isEditMode && colorTheme?.image && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">
            Current Image
          </p>

          <img
            src={colorTheme.image}
            alt={colorTheme.name}
            className="h-24 w-24 rounded-lg object-cover"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Select a new image only if you want to replace it.
          </p>
        </div>
      )}

      {/* Image */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {isEditMode
            ? "Replace Image (Optional)"
            : "Image"}
        </label>

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />

        {errors.image && (
          <p className="mt-1 text-xs text-red-500">
            {errors.image.message?.toString()}
          </p>
        )}
      </div>

      {/* Actions */}

      <div className="flex gap-2.5 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70482F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update"
              : "Add"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ColorThemeForm;