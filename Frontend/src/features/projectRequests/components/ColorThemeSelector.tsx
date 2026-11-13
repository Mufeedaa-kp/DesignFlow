
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
}: ColorThemeSelectorProps) => (
  <div>
    {colorThemes.length === 0 ? (
      <div className="border border-dashed border-border bg-panel p-6 text-center text-sm text-muted">
        No color themes are available at the moment.
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
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
              aria-pressed={isSelected}
              className={`group border bg-white p-1.5 text-left transition ${
                isSelected
                  ? "border-[var(--color-brown)] ring-1 ring-[var(--color-brown)]"
                  : "border-border hover:border-[var(--color-brown)]"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-panel">
                <div className="grid h-full w-full grid-cols-2">
                  {colorTheme.colors.map((color, index) => (
                    <div
                      key={`${color}-${index}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {isSelected && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-[var(--color-brown)] text-[10px] font-bold text-cream">
                    ✓
                  </span>
                )}
              </div>

              <p className="mt-1.5 truncate text-[11px] font-medium text-charcoal">
                {colorTheme.name}
              </p>
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
          aria-label="Previous color themes"
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
          aria-label="Next color themes"
          className="flex h-8 w-8 items-center justify-center border border-border text-sm text-[var(--color-brown)] transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-30"
        >
          →
        </button>
      </div>
    )}
  </div>
);

export default ColorThemeSelector;
