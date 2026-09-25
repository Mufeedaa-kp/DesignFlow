
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getErrorMessage } from "../../../../shared/utils/errors";

import {
  useQuotationByProject,
  useAcceptQuotation,
  useRejectQuotationByClient,
  useDownloadQuotation,
} from "../../hooks/useQuotations";

import {
  quotationRejectionSchema,
  type QuotationRejectionFormValues,
} from "../../schema/quotation.schema";

import QuotationSummery from "../../components/QuotationSummery";
import SignaturePad from "../../components/SignaturePad";

const statusLabels: Record<string, string> = {
  sent: "Awaiting Your Response",
  client_accepted: "Accepted",
  client_rejected: "Rejected",
  expired: "Expired",
};

export default function ClientQuotationPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const [showRejectForm, setShowRejectForm] =
    useState(false);

  const [clientSignature, setClientSignature] =
    useState("");

  const {
    data: quotation,
    isLoading,
    isError,
  } = useQuotationByProject(projectId || "");

  const acceptMutation = useAcceptQuotation();

  const rejectMutation =
    useRejectQuotationByClient();

  const downloadMutation =
    useDownloadQuotation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } =
    useForm<QuotationRejectionFormValues>({
      resolver: zodResolver(
        quotationRejectionSchema
      ),
      defaultValues: {
        rejectionReason: "",
      },
    });

  const handleAccept = async () => {
    if (!quotation) return;

    if (!clientSignature) {
      toast.error(
        "Please provide your signature before accepting the quotation"
      );

      return;
    }

    try {
      await acceptMutation.mutateAsync({
        quotationId: quotation._id,
        data: {
          signature: clientSignature,
        },
      });

      toast.success(
        "Quotation accepted successfully"
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

      toast.success(
        "Quotation rejected successfully"
      );

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
      <div className="p-4 sm:p-6">
        <p className="text-sm text-muted">
          Loading quotation...
        </p>
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Link
          to="/client/dashboard"
          className="text-sm text-muted transition-colors hover:text-charcoal"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-5 rounded-lg border border-border bg-cream p-5 sm:mt-6 sm:p-8">
          <p className="text-sm text-muted">
            No quotation is available for this
            project yet.
          </p>
        </div>
      </div>
    );
  }

  const canRespond =
    quotation.status === "sent";

  const canDownload =
    quotation.status === "client_accepted";

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      {/* Back */}
      <Link
        to="/client/dashboard"
        className="inline-block text-xs font-medium text-muted transition-colors hover:text-charcoal sm:text-sm"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
            Quotation
          </p>

          <p className="mt-1 text-xs text-muted sm:text-sm">
            Review your quotation details below.
          </p>
        </div>

        <span className="w-fit rounded-full bg-panel px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
          {statusLabels[quotation.status] ??
            quotation.status}
        </span>
      </div>

      {/* Designer */}
      <div className="mt-5 rounded-lg border border-border bg-cream p-4 sm:mt-6 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
          Designer
        </p>

        {typeof quotation.designer ===
        "string" ? (
          <p className="mt-2 text-sm text-charcoal">
            Designer
          </p>
        ) : (
          <div className="mt-2 min-w-0">
            <p className="truncate text-sm font-medium text-charcoal">
              {quotation.designer.fullName}
            </p>

            <p className="mt-1 break-all text-xs text-muted">
              {quotation.designer.email}
            </p>
          </div>
        )}
      </div>

      {/* Quotation Items */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-cream sm:mt-5">
        <div className="border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
            Quotation Items
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="px-5 py-3 text-left font-medium">
                  Description
                </th>

                <th className="px-4 py-3 text-center font-medium">
                  Qty
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Unit Price
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {quotation.items.map(
                (item, index) => (
                  <tr
                    key={`${item.description}-${index}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4 text-sm text-charcoal">
                      {item.description}
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-muted">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-muted">
                      ₹
                      {item.unitPrice.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-medium text-charcoal">
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

        {/* Mobile Items */}
        <div className="sm:hidden">
          {quotation.items.map(
            (item, index) => (
              <div
                key={`${item.description}-${index}`}
                className="border-b border-border p-4 last:border-0"
              >
                <p className="text-sm font-medium text-charcoal">
                  {item.description}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Qty
                    </p>

                    <p className="mt-1 text-xs font-medium text-charcoal">
                      {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Unit Price
                    </p>

                    <p className="mt-1 text-xs font-medium text-charcoal">
                      ₹
                      {item.unitPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      Total
                    </p>

                    <p className="mt-1 text-xs font-semibold text-charcoal">
                      ₹
                      {item.total.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-end sm:mt-5">
        <div className="w-full sm:w-80">
          <QuotationSummery
            subtotal={quotation.subtotal}
            discount={quotation.discount}
            tax={quotation.tax}
            total={quotation.total}
          />
        </div>
      </div>

      {/* Notes */}
      {quotation.notes && (
        <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
            Notes
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">
            {quotation.notes}
          </p>
        </div>
      )}

      {/* Admin Signature */}
      {quotation.adminSignature && (
        <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
            Authorized Signature
          </p>

          <div className="mt-3 overflow-hidden rounded-md border border-border bg-white">
            <img
              src={quotation.adminSignature}
              alt="Admin signature"
              className="h-28 w-full object-contain sm:h-32"
            />
          </div>

          {quotation.adminSignedAt && (
            <p className="mt-2 text-[10px] text-muted sm:text-xs">
              Signed on{" "}
              {new Date(
                quotation.adminSignedAt
              ).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      )}

      {/* Client Signature */}
      {canRespond && (
        <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
            Your Signature
          </p>

          <p className="mt-2 text-sm leading-5 text-charcoal">
            Please sign below before accepting
            the quotation.
          </p>

          <div className="mt-3">
            <SignaturePad
              onChange={setClientSignature}
            />
          </div>
        </div>
      )}

      {/* Saved Client Signature */}
      {!canRespond &&
        quotation.clientSignature && (
          <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
              Client Signature
            </p>

            <div className="mt-3 overflow-hidden rounded-md border border-border bg-white">
              <img
                src={quotation.clientSignature}
                alt="Client signature"
                className="h-28 w-full object-contain sm:h-32"
              />
            </div>

            {quotation.clientSignedAt && (
              <p className="mt-2 text-[10px] text-muted sm:text-xs">
                Signed on{" "}
                {new Date(
                  quotation.clientSignedAt
                ).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        )}

      {/* Accept / Reject */}
      {canRespond && (
        <div className="mt-4 rounded-lg border border-border bg-cream p-4 sm:mt-5 sm:p-5">
          {!showRejectForm ? (
            <>
              <p className="text-sm font-medium text-charcoal">
                Would you like to proceed with
                this quotation?
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={
                    acceptMutation.isPending ||
                    !clientSignature
                  }
                  className="w-full rounded-md bg-clay px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : "Accept Quotation"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowRejectForm(true)
                  }
                  className="w-full rounded-md border border-border px-5 py-2.5 text-sm text-charcoal transition-colors hover:bg-panel sm:w-auto"
                >
                  Reject
                </button>
              </div>
            </>
          ) : (
            <form
              onSubmit={handleSubmit(
                handleReject
              )}
            >
              <p className="text-sm font-medium text-charcoal">
                Why are you rejecting this
                quotation?
              </p>

              <textarea
                {...register("rejectionReason")}
                rows={4}
                placeholder="Please provide a reason..."
                className="mt-3 w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-clay"
              />

              {errors.rejectionReason && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    errors.rejectionReason
                      .message
                  }
                </p>
              )}

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectForm(false);
                    reset();
                  }}
                  className="w-full px-4 py-2 text-sm text-muted transition-colors hover:text-charcoal sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    rejectMutation.isPending
                  }
                  className="w-full rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

      {/* Accepted */}
      {quotation.status ===
        "client_accepted" && (
        <>
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 sm:mt-5 sm:p-5">
            <p className="text-sm font-semibold text-emerald-700">
              Quotation Accepted
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              You have accepted this quotation.
            </p>
          </div>

          {/* Download Quotation */}
          {canDownload && (
            <div className="mt-4 flex justify-end sm:mt-5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={
                  downloadMutation.isPending
                }
                className="rounded-md bg-clay px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadMutation.isPending
                  ? "Downloading..."
                  : "Download Quotation"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Rejected */}
      {quotation.status ===
        "client_rejected" && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4 sm:mt-5 sm:p-5">
          <p className="text-sm font-semibold text-red-700">
            Quotation Rejected
          </p>

          {quotation.clientRejectionReason && (
            <p className="mt-1 text-xs text-red-600">
              Reason:{" "}
              {quotation.clientRejectionReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

