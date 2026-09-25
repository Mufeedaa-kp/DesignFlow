import { useCategories } from "../../../catalog/hooks/useCategories";

import type {
  ICatalogItem,
  IMaterial,
  IColorTheme,
} from "../../../catalog/types/catalog.types";

interface ProjectRequestReviewPageProps {
  projectName: string;

  categoryId: string;
  catalogItem?: ICatalogItem;

  materials: IMaterial[];
  colorThemes: IColorTheme[];

  measurements: {
    height: number;
    width: number;
    squareFeet: number;
  };

  description: string;
  referenceImages: string[];
  needBy: string;

  estimatedTotal: number;
  isSubmitting: boolean;

  onBack: () => void;
  onSubmit: () => void;
}

const ProjectRequestReviewPage = ({
  projectName,
  categoryId,
  catalogItem,
  materials,
  colorThemes,
  measurements,
  description,
  referenceImages,
  needBy,
  estimatedTotal,
  isSubmitting,
  onBack,
  onSubmit,
}: ProjectRequestReviewPageProps) => {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const category = categories.find(
    (item) => item._id === categoryId
  );

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Review your project request
        </h1>

        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
          Review your selections before submitting your project request.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-400">1. Category</span>
        <span className="text-gray-300">→</span>

        <span className="text-gray-400">2. Design</span>
        <span className="text-gray-300">→</span>

        <span className="text-gray-400">3. Options</span>
        <span className="text-gray-300">→</span>

        <span className="text-gray-400">4. Requirements</span>
        <span className="text-gray-300">→</span>

        <span className="font-medium text-[#8B5E3C]">
          5. Review
        </span>
      </div>

      {/* Loading */}
      {categoriesLoading && (
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading review details...
          </p>
        </div>
      )}

      {/* Error */}
      {categoriesError && (
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-red-500">
            Failed to load category details.
          </p>
        </div>
      )}

      {!categoriesLoading && !categoriesError && (
        <div className="space-y-4">
          {/* Project Name */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Project Name
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-800 sm:text-xl">
              {projectName || "Untitled Project"}
            </h2>
          </section>

{/* Category & Design */}
<section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
  <h2 className="text-base font-semibold text-gray-800">
    Category & Design
  </h2>

  <div className="mt-3 grid gap-3 sm:grid-cols-2">
    {/* Category */}
    <div className="flex overflow-hidden rounded-lg border border-gray-200">
      <div className="h-24 w-24 shrink-0 bg-gray-100 sm:h-28 sm:w-28">
        {category?.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Category
        </p>

        <h3 className="mt-0.5 truncate text-sm font-semibold text-gray-800">
          {category?.name || "Not selected"}
        </h3>

        {category?.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-500">
            {category.description}
          </p>
        )}
      </div>
    </div>

    {/* Catalog Item */}
    <div className="flex overflow-hidden rounded-lg border border-gray-200">
      <div className="h-24 w-24 shrink-0 bg-gray-100 sm:h-28 sm:w-28">
        {catalogItem?.image ? (
          <img
            src={catalogItem.image}
            alt={catalogItem.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Design
        </p>

        <h3 className="mt-0.5 truncate text-sm font-semibold text-gray-800">
          {catalogItem?.name || "Not selected"}
        </h3>

        {catalogItem && (
          <p className="mt-1 text-[11px] text-[#8B5E3C]">
            Starting from ₹
            {catalogItem.startingPrice.toLocaleString("en-IN")}
          </p>
        )}

        {catalogItem?.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-500">
            {catalogItem.description}
          </p>
        )}
      </div>
    </div>
  </div>
</section>

          {/* Materials */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-gray-800">
              Materials
            </h2>

            {materials.length === 0 ? (
              <p className="mt-3 text-xs text-gray-500">
                No materials selected.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {materials.map((material) => (
                  <div
                    key={material._id}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 p-2"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {material.images?.[0] ? (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-gray-800">
                        {material.name}
                      </p>

                      <p className="truncate text-[9px] text-gray-500">
                        {material.type}
                      </p>

                      <p className="text-[10px] font-medium text-[#8B5E3C]">
                        ₹{material.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Color Themes */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-gray-800">
              Color Themes
            </h2>

            {colorThemes.length === 0 ? (
              <p className="mt-3 text-xs text-gray-500">
                No color themes selected.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {colorThemes.map((colorTheme) => (
                  <div
                    key={colorTheme._id}
                    className="overflow-hidden rounded-lg border border-gray-200"
                  >
                    <div className="aspect-square bg-gray-100">
                      {colorTheme.image ? (
                        <img
                          src={colorTheme.image}
                          alt={colorTheme.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="p-1.5">
                      <p className="truncate text-[10px] font-medium text-gray-800">
                        {colorTheme.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Measurements */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-gray-800">
              Measurements
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-[#F8F6F2] p-3">
                <p className="text-[10px] text-gray-400">
                  Height
                </p>

                <p className="mt-0.5 text-sm font-semibold text-gray-800">
                  {measurements.height} ft
                </p>
              </div>

              <div className="rounded-lg bg-[#F8F6F2] p-3">
                <p className="text-[10px] text-gray-400">
                  Width
                </p>

                <p className="mt-0.5 text-sm font-semibold text-gray-800">
                  {measurements.width} ft
                </p>
              </div>

              <div className="rounded-lg bg-[#F8F6F2] p-3">
                <p className="text-[10px] text-gray-400">
                  Area
                </p>

                <p className="mt-0.5 text-sm font-semibold text-gray-800">
                  {measurements.squareFeet} sq. ft.
                </p>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-gray-800">
              Requirements
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-gray-600 sm:text-sm">
              {description || "No description provided."}
            </p>
          </section>

          {/* Reference Images */}
          {referenceImages.length > 0 && (
            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-semibold text-gray-800">
                Reference Images
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {referenceImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={image}
                      alt={`Reference ${index + 1}`}
                      className="aspect-4/3 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Need By */}
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-gray-800">
              Preferred Completion Date
            </h2>

            <p className="mt-2 text-xs text-gray-600 sm:text-sm">
              {needBy || "No preferred date provided."}
            </p>
          </section>

          {/* Estimated Total */}
          <section className="rounded-xl border border-[#D9C7A3] bg-[#F8F6F2] p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Estimated Total
                </p>

                <p className="mt-0.5 max-w-xl text-[10px] leading-4 text-gray-400 sm:text-xs">
                  Final pricing may change after detailed measurement and
                  design consultation.
                </p>
              </div>

              <p className="text-xl font-semibold text-[#8B5E3C]">
                ₹{estimatedTotal.toLocaleString("en-IN")}
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#8B5E3C] px-6 py-3 font-medium text-white transition hover:bg-[#70482F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectRequestReviewPage;