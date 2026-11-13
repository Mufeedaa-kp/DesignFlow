import { useCategories } from "../../../catalog/hooks/useCategories";
import CategorySelector from "../../components/CategorySelector";

interface Props {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onContinue: () => void;
}

const ProjectRequestCategoryPage = ({
  selectedCategoryId,
  onSelectCategory,
  onContinue,
}: Props) => {
  const { data: categories = [], isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="border border-border bg-white p-8 text-center text-sm text-muted">
        Loading categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-100 bg-red-50 p-8 text-center text-sm text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="border border-border bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-charcoal">
        What would you like to design?
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted">
        Choose a category to continue with your project request.
      </p>

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

      <div className="mt-8 flex justify-end border-t border-border pt-6">
        <button
          type="button"
          disabled={!selectedCategoryId}
          onClick={onContinue}
          className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectRequestCategoryPage;