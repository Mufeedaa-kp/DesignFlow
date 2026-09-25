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
      {/* Image */}
      <div className="h-32 w-full bg-gray-100">
        {colorTheme.image ? (
          <img
            src={colorTheme.image}
            alt={colorTheme.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800">
          {colorTheme.name}
        </h3>

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