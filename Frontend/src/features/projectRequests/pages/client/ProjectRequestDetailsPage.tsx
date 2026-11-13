import { useState } from "react";
import type { ReactNode } from "react";
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
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

const cardClass = "border border-border bg-white p-6";
const cardTitle =
  "text-[11px] font-semibold uppercase tracking-[0.15em] text-muted";
const chipClass = "bg-panel px-3 py-1.5 text-xs text-charcoal";

const getCategoryName = (category?: string | { name?: string }) => {
  if (!category) return "—";
  if (typeof category === "string") return category;
  return category.name || "—";
};

const getCatalogItemName = (item?: string | { name?: string }) => {
  if (!item) return "—";
  if (typeof item === "string") return item;
  return item.name || "—";
};

const getMaterialName = (material: string | IMaterial) =>
  typeof material === "string" ? material : material.name;

const getColorThemeName = (colorTheme: string | IColorTheme) =>
  typeof colorTheme === "string" ? colorTheme : colorTheme.name;

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid grid-cols-1 gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-3 sm:gap-2">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
      {label}
    </p>
    <div className="break-words text-sm text-charcoal sm:col-span-2">
      {value || "—"}
    </div>
  </div>
);

const AdminProjectRequestDetailsPage = () => {
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const { data: request, isLoading, isError } = useAdminProjectRequest(id);

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
          : "Approve failed",
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
          : "Reject failed",
      );
    } finally {
      setActingOnId(null);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted">Loading request...</p>;
  }

  if (isError || !request) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/requests"
          className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)] hover:underline"
        >
          ← Back to Requests
        </Link>

        <div className="mt-6 border border-border bg-white p-8 text-center">
          <p className="mb-2 font-serif text-xl text-charcoal">
            Couldn't load request
          </p>
          <p className="text-sm text-muted">
            This project request could not be found.
          </p>
        </div>
      </div>
    );
  }

  const isLegacyRequest = !request.measurements && Boolean(request.roomInfo);

  const referenceImages = request.referenceImages?.length
    ? request.referenceImages
    : (request.images ?? []);

  const projectTitle =
    request.projectName ||
    request.roomInfo?.customRoomType ||
    request.roomInfo?.roomType ||
    "Project Request";

  const isActing = actingOnId === request._id;

  return (
    <>
      <div className="space-y-6 pb-10">
        {/* Back + header */}
        <div>
          <Link
            to="/admin/requests"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brown)] hover:underline"
          >
            ← Back to Requests
          </Link>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-charcoal">
                {projectTitle}
              </h1>
              <p className="mt-1 text-sm text-muted">
                Submitted {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`self-start rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                statusStyles[request.status] ?? "bg-panel text-muted"
              }`}
            >
              {request.status}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Project details */}
            {!isLegacyRequest && (
              <section className={cardClass}>
                <p className={cardTitle}>Project details</p>
                <div className="mt-3">
                  <Row label="Project Name" value={request.projectName} />
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
                    value={`₹${(request.estimatedTotal ?? 0).toLocaleString("en-IN")}`}
                  />
                </div>
              </section>
            )}

            {/* Legacy details */}
            {isLegacyRequest && request.roomInfo && (
              <section className={cardClass}>
                <p className={cardTitle}>Previous project details</p>
                <div className="mt-3">
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
                      request.roomInfo.width ? `${request.roomInfo.width}` : "—"
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
                  <Row label="Budget" value={request.roomInfo.budgetRange} />
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
                </div>
              </section>
            )}

            {/* Selected design */}
            {!isLegacyRequest &&
              request.catalogItem &&
              typeof request.catalogItem !== "string" && (
                <section className="overflow-hidden border border-border bg-white">
                  {request.catalogItem.image && (
                    <img
                      src={request.catalogItem.image}
                      alt={request.catalogItem.name}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className={cardTitle}>Selected design</p>
                    <p className="mt-2 font-serif text-xl text-charcoal">
                      {request.catalogItem.name}
                    </p>
                    {request.catalogItem.description && (
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {request.catalogItem.description}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-medium text-[var(--color-brown)]">
                      Starting price: ₹
                      {request.catalogItem.startingPrice.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </section>
              )}

            {/* Materials & colors */}
            {!isLegacyRequest &&
              (request.materials?.length > 0 ||
                request.colorThemes?.length > 0) && (
                <section className={cardClass}>
                  <p className={cardTitle}>Selected options</p>

                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                        Materials
                      </p>
                      {request.materials?.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {request.materials.map((material, index) => (
                            <span
                              key={
                                typeof material === "string"
                                  ? material
                                  : material._id || index
                              }
                              className={chipClass}
                            >
                              {getMaterialName(material)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-muted">None selected.</p>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
                        Color themes
                      </p>
                      {request.colorThemes?.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {request.colorThemes.map((colorTheme, index) => (
                            <span
                              key={
                                typeof colorTheme === "string"
                                  ? colorTheme
                                  : colorTheme._id || index
                              }
                              className={chipClass}
                            >
                              {getColorThemeName(colorTheme)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-muted">None selected.</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

            {/* Measurements */}
            {!isLegacyRequest && request.measurements && (
              <section className={cardClass}>
                <p className={cardTitle}>Measurements</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
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
              </section>
            )}

            {/* Requirements */}
            {!isLegacyRequest && (
              <section className={cardClass}>
                <p className={cardTitle}>Requirements</p>
                <div className="mt-3">
                  <Row
                    label="Description"
                    value={
                      <p className="whitespace-pre-wrap leading-6">
                        {request.description || "—"}
                      </p>
                    }
                  />
                  <Row
                    label="Need By"
                    value={
                      request.needBy
                        ? new Date(request.needBy).toLocaleDateString()
                        : "—"
                    }
                  />
                </div>
              </section>
            )}

            {/* Legacy notes */}
            {isLegacyRequest && (
              <section className={cardClass}>
                <p className={cardTitle}>Additional notes</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                  {request.additionalNotes || "—"}
                </p>
              </section>
            )}

            {/* Reference images */}
            {referenceImages.length > 0 && (
              <section className={cardClass}>
                <p className={cardTitle}>Reference images</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {referenceImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setPreviewImage(image)}
                      className="overflow-hidden border border-border"
                    >
                      <img
                        src={image}
                        alt={`Reference ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Actions first so they stay visible */}
            {request.status === "pending" && (
              <section className="border border-[var(--color-brown)] bg-panel p-6">
                <p className={cardTitle}>Admin actions</p>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isActing}
                  className="mt-4 w-full border border-[var(--color-brown)] bg-[var(--color-brown)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isActing && approveMutation.isPending
                    ? "Approving..."
                    : "Approve Request"}
                </button>

                <form
                  onSubmit={handleSubmit(handleReject)}
                  className="mt-4 space-y-2 border-t border-border pt-4"
                >
                  <input
                    type="text"
                    placeholder="Reason for rejection..."
                    {...register("rejectionReason")}
                    disabled={isActing}
                    className="w-full border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                  />

                  {errors.rejectionReason && (
                    <p className="text-xs text-red-500">
                      {errors.rejectionReason.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isActing}
                    className="w-full border border-border bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-panel disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isActing && rejectMutation.isPending
                      ? "Rejecting..."
                      : "Reject Request"}
                  </button>
                </form>
              </section>
            )}

            {/* Rejection reason */}
            {request.status === "rejected" && request.rejectionReason && (
              <section className="border border-red-100 bg-red-50 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600">
                  Rejection reason
                </p>
                <p className="mt-2 text-sm leading-5 text-red-700">
                  {request.rejectionReason}
                </p>
              </section>
            )}

            {/* Personal info */}
            <section className={cardClass}>
              <p className={cardTitle}>Client information</p>
              <div className="mt-3">
                <Row label="Full Name" value={request.personalInfo?.fullName} />
                <Row label="Email" value={request.personalInfo?.email} />
                <Row label="Phone" value={request.personalInfo?.phone} />
                <Row label="Address" value={request.personalInfo?.address} />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Image preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[85vh] max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close preview"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/60 text-lg text-white"
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