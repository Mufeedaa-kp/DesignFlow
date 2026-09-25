import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  useAdminProjectRequest,
  useApproveProjectRequest,
  useRejectProjectRequest,
} from "../../hooks/useAdminProjectRequests";

import type {
  ICatalogItem,
  ICategory,
  IColorTheme,
  IMaterial,
} from "../../../catalog/types/catalog.types";



const rejectionSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Please provide a rejection reason"),
});

type RejectionFormValues = z.infer<
  typeof rejectionSchema
>;


const Row = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
    <span className="text-xs uppercase tracking-wide text-muted">
      {label}
    </span>

    <span className="text-right text-sm text-charcoal">
      {value || "-"}
    </span>
  </div>
);

const statusStyles: Record<string, string> = {
  pending: "bg-amber/15 text-amber",
  approved: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-ember/15 text-ember",
};



const AdminProjectRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [showRejectForm, setShowRejectForm] =
    useState(false);

  const {
    data: request,
    isLoading,
    isError,
  } = useAdminProjectRequest(id);

  const approveMutation =
    useApproveProjectRequest();

  const rejectMutation =
    useRejectProjectRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectionFormValues>({
    resolver: zodResolver(rejectionSchema),
  });



  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted">
          Loading request...
        </p>
      </div>
    );
  }



  if (isError || !request) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-ember">
          Couldn't load this request.
        </p>

        <Link
          to="/admin/requests"
          className="mt-4 inline-block text-sm text-muted transition-colors hover:text-charcoal"
        >
          Back to Requests
        </Link>
      </div>
    );
  }



  const isLegacyRequest =
    !request.measurements &&
    Boolean(request.roomInfo);

  

  const category =
    typeof request.category === "object"
      ? (request.category as ICategory)
      : null;

  const catalogItem =
    typeof request.catalogItem === "object"
      ? (request.catalogItem as ICatalogItem)
      : null;

  const materials = request.materials ?? [];

  const colorThemes = request.colorThemes ?? [];


  
  const referenceImages =
    request.referenceImages?.length > 0
      ? request.referenceImages
      : request.images ?? [];

 

  const handleApprove = () => {
    if (!id) return;

    approveMutation.mutate(id, {
      onSuccess: () => {
        toast.success(
          "Project request approved"
        );
      },

      onError: () => {
        toast.error(
          "Failed to approve project request"
        );
      },
    });
  };



  const handleReject = (
    values: RejectionFormValues
  ) => {
    if (!id) return;

    rejectMutation.mutate(
      {
        id,
        rejectionReason:
          values.rejectionReason,
      },
      {
        onSuccess: () => {
          toast.success(
            "Project request rejected"
          );

          setShowRejectForm(false);
          reset();
        },

        onError: () => {
          toast.error(
            "Failed to reject project request"
          );
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}

      <Link
        to="/admin/requests"
        className="mb-4 inline-block text-sm text-muted transition-colors hover:text-charcoal"
      >
        Back to Requests
      </Link>

      {/* Header */}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-3xl font-bold text-charcoal">
            {request.projectName ||
              request.roomInfo?.customRoomType ||
              request.roomInfo?.roomType ||
              request.personalInfo?.fullName ||
              "Project Request"}
          </p>

          <p className="mt-1 text-sm text-muted">
            {request.personalInfo?.fullName}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            statusStyles[request.status] ??
            "bg-panel text-muted"
          }`}
        >
          {request.status}
        </span>
      </div>



      <div className="mb-6 rounded-lg border border-border bg-cream p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Personal Info
        </p>

        <Row
          label="Full Name"
          value={
            request.personalInfo?.fullName
          }
        />

        <Row
          label="Email"
          value={
            request.personalInfo?.email
          }
        />

        <Row
          label="Phone"
          value={
            request.personalInfo?.phone
          }
        />

        <Row
          label="Address"
          value={
            request.personalInfo?.address
          }
        />

        <Row
          label="Submitted"
          value={new Date(
            request.createdAt
          ).toLocaleDateString()}
        />
      </div>



      {!isLegacyRequest && (
        <div className="mb-6 rounded-lg border border-border bg-cream p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Project Details
          </p>

          <Row
            label="Project Name"
            value={request.projectName}
          />

          <Row
            label="Category"
            value={category?.name}
          />

          <Row
            label="Design"
            value={catalogItem?.name}
          />

          <Row
            label="Starting Price"
            value={
              catalogItem
                ? `₹${catalogItem.startingPrice.toLocaleString(
                    "en-IN"
                  )}`
                : undefined
            }
          />

          <Row
            label="Estimated Total"
            value={`₹${request.estimatedTotal.toLocaleString(
              "en-IN"
            )}`}
          />
        </div>
      )}



      {isLegacyRequest &&
        request.roomInfo && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Previous Project Details
            </p>

            <Row
              label="Room Type"
              value={
                request.roomInfo
                  .customRoomType ||
                request.roomInfo.roomType
              }
            />

            <Row
              label="Total Area"
              value={
                request.roomInfo.totalArea !==
                undefined
                  ? `${request.roomInfo.totalArea} sq.ft`
                  : undefined
              }
            />

            <Row
              label="Width"
              value={
                request.roomInfo.width !==
                undefined
                  ? `${request.roomInfo.width}`
                  : undefined
              }
            />

            <Row
              label="Length"
              value={
                request.roomInfo.length !==
                undefined
                  ? `${request.roomInfo.length}`
                  : undefined
              }
            />

            <Row
              label="Budget"
              value={
                request.roomInfo.budgetRange
              }
            />

            <Row
              label="Preferred Style"
              value={
                request.roomInfo.preferredStyle
              }
            />

            <Row
              label="Preferred Timeline"
              value={
                request.roomInfo
                  .customTimelineDate ||
                request.roomInfo
                  .preferredTimeline
              }
            />
          </div>
        )}



      {!isLegacyRequest &&
        catalogItem && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Selected Design
            </p>

            <div className="flex flex-col gap-5 sm:flex-row">
              {catalogItem.image && (
                <img
                  src={catalogItem.image}
                  alt={catalogItem.name}
                  className="h-40 w-full rounded-md object-cover sm:w-48"
                />
              )}

              <div>
                <p className="text-base font-medium text-charcoal">
                  {catalogItem.name}
                </p>

                {catalogItem.description && (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {
                      catalogItem.description
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        )}


      {!isLegacyRequest &&
        materials.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Selected Materials
            </p>

            <div className="space-y-0">
              {materials.map(
                (material) => {
                  const item =
                    typeof material ===
                    "object"
                      ? (material as IMaterial)
                      : null;

                  return (
                    <Row
                      key={
                        item?._id ??
                        String(material)
                      }
                      label="Material"
                      value={
                        item?.name ??
                        String(material)
                      }
                    />
                  );
                }
              )}
            </div>
          </div>
        )}



      {!isLegacyRequest &&
        colorThemes.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Selected Color Themes
            </p>

            <div className="space-y-0">
              {colorThemes.map(
                (theme) => {
                  const item =
                    typeof theme ===
                    "object"
                      ? (theme as IColorTheme)
                      : null;

                  return (
                    <Row
                      key={
                        item?._id ??
                        String(theme)
                      }
                      label="Color Theme"
                      value={
                        item?.name ??
                        String(theme)
                      }
                    />
                  )
                }
              )}
            </div>
          </div>
        )}



      {!isLegacyRequest &&
        request.measurements && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Measurements
            </p>

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
          </div>
        )}



      {!isLegacyRequest && (
        <div className="mb-6 rounded-lg border border-border bg-cream p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Requirements
          </p>

          <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal">
            {request.description || "-"}
          </p>

          {request.needBy && (
            <div className="mt-5 border-t border-border pt-4">
              <Row
                label="Required By"
                value={new Date(
                  `${request.needBy}T00:00:00`
                ).toLocaleDateString()}
              />
            </div>
          )}
        </div>
      )}

      {isLegacyRequest && (
        <div className="mb-6 rounded-lg border border-border bg-cream p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Additional Notes
          </p>

          <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal">
            {request.additionalNotes ||
              "-"}
          </p>
        </div>
      )}



      {referenceImages.length > 0 && (
        <div className="mb-6 rounded-lg border border-border bg-cream p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Reference Images (
            {referenceImages.length})
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {referenceImages.map(
              (url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`Project reference ${
                    index + 1
                  }`}
                  onClick={() =>
                    setSelectedImage(url)
                  }
                  className="aspect-square cursor-pointer rounded-md object-cover transition-opacity hover:opacity-80"
                />
              )
            )}
          </div>
        </div>
      )}



      {request.status === "rejected" &&
        request.rejectionReason && (
          <div className="mb-6 rounded-lg border border-border bg-cream p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Rejection Reason
            </p>

            <p className="text-sm text-ember">
              {request.rejectionReason}
            </p>
          </div>
        )}



      {request.status === "pending" && (
        <div className="mb-6 rounded-lg border border-border bg-cream p-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Admin Actions
          </p>

          {!showRejectForm ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleApprove}
                disabled={
                  approveMutation.isPending ||
                  rejectMutation.isPending
                }
                className="rounded-lg bg-[#8B5E3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#70482F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approveMutation.isPending
                  ? "Approving..."
                  : "Approve Request"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowRejectForm(true)
                }
                className="rounded-lg border border-ember px-6 py-3 text-sm font-medium text-ember transition hover:bg-ember/5"
              >
                Reject Request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(
                handleReject
              )}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">
                  Rejection Reason
                </label>

                <textarea
                  {...register(
                    "rejectionReason"
                  )}
                  rows={4}
                  placeholder="Enter the reason for rejecting this request..."
                  className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-[#8B5E3C]"
                />

                {errors.rejectionReason && (
                  <p className="mt-1 text-xs text-ember">
                    {
                      errors.rejectionReason
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={
                    rejectMutation.isPending
                  }
                  className="rounded-lg bg-ember px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {rejectMutation.isPending
                    ? "Rejecting..."
                    : "Confirm Rejection"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRejectForm(false);
                    reset();
                  }}
                  className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-charcoal transition hover:bg-panel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}



      {selectedImage && (
        <div
          onClick={() =>
            setSelectedImage(null)
          }
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 p-8"
        >
          <img
            src={selectedImage}
            alt="Project reference preview"
            onClick={(e) =>
              e.stopPropagation()
            }
            className="max-h-full max-w-full rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={() =>
              setSelectedImage(null)
            }
            className="absolute right-6 top-6 text-2xl leading-none text-white hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProjectRequestDetailsPage;