import { useNavigate } from "react-router-dom";

import type { ICategory } from "../types/catalog.types";

interface CategoryCardProps {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

const CategoryCard = ({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleOpenCategory = () => {
    navigate(`/admin/catalog/${category._id}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      
      {/* Category Image */}
      <div
        onClick={handleOpenCategory}
        className="cursor-pointer"
      >
        <img
          src={category.image}
          alt={category.name}
          className="h-48 w-full object-cover"
        />
      </div>

      {/* Category Content */}
      <div className="p-5">
        <div
          onClick={handleOpenCategory}
          className="cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {category.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {category.description}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(category)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;