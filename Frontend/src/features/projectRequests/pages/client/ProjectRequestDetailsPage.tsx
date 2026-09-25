import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useAdminProjectRequest,
  useApproveProjectRequest,
  useRejectProjectRequest,
} from "../../hooks/useAdminProjectRequests";

// import type { IProjectRequest } from "../../types/projectRequest.types";

import type {
  
  IMaterial,
  IColorTheme,
} from "../../../catalog/types/catalog.types";

const rejectSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(1, "Please enter a reason for rejection"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

const statusStyles: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  approved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-ember/10 text-ember",
};

const getCategoryName = (
  category?: string | { name?: string }
) => {
  if (!category) return "—";

  if (typeof category === "string") {
    return category;
  }

  return category.name || "—";
};

const getCatalogItemName = (
  item?: string | { name?: string }
) => {
  if (!item) return "—";

  if (typeof item === "string") {
    return item;
  }

  return item.name || "—";
};

const getMaterialName = (
  material: string | IMaterial
) => {
  if (typeof material === "string") {
    return material;
  }

  return material.name;
};

const getColorThemeName = (
  colorTheme: string | IColorTheme
) => {
  if (typeof colorTheme === "string") {
    return colorTheme;
  }

  return colorTheme.name;
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-border last:border-0">
      <p className="text-xs uppercase tracking-wide text-muted font-semibold">
        {label}
      </p>

      <div className="sm:col-span-2 text-sm text-charcoal">
        {value || "—"}
      </div>
    </div>
  );
};

const AdminProjectRequestDetailsPage = () => {
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const {
    data: request,
    isLoading,
    isError,
  } = useAdminProjectRequest(id);

  const approveMutation = useApproveProjectRequest();
  const rejectMutation = useRejectProjectRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
  });

  const handleApprove = async () => {
    if (!request) return;

    setActingOnId(request._id);

    try {
      await approveMutation.mutateAsync(request._id);

      toast.success("Request approved — project created");
    } catch (error: unknown) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.message || "Approve failed"
          : "Approve failed"
      );
    } finally {
      setActingOnId(null);
    }
  };

  const handleReject = async (values: RejectFormValues) => {
    if (!request) return;

    setActingOnId(request._id);

    try {
      await rejectMutation.mutateAsync({
        id: request._id,
        rejectionReason: values.rejectionReason,
      });

      toast.success("Request rejected");

      reset();
    } catch (error: unknown) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.message || "Reject failed"
          : "Reject failed"
      );
    } finally {
      setActingOnId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-muted">
          Loading request...
        </p>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin/requests"
          className="text-sm text-muted hover:text-charcoal transition-colors"
        >
          ← Back to Requests
        </Link>

        <div className="mt-8 border border-border rounded-lg p-8 text-center">
          <p className="font-serif text-xl text-charcoal mb-2">
            Couldn't load request
          </p>

          <p className="text-sm text-muted">
            This project request could not be found.
          </p>
        </div>
      </div>
    );
  }


  const isLegacyRequest =
    !request.measurements &&
    Boolean(request.roomInfo);

  const referenceImages =
    request.referenceImages?.length
      ? request.referenceImages
      : request.images ?? [];

  const projectTitle =
    request.projectName ||
    request.roomInfo?.customRoomType ||
    request.roomInfo?.roomType ||
    "Project Request";

  return (
    <>
      <div className="max-w-3xl mx-auto pb-10">
        {/* Back */}
        <Link
          to="/admin/requests"
          className="inline-block text-sm text-muted hover:text-charcoal transition-colors mb-6"
        >
          ← Back to Requests
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-charcoal">
              {projectTitle}
            </h1>

            <p className="text-sm text-muted mt-1">
              Submitted{" "}
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex self-start items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[request.status] ??
              "bg-panel text-muted"
            }`}
          >
            {request.status}
          </span>
        </div>

        {/* Personal Information */}
        <section className="border border-border rounded-lg bg-cream p-5 mb-5">
          <h2 className="font-serif text-xl text-charcoal mb-3">
            Personal Information
          </h2>

          <Row
            label="Full Name"
            value={request.personalInfo?.fullName}
          />

          <Row
            label="Email"
            value={request.personalInfo?.email}
          />

          <Row
            label="Phone"
            value={request.personalInfo?.phone}
          />

          <Row
            label="Address"
            value={request.personalInfo?.address}
          />
        </section>

        {/* New Request - Project Details */}
        {!isLegacyRequest && (
          <section className="border border-border rounded-lg bg-cream p-5 mb-5">
            <h2 className="font-serif text-xl text-charcoal mb-3">
              Project Details
            </h2>

            <Row
              label="Project Name"
              value={request.projectName}
            />

            <Row
              label="Category"
              value={getCategoryName(request.category)}
            />

            <Row
              label="Design"
              value={getCatalogItemName(request.catalogItem)}
            />

            <Row
              label="Estimated Total"
              value={
                request.estimatedTotal
                  ? `₹${request.estimatedTotal.toLocaleString("en-IN")}`
                  : "₹0"
              }
            />
          </section>
        )}

        {/* Legacy Request Details */}
        {isLegacyRequest && request.roomInfo && (
          <section className="border border-border rounded-lg bg-cream p-5 mb-5">
            <h2 className="font-serif text-xl text-charcoal mb-3">
              Previous Project Details
            </h2>

            <Row
              label="Room Type"
              value={
                request.roomInfo.customRoomType ||
                request.roomInfo.roomType
              }
            />

            <Row
              label="Total Area"
              value={
                request.roomInfo.totalArea
                  ? `${request.roomInfo.totalArea} sq.ft`
                  : "—"
              }
            />

            <Row
              label="Width"
              value={
                request.roomInfo.width
                  ? `${request.roomInfo.width}`
                  : "—"
              }
            />

            <Row
              label="Length"
              value={
                request.roomInfo.length
                  ? `${request.roomInfo.length}`
                  : "—"
              }
            />

            <Row
              label="Budget"
              value={request.roomInfo.budgetRange}
            />

            <Row
              label="Preferred Style"
              value={request.roomInfo.preferredStyle}
            />

            <Row
              label="Preferred Timeline"
              value={
                request.roomInfo.customTimelineDate ||
                request.roomInfo.preferredTimeline
              }
            />
          </section>
        )}

        {/* Selected Design */}
        {!isLegacyRequest &&
          request.catalogItem &&
          typeof request.catalogItem !== "string" && (
            <section className="border border-border rounded-lg bg-cream p-5 mb-5">
              <h2 className="font-serif text-xl text-charcoal mb-4">
                Selected Design
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                {request.catalogItem.image && (
                  <img
                    src={request.catalogItem.image}
                    alt={request.catalogItem.name}
                    className="w-full sm:w-36 h-28 object-cover rounded-md"
                  />
                )}

                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {request.catalogItem.name}
                  </p>

                  <p className="text-xs text-muted mt-1">
                    {request.catalogItem.description}
                  </p>

                  <p className="text-sm text-charcoal mt-3">
                    Starting price: ₹
                    {request.catalogItem.startingPrice.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </section>
          )}

        {/* Materials */}
        {!isLegacyRequest &&
          request.materials?.length > 0 && (
            <section className="border border-border rounded-lg bg-cream p-5 mb-5">
              <h2 className="font-serif text-xl text-charcoal mb-4">
                Selected Materials
              </h2>

              <div className="flex flex-wrap gap-2">
                {request.materials.map((material, index) => (
                  <span
                    key={
                      typeof material === "string"
                        ? material
                        : material._id || index
                    }
                    className="px-3 py-1.5 rounded-md bg-panel text-xs text-charcoal"
                  >
                    {getMaterialName(material)}
                  </span>
                ))}
              </div>
            </section>
          )}

        {/* Color Themes */}
        {!isLegacyRequest &&
          request.colorThemes?.length > 0 && (
            <section className="border border-border rounded-lg bg-cream p-5 mb-5">
              <h2 className="font-serif text-xl text-charcoal mb-4">
                Selected Color Themes
              </h2>

              <div className="flex flex-wrap gap-2">
                {request.colorThemes.map(
                  (colorTheme, index) => (
                    <span
                      key={
                        typeof colorTheme === "string"
                          ? colorTheme
                          : colorTheme._id || index
                      }
                      className="px-3 py-1.5 rounded-md bg-panel text-xs text-charcoal"
                    >
                      {getColorThemeName(colorTheme)}
                    </span>
                  )
                )}
              </div>
            </section>
          )}

{/* Measurements */}
{!isLegacyRequest && request.measurements && (
  <section className="border border-border rounded-lg bg-cream p-5 mb-5">
    <h2 className="font-serif text-xl text-charcoal mb-3">
      Measurements
    </h2>

    <Row
      label="Height"
      value={`${request.measurements.height} ${request.measurements.unit}`}
    />

    <Row
      label="Width"
      value={`${request.measurements.width} ${request.measurements.unit}`}
    />

    <Row
      label="Square Feet"
      value={`${request.measurements.squareFeet} sq.ft`}
    />
  </section>
)}

        {/* Requirements */}
        {!isLegacyRequest && (
          <section className="border border-border rounded-lg bg-cream p-5 mb-5">
            <h2 className="font-serif text-xl text-charcoal mb-3">
              Requirements
            </h2>

            <Row
              label="Description"
              value={
                <p className="whitespace-pre-wrap">
                  {request.description || "—"}
                </p>
              }
            />

            <Row
              label="Need By"
              value={
                request.needBy
                  ? new Date(
                      request.needBy
                    ).toLocaleDateString()
                  : "—"
              }
            />
          </section>
        )}

        {/* Legacy Additional Notes */}
        {isLegacyRequest && (
          <section className="border border-border rounded-lg bg-cream p-5 mb-5">
            <h2 className="font-serif text-xl text-charcoal mb-3">
              Additional Notes
            </h2>

            <p className="text-sm text-charcoal whitespace-pre-wrap">
              {request.additionalNotes || "—"}
            </p>
          </section>
        )}

        {/* Reference Images */}
        {referenceImages.length > 0 && (
          <section className="border border-border rounded-lg bg-cream p-5 mb-5">
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Reference Images
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {referenceImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setPreviewImage(image)}
                  className="overflow-hidden rounded-md border border-border"
                >
                  <img
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Rejection Reason */}
        {request.status === "rejected" &&
          request.rejectionReason && (
            <section className="border border-border rounded-lg bg-cream p-5 mb-5">
              <h2 className="font-serif text-xl text-charcoal mb-3">
                Rejection Reason
              </h2>

              <p className="text-sm text-ember">
                {request.rejectionReason}
              </p>
            </section>
          )}

        {/* Actions */}
        {request.status === "pending" && (
          <section className="border border-border rounded-lg bg-cream p-5">
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Admin Actions
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleApprove}
                disabled={actingOnId === request._id}
                className="px-4 py-2 rounded-md bg-clay text-cream text-sm hover:bg-ember transition-colors disabled:opacity-60"
              >
                {actingOnId === request._id &&
                approveMutation.isPending
                  ? "Approving..."
                  : "Approve Request"}
              </button>

              <form
                onSubmit={handleSubmit(handleReject)}
                className="flex flex-col sm:flex-row gap-2 flex-1"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Reason for rejection..."
                    {...register("rejectionReason")}
                    disabled={actingOnId === request._id}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 pr-8 bg-white text-charcoal focus:outline-none focus:border-amber"
                  />

                  {errors.rejectionReason && (
                    <p className="text-xs text-ember mt-1">
                      {errors.rejectionReason.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={actingOnId === request._id}
                  className="px-4 py-2 rounded-md border border-border text-charcoal text-sm hover:bg-panel transition-colors disabled:opacity-60"
                >
                  {actingOnId === request._id &&
                  rejectMutation.isPending
                    ? "Rejecting..."
                    : "Reject Request"}
                </button>
              </form>
            </div>
          </section>
        )}
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProjectRequestDetailsPage;