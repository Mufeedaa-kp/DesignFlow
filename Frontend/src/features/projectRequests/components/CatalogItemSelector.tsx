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
}: CatalogItemSelectorProps) => {
  return (
    <div>
      {catalogItems.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            No designs available for this category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {catalogItems.map((item) => {
              const isSelected =
                selectedCatalogItemId === item._id;

              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`h- 75 overflow-hidden rounded-xl border text-left transition ${
                    isSelected
                      ? "border-[#8B5E3C] ring-2 ring-[#8B5E3C]/20"
                      : "border-gray-200 hover:border-[#C68E4F]"
                  }`}
                >
                  {/* Design Image */}
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium text-gray-800">
                      {item.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {item.description}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#8B5E3C]">
                      Starting from ₹
                      {item.startingPrice.toLocaleString("en-IN")}
                    </p>

                    {isSelected && (
                      <p className="mt-2 text-xs font-medium text-[#8B5E3C]">
                        Selected
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogItemSelector;