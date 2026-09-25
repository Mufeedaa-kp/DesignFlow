import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useCategories } from "../hooks/useCategories";

import {
  useCatalogItems,
  useCreateCatalogItem,
  useUpdateCatalogItem,
  useDeleteCatalogItem,
} from "../hooks/useCatalogItems";

import { getErrorMessage } from "../../../shared/utils/errors";

import CatalogItemCard from "../components/CatalogItemCard";
import CatalogItemForm from "../components/CatalogItemForm";

import type { ICatalogItem } from "../types/catalog.types";

const LIMIT = 9;

const CategoryCatalogItemsPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [page, setPage] = useState(1);

  const [showItemForm, setShowItemForm] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<ICatalogItem | undefined>(undefined);

  const submittingRef = useRef(false);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories();

  const {
    data: catalogData,
    isLoading: itemsLoading,
  } = useCatalogItems(
    categoryId,
    page,
    LIMIT
  );

  const catalogItems = catalogData?.items ?? [];

  const totalPages =
    catalogData?.pagination?.totalPages ?? 0;

  const createCatalogItemMutation =
    useCreateCatalogItem();

  const updateCatalogItemMutation =
    useUpdateCatalogItem();

  const deleteCatalogItemMutation =
    useDeleteCatalogItem();

  const category = categories.find(
    (item) => item._id === categoryId
  );



  // Create

  const handleCreateItem = (data: FormData) => {
    if (createCatalogItemMutation.isPending) return;
    if (submittingRef.current) return;

    submittingRef.current = true;

    createCatalogItemMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          "Catalog item created successfully"
        );

        setShowItemForm(false);
        setEditingItem(undefined);
        setPage(1);
      },

      onError: (error) => {
        toast.error(getErrorMessage(error));
      },

      onSettled: () => {
        submittingRef.current = false;
      },
    });
  };

  // Update

  const handleUpdateItem = (data: FormData) => {
    if (!editingItem) return;
    if (updateCatalogItemMutation.isPending) return;
    if (submittingRef.current) return;

    submittingRef.current = true;

    updateCatalogItemMutation.mutate(
      {
        id: editingItem._id,
        data,
      },
      {
        onSuccess: () => {
          toast.success(
            "Catalog item updated successfully"
          );

          setShowItemForm(false);
          setEditingItem(undefined);
        },

        onError: (error) => {
          console.error("UPDATE ERROR:", error);
          toast.error(getErrorMessage(error));
        },

        onSettled: () => {
          submittingRef.current = false;
        },
      }
    );
  };

  // Delete

  const handleDeleteItem = (
    item: ICatalogItem
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this catalog item?"
      )
    ) {
      return;
    }

    if (deleteCatalogItemMutation.isPending) return;
    if (submittingRef.current) return;

    submittingRef.current = true;

    deleteCatalogItemMutation.mutate(item._id, {
      onSuccess: () => {
        toast.success(
          "Catalog item deleted successfully"
        );

        if (catalogItems.length === 1 && page > 1) {
          setPage((current) => current - 1);
        }
      },

      onError: (error) => {
        console.error("DELETE ERROR:", error);
        toast.error(getErrorMessage(error));
      },

      onSettled: () => {
        submittingRef.current = false;
      },
    });
  };

  // Edit

  const handleEditItem = (
    item: ICatalogItem
  ) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  // Add

  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowItemForm(true);
  };

  // Cancel

  const handleCancelForm = () => {
    setShowItemForm(false);
    setEditingItem(undefined);
  };

  // Loading

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-6">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  // Category not found

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-6">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/catalog")
          }
          className="mb-5 text-sm font-medium text-[#8B5E3C]"
        >
          ← Back to Categories
        </button>

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Category not found.
          </p>
        </div>
      </div>
    );
  }

  // Catalog Item Form

  if (showItemForm) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-6">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={handleCancelForm}
            className="mb-5 text-sm font-medium text-[#8B5E3C]"
          >
            ← Back to {category.name}
          </button>

          <CatalogItemForm
            catalogItem={editingItem}
            defaultCategory={categoryId}
            isSubmitting={
              editingItem
                ? updateCatalogItemMutation.isPending
                : createCatalogItemMutation.isPending
            }
            onSubmit={
              editingItem
                ? handleUpdateItem
                : handleCreateItem
            }
            onCancel={handleCancelForm}
          />
        </div>
      </div>
    );
  }

  // Catalog Item List

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-6">
      <div className="mx-auto max-w-7xl">

        {/* Back */}

        <button
          type="button"
          onClick={() =>
            navigate("/admin/catalog")
          }
          className="mb-5 text-sm font-medium text-[#8B5E3C]"
        >
          ← Back to Categories
        </button>

        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {category.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {category.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70482F]"
          >
            + Add Item
          </button>
        </div>

        {/* Items */}

        {catalogItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D9C7A3] bg-white p-10 text-center">
            <h2 className="text-base font-semibold text-gray-800">
              No catalog items yet
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add your first item for this category.
            </p>

            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 rounded-lg bg-[#8B5E3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70482F]"
            >
              + Add Item
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalogItems.map(
                (item: ICatalogItem) => (
                  <CatalogItemCard
                    key={item._id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                )
              )}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>

                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryCatalogItemsPage;