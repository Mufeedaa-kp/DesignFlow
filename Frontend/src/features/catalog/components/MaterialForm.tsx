import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createMaterialSchema,
  updateMaterialSchema,
  type MaterialFormValues,
} from "../schema/material.schema";

import type { IMaterial } from "../types/catalog.types";

interface MaterialFormProps {
  material?: IMaterial;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MaterialForm = ({
  material,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MaterialFormProps) => {
  const isEditMode = !!material;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(
      isEditMode
        ? updateMaterialSchema
        : createMaterialSchema
    ),
    defaultValues: {
      type: material?.type ?? "",
      name: material?.name ?? "",
      price: material?.price ?? 0,
    },
  });

  const handleFormSubmit = (
    data: MaterialFormValues
  ) => {
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("price", String(data.price));

    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5"
    >
      {/* Material Type */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Material Type
        </label>

        <input
          type="text"
          {...register("type")}
          placeholder="e.g. Plywood"
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.type && (
          <p className="mt-1 text-sm text-red-500">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Material Name */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Material Name
        </label>

        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Marine Plywood"
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Price
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
          })}
          placeholder="e.g. 2500"
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-500">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Images
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          {...register("images")}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.images && (
          <p className="mt-1 text-sm text-red-500">
            {errors.images.message as string}
          </p>
        )}
      </div>

      {/* Existing Images */}
      {isEditMode &&
        material?.images &&
        material.images.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">
              Current Images
            </p>

            <div className="grid grid-cols-3 gap-3">
              {material.images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={material.name}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Selecting new images will replace the
              current images.
            </p>
          </div>
        )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#8B5E3C] px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Material"
              : "Add Material"}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;