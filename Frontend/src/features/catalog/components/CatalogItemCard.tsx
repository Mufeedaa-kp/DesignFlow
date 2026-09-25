import type { ICatalogItem } from "../types/catalog.types";

interface CatalogItemCardProps {
  item: ICatalogItem;
  onEdit: (item: ICatalogItem) => void;
  onDelete: (item: ICatalogItem) => void;
}

const CatalogItemCard = ({
  item,
  onEdit,
  onDelete,
}: CatalogItemCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="h-48 w-full bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {item.description}
        </p>

        <p className="mt-3 text-sm font-medium text-[#8B5E3C]">
          Starting from ₹
          {item.startingPrice.toLocaleString("en-IN")}
        </p>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogItemCard;