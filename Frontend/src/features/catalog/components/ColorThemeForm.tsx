
import { useEffect } from "react";
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
  onSubmit: (data: ColorThemeFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DEFAULT_COLORS: string[] = ["#1B3A6B", "#2E7D9A"];

const ColorThemeForm = ({
  colorTheme,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ColorThemeFormProps) => {
  const isEditMode = !!colorTheme;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ColorThemeFormValues>({
    resolver: zodResolver(
      isEditMode ? updateColorThemeSchema : createColorThemeSchema
    ),
    defaultValues: {
      name: colorTheme?.name ?? "",
      colors: colorTheme?.colors ?? DEFAULT_COLORS,
    },
  });

  const watchedColors: string[] = watch("colors") ?? DEFAULT_COLORS;

  useEffect(() => {
    reset({
      name: colorTheme?.name ?? "",
      colors: colorTheme?.colors ?? DEFAULT_COLORS,
    });
  }, [colorTheme, reset]);

  // Update a color
  const updateColor = (index: number, value: string) => {
    const updatedColors = watchedColors.map(
      (currentColor, currentIndex) =>
        currentIndex === index ? value : currentColor
    );

    setValue("colors", updatedColors, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Add a new color
  const addColor = () => {
    setValue("colors", [...watchedColors, "#FFFFFF"], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Remove a color
  const removeColor = (index: number) => {
    if (watchedColors.length <= 2) return;

    const updatedColors = watchedColors.filter(
      (_, currentIndex) => currentIndex !== index
    );

    setValue("colors", updatedColors, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl bg-white p-5 shadow-sm"
    >
      {/* Theme Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Color Theme Name
        </label>

        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Warm Beige"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#8B5E3C]"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Palette Preview */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Palette Preview
        </label>

        <div className="flex h-16 overflow-hidden rounded-lg border border-gray-200">
          {watchedColors.map((color: string, index: number) => (
            <div
              key={index}
              className="flex-1"
              style={{
                backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(color)
                  ? color
                  : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>

      {/* Palette Colors */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Palette Colors
          </label>

          <button
            type="button"
            onClick={addColor}
            className="text-xs font-medium text-[#8B5E3C] hover:underline"
          >
            + Add Color
          </button>
        </div>

        <div className="space-y-3">
          {watchedColors.map((color: string, index: number) => (
            <div key={index}>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) =>
                    updateColor(index, event.target.value)
                  }
                  className="h-10 w-12 cursor-pointer rounded border border-gray-200 p-1"
                />

                <input
                  type="text"
                  {...register(`colors.${index}`)}
                  placeholder="#234C96"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-[#8B5E3C]"
                />

                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  disabled={watchedColors.length <= 2}
                  className="rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {errors.colors?.message && (
          <p className="mt-1 text-xs text-red-500">
            {errors.colors.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#70482F] disabled:opacity-50"
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
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ColorThemeForm;
