
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useQuotationByProject,
  useApproveQuotation,
  useRejectQuotation,
  useDownloadQuotation,
} from "../../hooks/useQuotations";

import { getErrorMessage } from "../../../../shared/utils/errors";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  quotationRejectionSchema,
  type QuotationRejectionFormValues,
} from "../../schema/quotation.schema";

import QuotationSummery from "../../components/QuotationSummery";
import SignaturePad from "../../components/SignaturePad";

const getObjectName = (
  value:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
      }
    | undefined
) => {
  if (!value) return "—";

  if (typeof value === "string") {
    return value;
  }

  return value.fullName || value.email || value._id;
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  pending_admin_approval: "Pending Admin Approval",
  admin_rejected: "Admin Rejected",
  sent: "Sent to Client",
  client_accepted: "Client Accepted",
  client_rejected: "Client Rejected",
  expired: "Expired",
};

export default function AdminQuotationReviewPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const [showRejectForm, setShowRejectForm] =
    useState(false);

  const [adminSignature, setAdminSignature] =
    useState("");

  const {
    data: quotation,
    isLoading,
    isError,
  } = useQuotationByProject(projectId || "");

  const approveMutation = useApproveQuotation();
  const rejectMutation = useRejectQuotation();
  const downloadMutation =
    useDownloadQuotation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuotationRejectionFormValues>({
    resolver: zodResolver(
      quotationRejectionSchema
    ),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const handleApprove = async () => {
    if (!quotation) return;

    if (!adminSignature) {
      toast.error(
        "Please provide your signature before approving the quotation"
      );

      return;
    }

    try {
      await approveMutation.mutateAsync({
        quotationId: quotation._id,
        data: {
          signature: adminSignature,
        },
      });

      toast.success(
        "Quotation approved and sent to client"
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (
    data: QuotationRejectionFormValues
  ) => {
    if (!quotation) return;

    try {
      await rejectMutation.mutateAsync({
        quotationId: quotation._id,
        data,
      });

      toast.success("Quotation rejected");

      setShowRejectForm(false);
      reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDownload = async () => {
    if (!quotation) return;

    try {
      await downloadMutation.mutateAsync(
        quotation._id
      );

      toast.success(
        "Quotation downloaded successfully"
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading quotation...
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Quotation not found.
        </p>

        <Link
          to={
            projectId
              ? `/admin/projects/${projectId}`
              : "/admin/projects"
          }
          className="mt-4 inline-block text-sm text-[#8B5E3C]"
        >
          Back to project
        </Link>
      </div>
    );
  }

  const canReview =
    quotation.status ===
    "pending_admin_approval";

  const canDownload =
    quotation.status === "client_accepted";

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            to={
              projectId
                ? `/admin/projects/${projectId}`
                : "/admin/projects"
            }
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ← Back to Project
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl text-gray-900">
                Quotation Review
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review the designer's quotation before
                sending it to the client.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {statusLabel[quotation.status] ||
                quotation.status}
            </span>
          </div>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Client
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {getObjectName(quotation.client)}
            </p>

            {typeof quotation.client !== "string" &&
              quotation.client.email && (
                <p className="mt-1 text-xs text-gray-500">
                  {quotation.client.email}
                </p>
              )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Designer
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {getObjectName(quotation.designer)}
            </p>

            {typeof quotation.designer !==
              "string" &&
              quotation.designer.email && (
                <p className="mt-1 text-xs text-gray-500">
                  {quotation.designer.email}
                </p>
              )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-medium text-gray-900">
              Quotation Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="px-4 py-3">
                    Description
                  </th>

                  <th className="px-4 py-3 text-center">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right">
                    Unit Price
                  </th>

                  <th className="px-4 py-3 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {quotation.items.map(
                  (item, index) => (
                    <tr
                      key={`${item.description}-${index}`}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-4 py-3 text-gray-900">
                        {item.description}
                      </td>

                      <td className="px-4 py-3 text-center text-gray-600">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-600">
                        ₹
                        {item.unitPrice.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹
                        {item.total.toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <div className="w-full sm:w-80">
            <QuotationSummery
              subtotal={quotation.subtotal}
              discount={quotation.discount}
              tax={quotation.tax}
              total={quotation.total}
            />
          </div>
        </div>

        {quotation.notes && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Designer Notes
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
              {quotation.notes}
            </p>
          </div>
        )}

        {quotation.adminRejectionReason && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-medium text-red-700">
              Previous Rejection Reason
            </p>

            <p className="mt-1 text-sm text-red-600">
              {quotation.adminRejectionReason}
            </p>
          </div>
        )}

        {/* Admin signature */}
        {canReview && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-medium text-gray-900">
              Admin Signature
            </h2>

            <p className="mt-1 mb-4 text-xs text-gray-500">
              Please sign below to approve and send this
              quotation to the client.
            </p>

            <SignaturePad
              onChange={setAdminSignature}
            />
          </div>
        )}

        {/* Saved admin signature */}
        {!canReview && quotation.adminSignature && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-medium text-gray-900">
              Admin Signature
            </h2>

            <div className="mt-3 overflow-hidden rounded-md border border-gray-200 bg-white">
              <img
                src={quotation.adminSignature}
                alt="Admin signature"
                className="h-32 w-full object-contain"
              />
            </div>

            {quotation.adminSignedAt && (
              <p className="mt-2 text-xs text-gray-500">
                Signed on{" "}
                {new Date(
                  quotation.adminSignedAt
                ).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        )}

        {canReview && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            {!showRejectForm ? (
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowRejectForm(true)
                  }
                  className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={
                    approveMutation.isPending ||
                    !adminSignature
                  }
                  className="rounded-md bg-[#8B5E3C] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {approveMutation.isPending
                    ? "Approving..."
                    : "Approve & Send to Client"}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(
                  handleReject
                )}
              >
                <label className="text-sm font-medium text-gray-900">
                  Rejection Reason
                </label>

                <textarea
                  {...register(
                    "rejectionReason"
                  )}
                  rows={4}
                  placeholder="Explain what the designer needs to revise..."
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#8B5E3C]"
                />

                {errors.rejectionReason && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors.rejectionReason
                        .message
                    }
                  </p>
                )}

                <div className="mt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(false);
                      reset();
                    }}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      rejectMutation.isPending
                    }
                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {rejectMutation.isPending
                      ? "Rejecting..."
                      : "Reject Quotation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {quotation.status === "sent" && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            This quotation has already been approved
            and sent to the client.
          </div>
        )}

        {quotation.status ===
          "client_accepted" && (
          <>
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              The client has accepted this quotation.
            </div>

            {/* Download Quotation */}
            {canDownload && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={
                    downloadMutation.isPending
                  }
                  className="rounded-md bg-[#8B5E3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#70492F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloadMutation.isPending
                    ? "Downloading..."
                    : "Download Quotation"}
                </button>
              </div>
            )}
          </>
        )}

        {quotation.status ===
          "client_rejected" && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            The client rejected this quotation.
          </div>
        )}
      </div>
    </div>
  );
}

