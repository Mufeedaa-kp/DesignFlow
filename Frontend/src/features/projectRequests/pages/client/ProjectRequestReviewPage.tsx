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
    <div className="border border-border bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-charcoal">
        Review your project request
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted">
        Review your selections before submitting.
      </p>

      {categoriesLoading && (
        <div className="bg-panel p-5 text-center text-sm text-muted">
          Loading review details...
        </div>
      )}

      {categoriesError && (
        <div className="bg-red-50 p-5 text-center text-sm text-red-500">
          Failed to load category details.
        </div>
      )}

      {!categoriesLoading && !categoriesError && (
        <div className="space-y-8">
          {/* Project Name */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-amber">
              Project name
            </p>
            <h3 className="mt-1 font-serif text-2xl text-charcoal">
              {projectName || "Untitled Project"}
            </h3>
          </section>

          {/* Category & Design */}
          <section className="border-t border-border pt-6">
            <h3 className="mb-4 font-serif text-xl text-charcoal">
              Category & design
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex overflow-hidden border border-border">
                <div className="h-28 w-28 shrink-0 bg-panel">
                  {category?.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                    Category
                  </p>
                  <h4 className="mt-0.5 truncate font-serif text-base text-charcoal">
                    {category?.name || "Not selected"}
                  </h4>
                  {category?.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex overflow-hidden border border-border">
                <div className="h-28 w-28 shrink-0 bg-panel">
                  {catalogItem?.image ? (
                    <img
                      src={catalogItem.image}
                      alt={catalogItem.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                    Design
                  </p>
                  <h4 className="mt-0.5 truncate font-serif text-base text-charcoal">
                    {catalogItem?.name || "Not selected"}
                  </h4>
                  {catalogItem && (
                    <p className="mt-1 text-xs font-semibold text-[var(--color-brown)]">
                      From ₹{catalogItem.startingPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                  {catalogItem?.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                      {catalogItem.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section className="border-t border-border pt-6">
            <h3 className="mb-4 font-serif text-xl text-charcoal">Materials</h3>

            {materials.length === 0 ? (
              <p className="text-sm text-muted">No materials selected.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {materials.map((material) => (
                  <div
                    key={material._id}
                    className="flex min-w-0 items-center gap-3 border border-border p-2"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden bg-panel">
                      {material.images?.[0] && (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-charcoal">
                        {material.name}
                      </p>
                      <p className="truncate text-[10px] text-muted">
                        {material.type}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--color-brown)]">
                        ₹{material.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>


{/* Color Themes */}
<section className="border-t border-border pt-6">
  <h3 className="mb-4 font-serif text-xl text-charcoal">
    Color themes
  </h3>

  {colorThemes.length === 0 ? (
    <p className="text-sm text-muted">
      No color themes selected.
    </p>
  ) : (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
      {colorThemes.map((colorTheme) => (
        <div key={colorTheme._id} className="border border-border">
          <div className="grid aspect-square grid-cols-2 bg-panel">
            {colorTheme.colors.map((color, index) => (
              <div
                key={`${color}-${index}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <p className="truncate p-1.5 text-[11px] font-medium text-charcoal">
            {colorTheme.name}
          </p>
        </div>
      ))}
    </div>
  )}
</section>


          {/* Measurements */}
          <section className="border-t border-border pt-6">
            <h3 className="mb-4 font-serif text-xl text-charcoal">
              Measurements
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Height", value: `${measurements.height} ft` },
                { label: "Width", value: `${measurements.width} ft` },
                { label: "Area", value: `${measurements.squareFeet} sq. ft.` },
              ].map((item) => (
                <div key={item.label} className="bg-panel p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 font-serif text-lg text-charcoal">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="border-t border-border pt-6">
            <h3 className="mb-3 font-serif text-xl text-charcoal">
              Requirements
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
              {description || "No description provided."}
            </p>
          </section>

          {/* Reference Images */}
          {referenceImages.length > 0 && (
            <section className="border-t border-border pt-6">
              <h3 className="mb-4 font-serif text-xl text-charcoal">
                Reference images
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {referenceImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden border border-border"
                  >
                    <img
                      src={image}
                      alt={`Reference ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Need By */}
          <section className="border-t border-border pt-6">
            <h3 className="mb-3 font-serif text-xl text-charcoal">
              Preferred completion date
            </h3>
            <p className="text-sm text-muted">
              {needBy || "No preferred date provided."}
            </p>
          </section>

          {/* Estimated Total */}
          <section className="flex flex-col gap-2 border border-[var(--color-brown)] bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                Estimated total
              </p>
              <p className="mt-1 max-w-xl text-xs leading-5 text-muted">
                Final pricing may change after detailed measurement and design
                consultation.
              </p>
            </div>
            <p className="font-serif text-3xl text-[var(--color-brown)]">
              ₹{estimatedTotal.toLocaleString("en-IN")}
            </p>
          </section>

          {/* Navigation */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-panel"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="border border-[var(--color-brown)] bg-[var(--color-brown)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRequestReviewPage;