import type { ICatalogItem } from "../../catalog/types/catalog.types";

interface CatalogItemSelectorProps {
  catalogItems: ICatalogItem[];
  selectedCatalogItemId: string;
  onSelect: (item: ICatalogItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CatalogItemSelector = ({
  catalogItems,
  selectedCatalogItemId,
  onSelect,
  page,
  totalPages,
  onPageChange,
}: CatalogItemSelectorProps) => (
  <div>
    {catalogItems.length === 0 ? (
      <div className="bg-panel p-8 text-center text-sm text-muted">
        No designs available for this category.
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((item) => {
            const isSelected = selectedCatalogItemId === item._id;

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => onSelect(item)}
                aria-pressed={isSelected}
                className={`group overflow-hidden border bg-white text-left transition ${
                  isSelected
                    ? "border-[var(--color-brown)] ring-1 ring-[var(--color-brown)]"
                    : "border-border hover:border-[var(--color-brown)] hover:shadow-md"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-panel">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center bg-[var(--color-brown)] text-sm font-bold text-cream">
                      ✓
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="truncate font-serif text-lg text-charcoal">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">
                    {item.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-brown)]">
                    From ₹{item.startingPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-xs text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

export default CatalogItemSelector;