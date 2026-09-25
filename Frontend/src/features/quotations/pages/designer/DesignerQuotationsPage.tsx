import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  useQuotationByProject,
  useCreateQuotation,
  useUpdateQuotation,
  useSubmitQuotationForApproval,
  useDownloadQuotation,
} from "../../hooks/useQuotations";

import { useProjectById } from "../../../projects/hooks/useProjects";

import {
  quotationSchema,
  type QuotationFormValues,
} from "../../schema/quotation.schema";

import type { IQuotation } from "../../types/quotation.types";

import { getErrorMessage } from "../../../../shared/utils/errors";

import QuotationForm from "../../components/QuotationForm";
import QuotationSummery from "../../components/QuotationSummery";
import SignaturePad from "../../components/SignaturePad";

const getQuotationProjectId = (
  quotation: IQuotation
): string => {
  return typeof quotation.project === "string"
    ? quotation.project
    : quotation.project._id;
};

const getStatusLabel = (
  status: IQuotation["status"]
) => {
  switch (status) {
    case "draft":
      return "Draft";

    case "pending_admin_approval":
      return "Pending Admin Approval";

    case "admin_rejected":
      return "Admin Rejected";

    case "sent":
      return "Sent to Client";

    case "client_accepted":
      return "Accepted by Client";

    case "client_rejected":
      return "Rejected by Client";

    case "expired":
      return "Expired";

    default:
      return status;
  }
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const DesignerQuotationsPage = () => {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [designerSignature, setDesignerSignature] =
    useState("");

  const {
    data: projectData,
  } = useProjectById(projectId ?? "");

  const {
    data: quotation,
    isLoading,
    isError,
    error,
  } = useQuotationByProject(
    projectId ?? "",
    Boolean(projectId)
  );

  const createQuotationMutation =
    useCreateQuotation();

  const updateQuotationMutation =
    useUpdateQuotation();

  const submitQuotationMutation =
    useSubmitQuotationForApproval();

  const downloadMutation =
    useDownloadQuotation();

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),

    defaultValues: {
      projectId: projectId ?? "",

      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],

      discount: 0,
      tax: 0,
      notes: "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const fieldArray = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!quotation) return;

    reset({
      projectId: getQuotationProjectId(quotation),

      items: quotation.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),

      discount: quotation.discount,
      tax: quotation.tax,
      notes: quotation.notes ?? "",
    });
  }, [quotation, reset]);

  const quotationProjectId = quotation
    ? getQuotationProjectId(quotation)
    : projectId ?? "";

  const handleFormSubmit = async (
    data: QuotationFormValues
  ) => {
    try {
      if (quotation) {
        const updatedQuotation =
          await updateQuotationMutation.mutateAsync({
            quotationId: quotation._id,
            data,
          });

        reset({
          projectId: getQuotationProjectId(
            updatedQuotation
          ),

          items: updatedQuotation.items.map(
            (item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })
          ),

          discount: updatedQuotation.discount,
          tax: updatedQuotation.tax,
          notes: updatedQuotation.notes ?? "",
        });

        toast.success(
          "Quotation updated successfully"
        );

        setIsEditing(false);
      } else {
        const createdQuotation =
          await createQuotationMutation.mutateAsync(
            data
          );

        toast.success(
          "Quotation created successfully"
        );

        navigate(
          `/designer/projects/${getQuotationProjectId(
            createdQuotation
          )}/quotation`,
          {
            replace: true,
          }
        );
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmitForApproval = async () => {
    if (!quotation) return;

    if (!designerSignature) {
      toast.error(
        "Please provide your signature before submitting the quotation"
      );
      return;
    }

    try {
      await submitQuotationMutation.mutateAsync({
        quotationId: quotation._id,
        data: {
          signature: designerSignature,
        },
      });

      toast.success(
        "Quotation submitted for admin approval"
      );
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

  const isSaving =
    createQuotationMutation.isPending ||
    updateQuotationMutation.isPending;

  const canEdit =
    quotation?.status === "draft" ||
    quotation?.status === "admin_rejected" ||
    quotation?.status === "client_rejected";

  const canSubmitForApproval =
    quotation?.status === "draft" ||
    quotation?.status === "admin_rejected" ||
    quotation?.status === "client_rejected";

  const canDownload =
    quotation?.status === "client_accepted";

  const shouldShowForm =
    isEditing ||
    (!isLoading && !quotation);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Loading quotation...
          </p>
        </div>
      </div>
    );
  }

  if (isError && quotation) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load quotation
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  if (shouldShowForm) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <button
              type="button"
              onClick={() =>
                quotation
                  ? setIsEditing(false)
                  : navigate(
                      `/designer/projects/${projectId}`
                    )
              }
              className="mb-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">
              {quotation
                ? "Edit Quotation"
                : "Create Quotation"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {quotation
                ? "Update the quotation details below."
                : "Prepare a quotation for this project."}
            </p>
          </div>

          <QuotationForm
            control={control}
            register={register}
            errors={errors}
            fieldArray={fieldArray}
            handleSubmit={handleSubmit}
            isEditMode={Boolean(quotation)}
            isSubmitting={isSaving}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    );
  }

  const client =
    typeof quotation?.client === "object"
      ? quotation.client
      : undefined;

  if (!quotation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/designer/projects/${quotationProjectId}`
              )
            }
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Project
          </button>

          <div className="flex gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
            )}

            {canSubmitForApproval && (
              <button
                type="button"
                onClick={handleSubmitForApproval}
                disabled={
                  submitQuotationMutation.isPending ||
                  !designerSignature
                }
                className="rounded-lg bg-[#8B5E3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#744b30] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitQuotationMutation.isPending
                  ? "Submitting..."
                  : "Submit for Admin Approval"}
              </button>
            )}

            {canDownload && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
                className="rounded-lg bg-[#8B5E3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#744b30] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadMutation.isPending
                  ? "Downloading..."
                  : "Download Quotation"}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-7 sm:px-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div>
                <h1 className="text-2xl font-bold tracking-wide text-[#8B5E3C]">
                  DESIGN FLOW INTERIORS
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                  Interior Design & Modular Solutions
                </p>

                <div className="mt-4 space-y-1 text-xs text-gray-500">
                  <p>Kerala, India</p>
                  <p>+91 9967453420</p>
                  <p>
                    info@designflowinteriors.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="text-xl font-semibold text-gray-900">
                  QUOTATION
                </h2>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">
                      Quotation Date:
                    </span>{" "}
                    {formatDate(
                      quotation.createdAt
                    )}
                  </p>

                  <p>
                    <span className="font-medium">
                      Status:
                    </span>{" "}
                    {getStatusLabel(
                      quotation.status
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 border-b border-gray-200 px-6 py-7 sm:grid-cols-2 sm:px-10">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                To
              </h3>

              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  {client?.fullName || "—"}
                </p>

                <p>{client?.phone || "—"}</p>

                <p>{client?.email || "—"}</p>

                <p>{client?.address || "—"}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Project
              </h3>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">
                    Project Name:
                  </span>{" "}
                  {typeof projectData?.sourceRequest ===
                  "object"
                    ? projectData.sourceRequest.projectName ||
                      "—"
                    : "—"}
                </p>

                <p>
                  <span className="font-medium">
                    Required By:
                  </span>{" "}
                  {typeof projectData?.sourceRequest ===
                  "object"
                    ? formatDate(
                        projectData.sourceRequest.needBy
                      )
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-300 text-left">
                    <th className="px-3 py-3 font-semibold text-gray-700">
                      #
                    </th>

                    <th className="px-3 py-3 font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="px-3 py-3 text-center font-semibold text-gray-700">
                      Qty
                    </th>

                    <th className="px-3 py-3 text-right font-semibold text-gray-700">
                      Rate
                    </th>

                    <th className="px-3 py-3 text-right font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {quotation.items.map(
                    (item, index) => (
                      <tr
                        key={`${item.description}-${index}`}
                        className="border-b border-gray-100"
                      >
                        <td className="px-3 py-4 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-3 py-4 text-gray-800">
                          {item.description}
                        </td>

                        <td className="px-3 py-4 text-center text-gray-700">
                          {item.quantity}
                        </td>

                        <td className="px-3 py-4 text-right text-gray-700">
                          {formatCurrency(
                            item.unitPrice
                          )}
                        </td>

                        <td className="px-3 py-4 text-right font-medium text-gray-900">
                          {formatCurrency(
                            item.total
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm">
                <QuotationSummery
                  subtotal={quotation.subtotal}
                  discount={quotation.discount}
                  tax={quotation.tax}
                  total={quotation.total}
                />
              </div>
            </div>
          </div>

          {quotation.notes && (
            <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Notes
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {quotation.notes}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Payment Terms
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-600">
              <li>
                50% advance at project confirmation.
              </li>

              <li>
                30% during production / dispatch.
              </li>

              <li>
                15% after installation.
              </li>

              <li>
                5% after project completion.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Delivery
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              Delivery and installation timelines will
              be coordinated based on project
              requirements, material availability,
              production schedules, and site readiness.
            </p>
          </div>

          <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Terms & Conditions
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-600">
              <li>
                Final measurements will be confirmed
                before production.
              </li>

              <li>
                Any changes requested after approval
                may affect the quotation amount and
                timeline.
              </li>

              <li>
                Production will begin after the
                required advance payment and final
                confirmation.
              </li>

              <li>
                Site readiness and access for
                installation are the client's
                responsibility.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Material / Hardware Specifications
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              Materials, finishes, hardware, colours,
              and specifications will be based on the
              selections agreed upon during the project
              process.
            </p>
          </div>

          {/* Designer Signature */}
          {canSubmitForApproval && (
            <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
              <div className="max-w-xl">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Designer Signature
                </h3>

                <p className="mb-4 text-xs leading-5 text-gray-500">
                  Please sign below before submitting
                  this quotation for admin approval.
                </p>

                <SignaturePad
                  onChange={setDesignerSignature}
                />
              </div>
            </div>
          )}

          {/* Saved Designer Signature */}
          {!canSubmitForApproval &&
            quotation.designerSignature && (
              <div className="border-t border-gray-200 px-6 py-7 sm:px-10">
                <div className="max-w-xl">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Designer Signature
                  </h3>

                  <img
                    src={quotation.designerSignature}
                    alt="Designer signature"
                    className="h-28 max-w-sm object-contain object-left"
                  />

                  <div className="mt-2 border-t border-gray-300 pt-2">
                    <p className="text-sm text-gray-600">
                      Designer
                    </p>

                    {quotation.designerSignedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Signed on{" "}
                        {formatDate(
                          quotation.designerSignedAt
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="border-t border-gray-200 px-6 py-8 sm:px-10">
            <div className="max-w-xs">
              <p className="text-sm font-semibold text-gray-900">
                DESIGN FLOW INTERIORS
              </p>

              <div className="mt-12 border-t border-gray-300 pt-2">
                <p className="text-sm text-gray-600">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerQuotationsPage;