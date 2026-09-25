import type { IMaterial } from "../types/catalog.types";

interface MaterialCardProps {
  material: IMaterial;
  onEdit: (material: IMaterial) => void;
  onDelete: (material: IMaterial) => void;
}

const MaterialCard = ({
  material,
  onEdit,
  onDelete,
}: MaterialCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      {material.images?.length > 0 && (
        <img
          src={material.images[0]}
          alt={material.name}
          className="h-48 w-full object-cover"
        />
      )}

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8B5E3C]">
          {material.type}
        </p>

        <h3 className="mt-1 text-lg font-semibold text-gray-800">
          {material.name}
        </h3>

        <p className="mt-2 text-sm font-medium text-gray-700">
          ₹{material.price}
        </p>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(material)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(material)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;