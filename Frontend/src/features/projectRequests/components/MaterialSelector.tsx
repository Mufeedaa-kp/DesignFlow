import type { IMaterial } from "../../catalog/types/catalog.types";

interface MaterialSelectorProps {
  materials: IMaterial[];
  selectedMaterialIds: string[];
  onSelect: (material: IMaterial) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MaterialSelector = ({
  materials,
  selectedMaterialIds,
  onSelect,
  page,
  totalPages,
  onPageChange,
}: MaterialSelectorProps) => (
  <div>
    {materials.length === 0 ? (
      <div className="border border-dashed border-border bg-panel p-6 text-center text-sm text-muted">
        No materials are available at the moment.
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {materials.map((material) => {
          const isSelected = selectedMaterialIds.includes(material._id);
          const image = material.images?.[0];

          return (
            <button
              key={material._id}
              type="button"
              onClick={() => onSelect(material)}
              aria-pressed={isSelected}
              className={`group overflow-hidden border bg-white text-left transition ${
                isSelected
                  ? "border-[var(--color-brown)] ring-1 ring-[var(--color-brown)]"
                  : "border-border hover:border-[var(--color-brown)] hover:shadow-md"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel">
                {image ? (
                  <img
                    src={image}
                    alt={material.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}

                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-[var(--color-brown)] text-xs font-bold text-cream">
                    ✓
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-amber">
                  {material.type}
                </p>
                <h3 className="mt-0.5 truncate font-serif text-base text-charcoal">
                  {material.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[var(--color-brown)]">
                  ₹{material.price.toLocaleString("en-IN")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    )}

    {totalPages > 1 && (
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous materials"
          className="flex h-8 w-8 items-center justify-center border border-border text-sm text-[var(--color-brown)] transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-xs text-muted">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next materials"
          className="flex h-8 w-8 items-center justify-center border border-border text-sm text-[var(--color-brown)] transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-30"
        >
          →
        </button>
      </div>
    )}
  </div>
);

export default MaterialSelector;