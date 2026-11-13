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
    <div className="border border-border bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-charcoal">Choose your design</h2>
      <p className="mb-6 mt-1 text-sm text-muted">
        Select the design you want for your project.
      </p>

      {isLoading && (
        <div className="bg-panel p-6 text-center text-sm text-muted">
          Loading designs...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 p-6 text-center text-sm text-red-500">
          Failed to load designs.
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

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={onBack}
          className="border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-panel"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectRequestDesignPage;