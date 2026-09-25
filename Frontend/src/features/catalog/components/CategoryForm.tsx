import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema";

type CategoryFormData = {
  name: string;
  description: string;
  image?: FileList;
};

interface CategoryFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;

  category?: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
}

const CategoryForm = ({
  onSubmit,
  onCancel,
  category,
}: CategoryFormProps) => {
  const isEditMode = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(
      isEditMode ? updateCategorySchema : createCategorySchema
    ),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, reset]);

  const handleFormSubmit = (data: CategoryFormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#8B5E3C]">
          {isEditMode ? "Edit Category" : "Create Category"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update the category details."
            : "Add a new catalog category."}
        </p>
      </div>

      <div className="space-y-5">
        {/* Category Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category Name
          </label>

          <input
            {...register("name")}
            type="text"
            placeholder="e.g. Modular Kitchen"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#8B5E3C]"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message?.toString()}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe this category..."
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#8B5E3C]"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message?.toString()}
            </p>
          )}
        </div>

        {/* Existing Image */}
        {isEditMode && category?.image && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Image
            </label>

            <img
              src={category.image}
              alt={category.name}
              className="h-32 w-48 rounded-lg object-cover"
            />
          </div>
        )}

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {isEditMode ? "Replace Image (Optional)" : "Category Image"}
          </label>

          <input
            {...register("image")}
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#8B5E3C]"
          />

          {errors.image && (
            <p className="mt-1 text-sm text-red-500">
              {errors.image.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#8B5E3C] px-5 py-3 text-sm font-medium text-white hover:bg-[#70482F]"
        >
          {isEditMode ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;