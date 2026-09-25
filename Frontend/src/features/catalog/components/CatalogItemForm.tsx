import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCatalogItemSchema,
  updateCatalogItemSchema,
} from "../schema/catalogItem.schema";

import MultiSelectDropdown from "./MultiSelectDropdown";

import { useCategories } from "../hooks/useCategories";
import { useMaterials } from "../hooks/useMaterials";
import { useColorThemes } from "../hooks/useColorThemes";

import type {
  ICatalogItem,
  IMaterial,
  IColorTheme,
} from "../types/catalog.types";

type CatalogItemFormValues = {
  category: string;
  name: string;
  description: string;
  startingPrice: number;
  materials: string[];
  colorThemes: string[];
  image?: FileList;
};

interface CatalogItemFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  catalogItem?: ICatalogItem;
  defaultCategory?: string;
  isSubmitting?: boolean;
}

const CatalogItemForm = ({
  onSubmit,
  onCancel,
  catalogItem,
  defaultCategory,
  isSubmitting = false,
}: CatalogItemFormProps) => {
  const isEditMode = Boolean(catalogItem);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CatalogItemFormValues>({
    resolver: zodResolver(
      isEditMode
        ? updateCatalogItemSchema
        : createCatalogItemSchema
    ),
    defaultValues: {
      category:
        catalogItem?.category ??
        defaultCategory ??
        "",
      name: catalogItem?.name ?? "",
      description: catalogItem?.description ?? "",
      startingPrice:
        catalogItem?.startingPrice ?? 0,
      materials: catalogItem?.materials ?? [],
      colorThemes: catalogItem?.colorThemes ?? [],
    },
  });

  const selectedMaterials = useWatch({
    control,
    name: "materials",
  });

  const selectedColorThemes = useWatch({
    control,
    name: "colorThemes",
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories();

  const {
    data: materialsData,
    isLoading: materialsLoading,
  } = useMaterials(1, 100);

  const {
    data: colorThemesData,
    isLoading: colorThemesLoading,
  } = useColorThemes(1, 100);

  const materials: IMaterial[] =
    materialsData?.items ?? [];

  const colorThemes: IColorTheme[] =
    colorThemesData?.items ?? [];

  useEffect(() => {
    if (catalogItem) {
      reset({
        category: catalogItem.category,
        name: catalogItem.name,
        description: catalogItem.description,
        startingPrice: catalogItem.startingPrice,
        materials: catalogItem.materials,
        colorThemes: catalogItem.colorThemes,
      });
    } else if (defaultCategory) {
      reset({
        category: defaultCategory,
        name: "",
        description: "",
        startingPrice: 0,
        materials: [],
        colorThemes: [],
      });
    }
  }, [
    catalogItem,
    defaultCategory,
    reset,
  ]);

  const handleFormSubmit = (
    data: CatalogItemFormValues
  ) => {
    const formData = new FormData();

    formData.append(
      "category",
      data.category
    );

    formData.append(
      "name",
      data.name
    );

    formData.append(
      "description",
      data.description
    );

    formData.append(
      "startingPrice",
      String(data.startingPrice)
    );

    formData.append(
      "materials",
      JSON.stringify(data.materials)
    );

    formData.append(
      "colorThemes",
      JSON.stringify(data.colorThemes)
    );

    if (data.image?.[0]) {
      formData.append(
        "image",
        data.image[0]
      );
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-xl bg-white p-5 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-[#8B5E3C]">
        {isEditMode
          ? "Edit Catalog Item"
          : "Add Catalog Item"}
      </h2>

      {/* Category */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium">
          Category
        </label>

        {categoriesLoading ? (
          <p className="text-sm text-gray-500">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No categories available.
          </p>
        ) : (
          <select
            {...register("category")}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        )}

        {errors.category && (
          <p className="mt-1 text-xs text-red-500">
            {errors.category.message?.toString()}
          </p>
        )}
      </div>

      {/* Item Name */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium">
          Item Name
        </label>

        <input
          {...register("name")}
          type="text"
          placeholder="Example: L-Shaped Kitchen"
          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message?.toString()}
          </p>
        )}
      </div>

      {/* Description */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={3}
          placeholder="Describe this catalog item"
          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
        />

        {errors.description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.description.message?.toString()}
          </p>
        )}
      </div>

      {/* Starting Price */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium">
          Starting Price
        </label>

        <input
          {...register("startingPrice", {
            valueAsNumber: true,
          })}
          type="number"
          min="0"
          placeholder="Example: 50000"
          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
        />

        {errors.startingPrice && (
          <p className="mt-1 text-xs text-red-500">
            {errors.startingPrice.message?.toString()}
          </p>
        )}
      </div>

      {/* Materials */}

      <div className="mb-4">
        <MultiSelectDropdown
          label="Materials"
          options={materials.map(
            (material: IMaterial) => ({
              value: material._id,
              label: material.name,
            })
          )}
          value={selectedMaterials ?? []}
          onChange={(value) =>
            setValue("materials", value)
          }
          placeholder="Select materials"
          disabled={materialsLoading}
        />

        {materialsLoading && (
          <p className="mt-1 text-xs text-gray-500">
            Loading materials...
          </p>
        )}

        {!materialsLoading &&
          materials.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              No materials available.
            </p>
          )}

        {errors.materials && (
          <p className="mt-1 text-xs text-red-500">
            {errors.materials.message?.toString()}
          </p>
        )}
      </div>

      {/* Color Themes */}

      <div className="mb-5">
        <MultiSelectDropdown
          label="Color Themes"
          options={colorThemes.map(
            (theme: IColorTheme) => ({
              value: theme._id,
              label: theme.name,
            })
          )}
          value={selectedColorThemes ?? []}
          onChange={(value) =>
            setValue("colorThemes", value)
          }
          placeholder="Select color themes"
          disabled={colorThemesLoading}
        />

        {colorThemesLoading && (
          <p className="mt-1 text-xs text-gray-500">
            Loading color themes...
          </p>
        )}

        {!colorThemesLoading &&
          colorThemes.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              No color themes available.
            </p>
          )}

        {errors.colorThemes && (
          <p className="mt-1 text-xs text-red-500">
            {errors.colorThemes.message?.toString()}
          </p>
        )}
      </div>

      {/* Current Image */}

      {isEditMode &&
        catalogItem?.image && (
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">
              Current Image
            </label>

            <img
              src={catalogItem.image}
              alt={catalogItem.name}
              className="h-28 w-44 rounded-lg object-cover"
            />
          </div>
        )}

      {/* Image */}

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium">
          {isEditMode
            ? "Replace Image (Optional)"
            : "Item Image"}
        </label>

        <input
          {...register("image")}
          type="file"
          accept="image/*"
          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
        />

        {errors.image && (
          <p className="mt-1 text-xs text-red-500">
            {errors.image.message?.toString()}
          </p>
        )}
      </div>

      {/* Actions */}

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm text-white transition hover:bg-[#70482F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Item"
              : "Create Item"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CatalogItemForm;