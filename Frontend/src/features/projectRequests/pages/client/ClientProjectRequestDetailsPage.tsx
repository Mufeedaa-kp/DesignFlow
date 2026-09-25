import { Link, useParams } from "react-router-dom";

import { useProjectRequest } from "../../hooks/useClientProjectRequests";

import type {
  IMaterial,
  IColorTheme,
} from "../../../catalog/types/catalog.types";

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

const ClientProjectRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: request,
    isLoading,
    isError,
  } = useProjectRequest(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted">
          Loading request...
        </p>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="p-6">
        <Link
          to="/client/requests"
          className="text-xs font-medium text-muted hover:text-charcoal"
        >
          ← Back to My Requests
        </Link>

        <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-5">
          <p className="text-sm text-red-500">
            Project request not found.
          </p>
        </div>
      </div>
    );
  }

  const category =
    typeof request.category === "object"
      ? request.category
      : undefined;

  const catalogItem =
    typeof request.catalogItem === "object"
      ? request.catalogItem
      : undefined;

const materials = request.materials.filter(
  (material): material is IMaterial =>
    typeof material !== "string"
);

const colorThemes = request.colorThemes.filter(
  (colorTheme): colorTheme is IColorTheme =>
    typeof colorTheme !== "string"
);

  const image =
    catalogItem?.image ?? category?.image;

  return (
    <div className="space-y-6">
      {/* Back */}
      <div>
        <Link
          to="/client/requests"
          className="text-xs font-medium text-muted transition hover:text-charcoal"
        >
          ← Back to My Requests
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
            Project Request
          </p>

          <h1 className="mt-1 font-serif text-2xl font-bold text-charcoal">
            {request.projectName ||
              catalogItem?.name ||
              category?.name ||
              "Project Request"}
          </h1>

          <p className="mt-1 text-sm text-muted">
            View your submitted project request details.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
            statusStyles[request.status] ??
            "bg-panel text-muted"
          }`}
        >
          {statusLabels[request.status] ??
            request.status}
        </span>
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left */}
        <div className="space-y-6">
          {/* Design */}
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            {image ? (
              <img
                src={image}
                alt={
                  catalogItem?.name ??
                  category?.name ??
                  "Project design"
                }
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center bg-panel">
                <span className="font-serif text-lg text-clay">
                  Design Flow
                </span>
              </div>
            )}

            <div className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                Category
              </p>

              <p className="mt-1 text-sm font-medium text-charcoal">
                {category?.name ??
                  "Interior Design"}
              </p>

              {catalogItem && (
                <>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-amber">
                    Selected Design
                  </p>

                  <p className="mt-1 text-sm font-medium text-charcoal">
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

          {/* Materials & Colors */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Selected Options
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                  Materials
                </p>

                {materials.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {materials.map((material) => (
                      <span
                        key={material._id}
                        className="rounded-full bg-panel px-3 py-1.5 text-xs text-charcoal"
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
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                  Color Themes
                </p>

                {colorThemes.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorThemes.map(
                      (colorTheme) => (
                        <span
                          key={colorTheme._id}
                          className="rounded-full bg-panel px-3 py-1.5 text-xs text-charcoal"
                        >
                          {colorTheme.name}
                        </span>
                      )
                    )}
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
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Requirements
            </p>

            {request.description && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                  Description
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                  {request.description}
                </p>
              </div>
            )}

{request.measurements && (
  <div className="mt-5 grid grid-cols-3 gap-3">
    <div className="rounded-lg bg-panel p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted">
        Height
      </p>

      <p className="mt-1 text-sm font-medium text-charcoal">
        {request.measurements.height} {request.measurements.unit}
      </p>
    </div>

    <div className="rounded-lg bg-panel p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted">
        Width
      </p>

      <p className="mt-1 text-sm font-medium text-charcoal">
        {request.measurements.width} {request.measurements.unit}
      </p>
    </div>

    <div className="rounded-lg bg-panel p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted">
        Square Feet
      </p>

      <p className="mt-1 text-sm font-medium text-charcoal">
        {request.measurements.squareFeet} sq.ft
      </p>
    </div>
  </div>
)}

            {request.needBy && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                  Need By
                </p>

                <p className="mt-1 text-sm text-charcoal">
                  {new Date(
                    request.needBy
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>
            )}
          </div>

          {/* Reference Images */}
          {request.referenceImages.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Reference Images
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {request.referenceImages.map(
                  (imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`Reference ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Estimate */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Estimated Total
            </p>

            <p className="mt-2 font-serif text-2xl font-bold text-clay">
              ₹
              {request.estimatedTotal.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-1 text-xs text-muted">
              Estimated based on your selected design
              and options.
            </p>
          </div>

          {/* Personal Information */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Your Information
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  Name
                </p>

                <p className="mt-1 text-sm text-charcoal">
                  {request.personalInfo.fullName}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-charcoal">
                  {request.personalInfo.email}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  Phone
                </p>

                <p className="mt-1 text-sm text-charcoal">
                  {request.personalInfo.phone}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  Address
                </p>

                <p className="mt-1 text-sm leading-5 text-charcoal">
                  {request.personalInfo.address}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection */}
          {request.status === "rejected" &&
            request.rejectionReason && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  Rejection Reason
                </p>

                <p className="mt-2 text-sm leading-5 text-red-700">
                  {request.rejectionReason}
                </p>
              </div>
            )}

          {/* Approved */}
          {request.status === "approved" && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-700">
                Request Approved
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-600">
                Your request has been approved and
                converted into a project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProjectRequestDetailsPage;