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
}: MaterialSelectorProps) => {
  return (
    <div>
      {materials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#D9C7A3] bg-[#F8F6F2] p-6 text-center">
          <p className="text-xs text-gray-500 sm:text-sm">
            No materials are available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {materials.map((material) => {
            const isSelected = selectedMaterialIds.includes(
              material._id
            );

            const image = material.images?.[0];

            return (
              <button
                key={material._id}
                type="button"
                onClick={() => onSelect(material)}
                className={`overflow-hidden rounded-lg border bg-white text-left transition ${
                  isSelected
                    ? "border-[#8B5E3C] ring-2 ring-[#D9C7A3]"
                    : "border-gray-200 hover:border-[#D9C7A3] hover:shadow-sm"
                }`}
              >
                <div className="relative aspect-4/3 w-full bg-[#F8F6F2]">
                  {image ? (
                    <img
                      src={image}
                      alt={material.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                      No image
                    </div>
                  )}

                  {isSelected && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5E3C] text-[10px] font-bold text-white">
                      ✓
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <p className="truncate text-[9px] font-medium uppercase tracking-wide text-[#8B5E3C]">
                    {material.type}
                  </p>

                  <h3 className="mt-0.5 truncate text-xs font-semibold text-gray-800">
                    {material.name}
                  </h3>

                  <p className="mt-1 text-[10px] font-semibold text-[#8B5E3C]">
                    ₹{material.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Arrow Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous materials"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9C7A3] text-sm text-[#8B5E3C] transition hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>

          <span className="min-w- text-center text-[10px] text-gray-400">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next materials"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9C7A3] text-sm text-[#8B5E3C] transition hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;