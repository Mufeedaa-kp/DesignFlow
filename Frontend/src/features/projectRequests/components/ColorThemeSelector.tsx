import type { IColorTheme } from "../../catalog/types/catalog.types";

interface ColorThemeSelectorProps {
  colorThemes: IColorTheme[];
  selectedColorThemeIds: string[];
  onSelect: (colorTheme: IColorTheme) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ColorThemeSelector = ({
  colorThemes,
  selectedColorThemeIds,
  onSelect,
  page,
  totalPages,
  onPageChange,
}: ColorThemeSelectorProps) => {
  return (
    <div>
      {colorThemes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#D9C7A3] bg-[#F8F6F2] p-6 text-center">
          <p className="text-xs text-gray-500 sm:text-sm">
            No color themes are available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
          {colorThemes.map((colorTheme) => {
            const isSelected = selectedColorThemeIds.includes(
              colorTheme._id
            );

            return (
              <button
                key={colorTheme._id}
                type="button"
                onClick={() => onSelect(colorTheme)}
                title={colorTheme.name}
                className={`group rounded-lg border bg-white p-1.5 text-left transition ${
                  isSelected
                    ? "border-[#8B5E3C] ring-2 ring-[#D9C7A3]"
                    : "border-gray-200 hover:border-[#D9C7A3]"
                }`}
              >
                {/* Palette Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#F8F6F2]">
                  {colorTheme.image ? (
                    <img
                      src={colorTheme.image}
                      alt={colorTheme.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[8px] text-gray-400">
                      No image
                    </div>
                  )}

                  {isSelected && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B5E3C] text-[8px] font-bold text-white">
                      ✓
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-[9px] font-medium text-gray-700">
                  {colorTheme.name}
                </p>
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
            aria-label="Previous color themes"
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
            aria-label="Next color themes"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9C7A3] text-sm text-[#8B5E3C] transition hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorThemeSelector;