import { Link, useParams } from "react-router-dom";

import { useProjectRequest } from "../../hooks/useClientProjectRequests";
import HeroBanner from "../../../../features/public/pages/HeroBanner";

import type {
  IMaterial,
  IColorTheme,
} from "../../../catalog/types/catalog.types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85";

const statusStyles: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const cardClass = "border border-border bg-white p-6";
const cardTitle =
  "text-[11px] font-semibold uppercase tracking-[0.15em] text-muted";
const subLabel =
  "text-[10px] font-semibold uppercase tracking-wider text-amber";

const ClientProjectRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: request, isLoading, isError } = useProjectRequest(id);

  if (isLoading) {
    return (
      <>
        <HeroBanner
          label="Project Request"
          quote={"Your request\ndetails"}
          image={HERO_IMAGE}
        />
        <section className="section">
          <div className="container-page">
            <p className="text-sm text-muted">Loading request...</p>
          </div>
        </section>
      </>
    );
  }

  if (isError || !request) {
    return (
      <>
        <HeroBanner
          label="Project Request"
          quote={"Request\nnot found"}
          image={HERO_IMAGE}
        />
        <section className="section">
          <div className="container-page">
            <Link
              to="/client/requests"
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)] hover:underline"
            >
              ← Back to My Requests
            </Link>
            <div className="mt-6 border border-red-100 bg-red-50 p-5 text-sm text-red-500">
              Project request not found.
            </div>
          </div>
        </section>
      </>
    );
  }

  const category =
    typeof request.category === "object" ? request.category : undefined;

  const catalogItem =
    typeof request.catalogItem === "object" ? request.catalogItem : undefined;

  const materials = request.materials.filter(
    (material): material is IMaterial => typeof material !== "string",
  );

  const colorThemes = request.colorThemes.filter(
    (colorTheme): colorTheme is IColorTheme => typeof colorTheme !== "string",
  );

  const image = catalogItem?.image ?? category?.image;

  const title =
    request.projectName || catalogItem?.name || category?.name || "Project Request";

  return (
    <>
      <HeroBanner
        label="Project Request"
        quote={title}
        image={HERO_IMAGE}
      />

      <section className="section">
        <div className="container-page space-y-8">
          {/* Back + status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/client/requests"
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)] hover:underline"
            >
              ← Back to My Requests
            </Link>

            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                statusStyles[request.status] ?? "bg-panel text-muted"
              }`}
            >
              {statusLabels[request.status] ?? request.status}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Left */}
            <div className="space-y-8">
              {/* Design */}
              <div className="overflow-hidden border border-border bg-white">
                {image ? (
                  <img
                    src={image}
                    alt={catalogItem?.name ?? category?.name ?? "Project design"}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-[var(--color-brown-dark)]">
                    <span className="font-serif text-lg text-cream">
                      DesignFlow
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <p className={subLabel}>Category</p>
                  <p className="mt-1 font-serif text-xl text-charcoal">
                    {category?.name ?? "Interior Design"}
                  </p>

                  {catalogItem && (
                    <>
                      <p className={`mt-5 ${subLabel}`}>Selected design</p>
                      <p className="mt-1 font-serif text-xl text-charcoal">
                        {catalogItem.name}
                      </p>
                      {catalogItem.description && (
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {catalogItem.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className={cardClass}>
                <p className={cardTitle}>Selected options</p>

                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className={subLabel}>Materials</p>
                    {materials.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {materials.map((material) => (
                          <span
                            key={material._id}
                            className="bg-panel px-3 py-1.5 text-xs text-charcoal"
                          >
                            {material.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted">
                        No materials selected.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className={subLabel}>Color themes</p>
                    {colorThemes.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {colorThemes.map((colorTheme) => (
                          <span
                            key={colorTheme._id}
                            className="bg-panel px-3 py-1.5 text-xs text-charcoal"
                          >
                            {colorTheme.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted">
                        No color themes selected.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className={cardClass}>
                <p className={cardTitle}>Requirements</p>

                {request.description && (
                  <div className="mt-4">
                    <p className={subLabel}>Description</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                      {request.description}
                    </p>
                  </div>
                )}

                {request.measurements && (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Height",
                        value: `${request.measurements.height} ${request.measurements.unit}`,
                      },
                      {
                        label: "Width",
                        value: `${request.measurements.width} ${request.measurements.unit}`,
                      },
                      {
                        label: "Square feet",
                        value: `${request.measurements.squareFeet} sq.ft`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-panel p-3">
                        <p className="text-[10px] uppercase tracking-wide text-muted">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-charcoal">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {request.needBy && (
                  <div className="mt-5">
                    <p className={subLabel}>Need by</p>
                    <p className="mt-1 text-sm text-charcoal">
                      {new Date(request.needBy).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              {/* Reference images */}
              {request.referenceImages.length > 0 && (
                <div className={cardClass}>
                  <p className={cardTitle}>Reference images</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {request.referenceImages.map((imageUrl, index) => (
                      <img
                        key={`${imageUrl}-${index}`}
                        src={imageUrl}
                        alt={`Reference ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-8">
              {/* Estimate */}
              <div className="border border-[var(--color-brown)] bg-panel p-6">
                <p className={cardTitle}>Estimated total</p>
                <p className="mt-2 font-serif text-3xl text-[var(--color-brown)]">
                  ₹{request.estimatedTotal.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Estimated based on your selected design and options.
                </p>
              </div>

              {/* Personal info */}
              <div className={cardClass}>
                <p className={cardTitle}>Your information</p>

                <div className="mt-4 space-y-4">
                  {[
                    { label: "Name", value: request.personalInfo.fullName },
                    { label: "Email", value: request.personalInfo.email },
                    { label: "Phone", value: request.personalInfo.phone },
                    { label: "Address", value: request.personalInfo.address },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] uppercase tracking-wide text-muted">
                        {item.label}
                      </p>
                      <p className="mt-1 break-words text-sm leading-5 text-charcoal">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection */}
              {request.status === "rejected" && request.rejectionReason && (
                <div className="border border-red-100 bg-red-50 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600">
                    Rejection reason
                  </p>
                  <p className="mt-2 text-sm leading-5 text-red-700">
                    {request.rejectionReason}
                  </p>
                </div>
              )}

              {/* Approved */}
              {request.status === "approved" && (
                <div className="border border-emerald-100 bg-emerald-50 p-6">
                  <p className="text-sm font-semibold text-emerald-700">
                    Request approved
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    Your request has been approved and converted into a project.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientProjectRequestDetailsPage;