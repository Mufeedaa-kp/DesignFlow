import { useCategories } from "../../../catalog/hooks/useCategories";

import CategorySelector from "../../components/CategorySelector";

interface ProjectRequestCategoryPageProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onContinue: () => void;
}

const ProjectRequestCategoryPage = ({
  selectedCategoryId,
  onSelectCategory,
  onContinue,
}: ProjectRequestCategoryPageProps) => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Loading categories...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-red-500">
          Failed to load categories.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
          Create a Project Request
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Tell us about your interior design requirements.
        </p>
      </div>

      {/* Progress */}

      <div className="mb-8 flex items-center gap-3 text-sm">
        <span className="font-medium text-[#8B5E3C]">
          1. Category
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          2. Design
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          3. Options
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          4. Requirements
        </span>

        <span className="text-gray-300">→</span>

        <span className="text-gray-400">
          5. Review
        </span>
      </div>

      {/* Content */}

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <CategorySelector
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={onSelectCategory}
        />

        {!selectedCategoryId && (
          <p className="mt-4 text-sm text-red-500">
            Please select a category to continue.
          </p>
        )}

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={!selectedCategoryId}
            onClick={onContinue}
            className="rounded-lg bg-[#8B5E3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#70482F] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectRequestCategoryPage;