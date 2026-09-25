import { useState } from "react";

import { useCatalogItems } from "../../../catalog/hooks/useCatalogItems";
import CatalogItemSelector from "../../components/CatalogItemSelector";

import type { ICatalogItem } from "../../../catalog/types/catalog.types";

const CATALOG_ITEMS_PER_PAGE = 9;

interface ProjectRequestDesignPageProps {
  categoryId: string;
  selectedCatalogItemId: string;

  onSelectCatalogItem: (item: ICatalogItem) => void;

  onBack: () => void;
  onContinue: () => void;
}

const ProjectRequestDesignPage = ({
  categoryId,
  selectedCatalogItemId,
  onSelectCatalogItem,
  onBack,
  onContinue,
}: ProjectRequestDesignPageProps) => {
  const [page, setPage] = useState(1);

  const {
    data: catalogData,
    isLoading,
    isError,
  } = useCatalogItems(
    categoryId,
    page,
    CATALOG_ITEMS_PER_PAGE
  );

  const catalogItems: ICatalogItem[] =
    catalogData?.items ?? [];

  const totalPages =
    catalogData?.pagination?.totalPages ?? 1;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Choose Your Design
        </h1>

        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
          Select the design you want for your project.
        </p>
      </div>

      {/* Steps */}
      <div className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] sm:text-xs">
        <span className="text-gray-400">
          1. Category
        </span>

        <span className="text-gray-300">→</span>

        <span className="font-medium text-[#8B5E3C]">
          2. Design
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          3. Options
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          4. Requirements
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          5. Review
        </span>
      </div>

      {/* Content */}
      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
        {isLoading && (
          <div className="rounded-lg bg-[#F8F6F2] p-6 text-center">
            <p className="text-xs text-gray-500 sm:text-sm">
              Loading designs...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <p className="text-xs text-red-500 sm:text-sm">
              Failed to load designs.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <CatalogItemSelector
            catalogItems={catalogItems}
            selectedCatalogItemId={selectedCatalogItemId}
            onSelect={onSelectCatalogItem}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
  <button
    type="button"
    onClick={onBack}
    className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
  >
    Back
  </button>

  <button
    type="button"
    onClick={onContinue}
    className="rounded-lg bg-[#8B5E3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#70482F]"
  >
    Continue
  </button>
</div>
      </div>
    </>
  );
};

export default ProjectRequestDesignPage;