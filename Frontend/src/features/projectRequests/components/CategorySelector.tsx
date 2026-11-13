import type { ICategory } from "../../catalog/types/catalog.types";

interface CategorySelectorProps {
  categories: ICategory[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string) => void;
}

const CategorySelector = ({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySelectorProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {categories.map((category) => {
      const isSelected = selectedCategoryId === category._id;

      return (
        <button
          key={category._id}
          type="button"
          onClick={() => onSelect(category._id)}
          aria-pressed={isSelected}
          className={`group relative overflow-hidden border bg-white text-left transition ${
            isSelected
              ? "border-[var(--color-brown)] ring-1 ring-[var(--color-brown)]"
              : "border-border hover:border-[var(--color-brown)] hover:shadow-md"
          }`}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[var(--color-brown-dark)] font-serif text-cream">
                DesignFlow
              </div>
            )}

            {isSelected && (
              <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center bg-[var(--color-brown)] text-sm font-bold text-cream">
                ✓
              </span>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-serif text-xl text-charcoal">
              {category.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
              {category.description}
            </p>
            <span className="mt-4 inline-block border-b border-[var(--color-brown)] pb-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)]">
              {isSelected ? "Selected" : "Select"}
            </span>
          </div>
        </button>
      );
    })}
  </div>
);

export default CategorySelector;