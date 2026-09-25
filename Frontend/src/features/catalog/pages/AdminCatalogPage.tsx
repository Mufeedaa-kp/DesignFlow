import { useState } from "react";

import CategoryForm from "../components/CategoryForm";
import CategoryCard from "../components/CategoryCard";
import MaterialForm from "../components/MaterialForm";
import MaterialCard from "../components/MaterialCard";
import ColorThemeForm from "../components/ColorThemeForm";
import ColorThemeCard from "../components/ColorThemeCard";

import type {
  ICategory,
  IMaterial,
  IColorTheme,
} from "../types/catalog.types";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategories";

import {
  useMaterials,
  useCreateMaterial,
  useUpdateMaterial,
  useDeleteMaterial,
} from "../hooks/useMaterials";

import {
  useColorThemes,
  useCreateColorTheme,
  useUpdateColorTheme,
  useDeleteColorTheme,
} from "../hooks/useColorThemes";

const MATERIALS_PER_PAGE = 9;
const COLOR_THEMES_PER_PAGE = 9;

const AdminCatalogPage = () => {
  // -----------------------------
  // Form visibility
  // -----------------------------

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);

  const [showMaterialForm, setShowMaterialForm] =
    useState(false);

  const [showColorThemeForm, setShowColorThemeForm] =
    useState(false);

  // -----------------------------
  // Editing states
  // -----------------------------

  const [editingCategory, setEditingCategory] =
    useState<ICategory | undefined>(undefined);

  const [editingMaterial, setEditingMaterial] =
    useState<IMaterial | undefined>(undefined);

  const [editingColorTheme, setEditingColorTheme] =
    useState<IColorTheme | undefined>(undefined);

  // -----------------------------
  // pagination
  // -----------------------------

  const [materialsPage, setMaterialsPage] =
    useState(1);

    const [colorThemesPage, setColorThemesPage] =
  useState(1);

  // -----------------------------
  // Categories
  // -----------------------------

  const {
    data: categories = [],
    isLoading,
  } = useCategories();

  const createCategoryMutation =
    useCreateCategory();

  const updateCategoryMutation =
    useUpdateCategory();

  const deleteCategoryMutation =
    useDeleteCategory();

  // -----------------------------
  // Materials
  // -----------------------------

  const {
    data: materialsData,
    isLoading: materialsLoading,
  } = useMaterials(
    materialsPage,
    MATERIALS_PER_PAGE
  );

  const materials = materialsData?.items ?? [];

  const materialsTotalPages =
    materialsData?.pagination?.totalPages ?? 1;

  const createMaterialMutation =
    useCreateMaterial();

  const updateMaterialMutation =
    useUpdateMaterial();

  const deleteMaterialMutation =
    useDeleteMaterial();

 
  // Color Themes


const {
  data: colorThemesData,
  isLoading: colorThemesLoading,
} = useColorThemes(
  colorThemesPage,
  COLOR_THEMES_PER_PAGE
);

const colorThemes =
  colorThemesData?.items ?? [];

const colorThemesTotalPages =
  colorThemesData?.pagination?.totalPages ?? 1;

  const createColorThemeMutation =
    useCreateColorTheme();

  const updateColorThemeMutation =
    useUpdateColorTheme();

  const deleteColorThemeMutation =
    useDeleteColorTheme();


  // Create category

  const handleCreateCategory = (
    data: FormData
  ) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        setShowCategoryForm(false);
      },
    });
  };


  // Update category


  const handleUpdateCategory = (
    data: FormData
  ) => {
    if (!editingCategory) return;

    updateCategoryMutation.mutate(
      {
        id: editingCategory._id,
        data,
      },
      {
        onSuccess: () => {
          setShowCategoryForm(false);
          setEditingCategory(undefined);
        },
      }
    );
  };

  // Create material

  const handleCreateMaterial = (
    data: FormData
  ) => {
    createMaterialMutation.mutate(data, {
      onSuccess: () => {
        setShowMaterialForm(false);
        setMaterialsPage(1);
      },
    });
  };

  // Update material

  const handleUpdateMaterial = (
    data: FormData
  ) => {
    if (!editingMaterial) return;

    updateMaterialMutation.mutate(
      {
        id: editingMaterial._id,
        data,
      },
      {
        onSuccess: () => {
          setShowMaterialForm(false);
          setEditingMaterial(undefined);
        },
      }
    );
  };

  // Create color theme

  const handleCreateColorTheme = (
    data: FormData
  ) => {
    createColorThemeMutation.mutate(data, {
      onSuccess: () => {
  setShowColorThemeForm(false);
  setColorThemesPage(1);
},
    });
  };

  // Update color theme

  const handleUpdateColorTheme = (
    data: FormData
  ) => {
    if (!editingColorTheme) return;

    updateColorThemeMutation.mutate(
      {
        id: editingColorTheme._id,
        data,
      },
      {
        onSuccess: () => {
          setShowColorThemeForm(false);
          setEditingColorTheme(undefined);
        },
      }
    );
  };

  
  // Category form

  if (showCategoryForm) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-8">
        <div className="mx-auto max-w-3xl">
          <CategoryForm
            category={editingCategory}
            onSubmit={
              editingCategory
                ? handleUpdateCategory
                : handleCreateCategory
            }
            onCancel={() => {
              setShowCategoryForm(false);
              setEditingCategory(undefined);
            }}
          />
        </div>
      </div>
    );
  }

  // Material form
  

  if (showMaterialForm) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-8">
        <div className="mx-auto max-w-3xl">
          <MaterialForm
            material={editingMaterial}
            onSubmit={
              editingMaterial
                ? handleUpdateMaterial
                : handleCreateMaterial
            }
            onCancel={() => {
              setShowMaterialForm(false);
              setEditingMaterial(undefined);
            }}
          />
        </div>
      </div>
    );
  }

  // Color theme form

  if (showColorThemeForm) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-8">
        <div className="mx-auto max-w-3xl">
          <ColorThemeForm
            colorTheme={editingColorTheme}
            onSubmit={
              editingColorTheme
                ? handleUpdateColorTheme
                : handleCreateColorTheme
            }
            onCancel={() => {
              setShowColorThemeForm(false);
              setEditingColorTheme(undefined);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#8B5E3C]">
            Catalog
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your categories, materials, and color themes.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              Loading catalog...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categories.length === 0 && (
          <div className="flex min-h-100 items-center justify-center rounded-2xl border border-dashed border-[#D9C7A3] bg-white">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Nothing created yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Start building your catalog by creating a category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(undefined);
                  setShowCategoryForm(true);
                }}
                className="mt-6 rounded-lg bg-[#8B5E3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
              >
                Create Category
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        {!isLoading && categories.length > 0 && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">
                Categories
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(undefined);
                  setShowCategoryForm(true);
                }}
              className="rounded-lg bg-[#8B5E3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
              >
                Create Category
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onEdit={(category) => {
                    setEditingCategory(category);
                    setShowCategoryForm(true);
                  }}
                  onDelete={(category) => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this category?"
                      )
                    ) {
                      deleteCategoryMutation.mutate(
                        category._id
                      );
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Materials */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Materials
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the materials available for catalog items.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingMaterial(undefined);
                setShowMaterialForm(true);
              }}
              className="rounded-lg bg-[#8B5E3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
            >
              Create Material
            </button>
          </div>

          {materialsLoading ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Loading materials...
              </p>
            </div>
          ) : materials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D9C7A3] bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No materials yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first material to use it in catalog items.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {materials.map((material: IMaterial) => (
                  <MaterialCard
                    key={material._id}
                    material={material}
                    onEdit={(material) => {
                      setEditingMaterial(material);
                      setShowMaterialForm(true);
                    }}
                    onDelete={(material) => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this material?"
                        )
                      ) {
                        deleteMaterialMutation.mutate(
                          material._id
                        );
                      }
                    }}
                  />
                ))}
              </div>

              {/* Materials Pagination */}
              {materialsTotalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={materialsPage === 1}
                    onClick={() =>
                      setMaterialsPage(
                        (page) => page - 1
                      )
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-500">
                    Page {materialsPage} of{" "}
                    {materialsTotalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      materialsPage ===
                      materialsTotalPages
                    }
                    onClick={() =>
                      setMaterialsPage(
                        (page) => page + 1
                      )
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Color Themes */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Color Themes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the color themes available for catalog items.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingColorTheme(undefined);
                setShowColorThemeForm(true);
              }}
              className="rounded-lg bg-[#8B5E3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
            >
              Create Color Theme
            </button>
          </div>

          {colorThemesLoading ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Loading color themes...
              </p>
            </div>
          ) : colorThemes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D9C7A3] bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No color themes yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first color theme to use it in catalog items.
              </p>
            </div>
          ) : (
            <>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {colorThemes.map((colorTheme: IColorTheme) => (
      <ColorThemeCard
        key={colorTheme._id}
        colorTheme={colorTheme}
        onEdit={(colorTheme) => {
          setEditingColorTheme(colorTheme);
          setShowColorThemeForm(true);
        }}
        onDelete={(colorTheme) => {
          if (
            window.confirm(
              "Are you sure you want to delete this color theme?"
            )
          ) {
            deleteColorThemeMutation.mutate(
              colorTheme._id
            );
          }
        }}
      />
    ))}
  </div>

  {colorThemesTotalPages > 1 && (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={colorThemesPage === 1}
        onClick={() =>
          setColorThemesPage(
            (page) => page - 1
          )
        }
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <span className="text-sm text-gray-500">
        Page {colorThemesPage} of{" "}
        {colorThemesTotalPages}
      </span>

      <button
        type="button"
        disabled={
          colorThemesPage ===
          colorThemesTotalPages
        }
        onClick={() =>
          setColorThemesPage(
            (page) => page + 1
          )
        }
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )}
</>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminCatalogPage;