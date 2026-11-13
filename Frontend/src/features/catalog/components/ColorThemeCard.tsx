
import type { IColorTheme } from "../types/catalog.types";

interface ColorThemeCardProps {
  colorTheme: IColorTheme;
  onEdit: (colorTheme: IColorTheme) => void;
  onDelete: (colorTheme: IColorTheme) => void;
}

const ColorThemeCard = ({
  colorTheme,
  onEdit,
  onDelete,
}: ColorThemeCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Color Palette */}
      <div className="flex h-32 w-full">
        {colorTheme.colors?.length > 0 ? (
          colorTheme.colors.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="h-full flex-1"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))
        ) : (
          <div className="flex w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
            No colors available
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800">
          {colorTheme.name}
        </h3>

        {/* HEX Color Codes */}
        <div className="mt-2 flex flex-wrap gap-1">
          {colorTheme.colors?.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="rounded bg-gray-100 px-1.5 py-1 text-[10px] text-gray-600"
            >
              {color}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(colorTheme)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(colorTheme)}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorThemeCard;
