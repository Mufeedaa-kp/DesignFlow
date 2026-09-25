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
}: CategorySelectorProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          What would you like to design?
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Choose a category to continue with your project request.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const isSelected =
            selectedCategoryId === category._id;

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => onSelect(category._id)}
              className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
                isSelected
                  ? "border-[#8B5E3C] ring-2 ring-[#D9C7A3]"
                  : "border-gray-200 hover:border-[#D9C7A3] hover:shadow-md"
              }`}
            >
              {/* Image */}
              <div className="h-52 w-full bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
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
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>

                  {isSelected && (
                    <span className="rounded-full bg-[#8B5E3C] px-3 py-1 text-xs font-medium text-white">
                      Selected
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;