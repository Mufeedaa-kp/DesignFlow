import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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

import ProjectSummaryCard from "../../../projects/components/ProjectSummaryCard";

import {
  getProjectCategoryName,
  getProjectClientName,
  getProjectImage,
  getProjectName,
  getProjectSource,
} from "../../../projects/utils/projectPresentation";

import { getDesignerQuotationOrigin } from "../../../projects/utils/projectNavigation";

import {
  quotationSchema,
  type QuotationFormValues,
} from "../../schema/quotation.schema";

import {
  canEditQuotation,
  getQuotationProjectId,
  getQuotationRejectionReason,
  quotationStatusLabels,
  quotationStatusStyles,
} from "../../utils/quotationPresentation";

import {
  getApiError,
  getErrorMessage,
} from "../../../../shared/utils/errors";

import QuotationForm from "../../components/QuotationForm";
import QuotationSummery from "../../components/QuotationSummery";
import SignaturePad from "../../components/SignaturePad";

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

const ProjectDetailsLink = ({
  projectId,
  from,
}: {
  projectId: string;
  from: string;
}) => {
  return (
    <Link
      to={`/designer/projects/${projectId}`}
      state={{ from }}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-cream px-3 py-1 text-xs font-semibold text-clay transition-colors hover:border-amber hover:bg-panel hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/30"
    >
      View Project Details
      <span aria-hidden="true">→</span>
    </Link>
  );
};

const DesignerQuotationDetailsPage = () => {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const location = useLocation();

  const quotationListPath =
    getDesignerQuotationOrigin(location.state) ??
    "/designer/quotations";

  const [isEditing, setIsEditing] = useState(false);

  const [designerSignature, setDesignerSignature] =
    useState("");

  const projectQuery = useProjectById(
    projectId ?? ""
  );

  const {
    data: quotation,
    isLoading: isQuotationLoading,
    isError: isQuotationError,
    error: quotationError,
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

  const projectData = projectQuery.data;

  const projectSource = getProjectSource(
    projectData?.sourceRequest
  );

  const projectName = getProjectName(projectSource);

  const projectImage = getProjectImage(projectSource);

  const projectCategory =
    getProjectCategoryName(projectSource);

  const projectClientName = getProjectClientName(
    projectData?.client
  );

  const quotationErrorDetails =
    getApiError(quotationError);

  const quotationMissing =
    isQuotationError &&
    quotationErrorDetails.status === 404;

  const canCreateQuotation =
    projectData?.designerStatus === "accepted";

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
            state: { from: quotationListPath },
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

  const canEdit = canEditQuotation(quotation);

  const canSubmitForApproval = canEditQuotation(quotation);

  const canDownload =
    quotation?.status === "client_accepted";

  const shouldShowForm = quotation
    ? isEditing
    : canCreateQuotation;

  const rejectionReason = quotation
    ? getQuotationRejectionReason(quotation)
    : null;

  if (!projectId) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="rounded-xl border border-ember/25 bg-ember/10 p-6">
          <h2 className="font-serif text-xl font-bold text-ember">
            Project not found
          </h2>

          <p className="mt-2 text-sm text-ember">
            This quotation link is missing a project.
          </p>

          <Link
            to={quotationListPath}
            className="mt-4 inline-flex text-sm font-medium text-clay hover:text-ember"
          >
            Back to quotations
          </Link>
        </div>
      </div>
    );
  }

  if (projectQuery.isLoading) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (
    projectQuery.isError ||
    !projectData
  ) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="rounded-xl border border-ember/25 bg-ember/10 p-6">
          <h2 className="font-serif text-xl font-bold text-ember">
            Unable to load project
          </h2>

          <p className="mt-2 text-sm text-ember">
            {getErrorMessage(projectQuery.error)}
          </p>

          <Link
            to={quotationListPath}
            className="mt-4 inline-flex text-sm font-medium text-clay hover:text-ember"
          >
            Back to quotations
          </Link>
        </div>
      </div>
    );
  }

  if (isQuotationLoading) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Loading quotation...
          </p>
        </div>
      </div>
    );
  }

  if (
    isQuotationError &&
    !quotationMissing &&
    !quotation
  ) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="rounded-xl border border-ember/25 bg-ember/10 p-6">
          <h2 className="font-serif text-xl font-bold text-ember">
            Unable to load quotation
          </h2>

          <p className="mt-2 text-sm text-ember">
            {getErrorMessage(quotationError)}
          </p>

          <Link
            to={quotationListPath}
            className="mt-4 inline-flex text-sm font-medium text-clay hover:text-ember"
          >
            Back to quotations
          </Link>
        </div>
      </div>
    );
  }

  if (!quotation && !canCreateQuotation) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h1 className="font-serif text-2xl font-bold text-charcoal">
            Quotation not available
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Accept this project assignment before
            creating a quotation.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={`/designer/projects/${projectId}`}
              state={{ from: quotationListPath }}
              className="rounded-lg bg-clay px-4 py-2 text-sm font-medium text-cream hover:bg-ember"
            >
              View Project
            </Link>

            <Link
              to={quotationListPath}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-charcoal hover:bg-panel"
            >
              All Quotations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (shouldShowForm) {
    return (
      <div className="min-h-screen bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <button
              type="button"
              onClick={() =>
                quotation
                  ? setIsEditing(false)
                  : navigate(quotationListPath)
              }
              className="mb-3 text-sm font-medium text-muted hover:text-charcoal"
            >
              ← Back
            </button>

            <h1 className="font-serif text-3xl font-bold text-charcoal">
              {quotation
                ? "Edit Quotation"
                : "Create Quotation"}
            </h1>

            <p className="mt-1 text-sm text-muted">
              {quotation
                ? "Update the quotation details below."
                : "Prepare a quotation for this project."}
            </p>
          </div>

          <ProjectSummaryCard
            image={projectImage}
            projectName={projectName}
            clientName={projectClientName}
            aside={
              <div className="flex flex-col items-start gap-2 sm:items-end">
                {quotation ? (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      quotationStatusStyles[
                        quotation.status
                      ]
                    }`}
                  >
                    {
                      quotationStatusLabels[
                        quotation.status
                      ]
                    }
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                    Quotation required
                  </span>
                )}

                <ProjectDetailsLink
                  projectId={projectId}
                  from={quotationListPath}
                />
              </div>
            }
            meta={
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Category
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {projectCategory || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Required by
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {formatDate(projectSource?.needBy)}
                  </p>
                </div>
              </>
            }
          />

          <div className="mt-6">
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
    <div className="min-h-screen bg-cream p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={quotationListPath}
            className="text-sm font-medium text-muted hover:text-charcoal"
          >
            ← Back to Quotations
          </Link>

          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-charcoal hover:bg-panel"
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
                className="rounded-lg bg-clay px-4 py-2 text-sm font-medium text-cream hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60"
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
                className="rounded-lg bg-clay px-4 py-2 text-sm font-medium text-cream hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadMutation.isPending
                  ? "Downloading..."
                  : "Download Quotation"}
              </button>
            )}
          </div>
        </div>

        <div className="mb-5">
          <ProjectSummaryCard
            image={projectImage}
            projectName={projectName}
            clientName={projectClientName}
            aside={
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    quotationStatusStyles[
                      quotation.status
                    ]
                  }`}
                >
                  {
                    quotationStatusLabels[
                      quotation.status
                    ]
                  }
                </span>

                <ProjectDetailsLink
                  projectId={projectId}
                  from={quotationListPath}
                />
              </div>
            }
            meta={
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Category
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {projectCategory || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Required by
                  </p>
                  <p className="mt-1 font-medium text-charcoal">
                    {formatDate(projectSource?.needBy)}
                  </p>
                </div>
              </>
            }
          />
        </div>

        {rejectionReason && (
          <div className="mb-5 rounded-xl border border-ember/25 bg-ember/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ember">
              {quotation.status === "admin_rejected"
                ? "Admin feedback"
                : "Client feedback"}
            </p>

            <p className="mt-1 text-sm leading-6 text-ember">
              {rejectionReason}
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-surface shadow-sm">
          <div className="border-b border-border px-6 py-7 sm:px-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-wide text-clay">
                  DESIGN FLOW INTERIORS
                </h1>

                <p className="mt-1 text-sm text-muted">
                  Interior Design & Modular Solutions
                </p>

                <div className="mt-4 space-y-1 text-xs text-muted">
                  <p>Kerala, India</p>
                  <p>+91 9967453420</p>
                  <p>
                    info@designflowinteriors.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="font-serif text-xl font-bold text-charcoal">
                  QUOTATION
                </h2>

                <div className="mt-3 space-y-1 text-sm text-muted">
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
                    {quotationStatusLabels[
                      quotation.status
                    ]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 border-b border-border px-6 py-7 sm:grid-cols-2 sm:px-10">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                To
              </h3>

              <div className="space-y-1 text-sm text-charcoal">
                <p className="font-semibold text-charcoal">
                  {client?.fullName || projectClientName}
                </p>

                <p>{client?.phone || "—"}</p>

                <p>{client?.email || "—"}</p>

                <p>{client?.address || "—"}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                Project
              </h3>

              <div className="space-y-2 text-sm text-charcoal">
                <p>
                  <span className="font-medium">
                    Project Name:
                  </span>{" "}
                  {projectName}
                </p>

                <p>
                  <span className="font-medium">
                    Required By:
                  </span>{" "}
                  {formatDate(projectSource?.needBy)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-3 py-3 font-semibold text-charcoal">
                      #
                    </th>

                    <th className="px-3 py-3 font-semibold text-charcoal">
                      Description
                    </th>

                    <th className="px-3 py-3 text-center font-semibold text-charcoal">
                      Qty
                    </th>

                    <th className="px-3 py-3 text-right font-semibold text-charcoal">
                      Rate
                    </th>

                    <th className="px-3 py-3 text-right font-semibold text-charcoal">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {quotation.items.map(
                    (item, index) => (
                      <tr
                        key={`${item.description}-${index}`}
                        className="border-b border-border/70"
                      >
                        <td className="px-3 py-4 text-muted">
                          {index + 1}
                        </td>

                        <td className="px-3 py-4 text-charcoal">
                          {item.description}
                        </td>

                        <td className="px-3 py-4 text-center text-charcoal">
                          {item.quantity}
                        </td>

                        <td className="px-3 py-4 text-right text-charcoal">
                          {formatCurrency(
                            item.unitPrice
                          )}
                        </td>

                        <td className="px-3 py-4 text-right font-medium text-charcoal">
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
            <div className="border-t border-border px-6 py-7 sm:px-10">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal">
                {quotation.notes}
              </p>
            </div>
          )}

          <div className="border-t border-border px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-charcoal">
              Payment Terms
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
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

          <div className="border-t border-border px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-charcoal">
              Delivery
            </h3>

            <p className="text-sm leading-6 text-muted">
              Delivery and installation timelines will
              be coordinated based on project
              requirements, material availability,
              production schedules, and site readiness.
            </p>
          </div>

          <div className="border-t border-border px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-charcoal">
              Terms & Conditions
            </h3>

            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
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

          <div className="border-t border-border px-6 py-7 sm:px-10">
            <h3 className="mb-3 text-sm font-semibold text-charcoal">
              Material / Hardware Specifications
            </h3>

            <p className="text-sm leading-6 text-muted">
              Materials, finishes, hardware, colours,
              and specifications will be based on the
              selections agreed upon during the project
              process.
            </p>
          </div>

          {/* Designer Signature */}
          {canSubmitForApproval && (
            <div className="border-t border-border px-6 py-7 sm:px-10">
              <div className="max-w-xl">
                <h3 className="mb-2 text-sm font-semibold text-charcoal">
                  Designer Signature
                </h3>

                <p className="mb-4 text-xs leading-5 text-muted">
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
              <div className="border-t border-border px-6 py-7 sm:px-10">
                <div className="max-w-xl">
                  <h3 className="mb-3 text-sm font-semibold text-charcoal">
                    Designer Signature
                  </h3>

                  <img
                    src={quotation.designerSignature}
                    alt="Designer signature"
                    className="h-28 max-w-sm object-contain object-left"
                  />

                  <div className="mt-2 border-t border-border pt-2">
                    <p className="text-sm text-muted">
                      Designer
                    </p>

                    {quotation.designerSignedAt && (
                      <p className="mt-1 text-xs text-muted">
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

          <div className="border-t border-border px-6 py-8 sm:px-10">
            <div className="max-w-xs">
              <p className="text-sm font-semibold text-charcoal">
                DESIGN FLOW INTERIORS
              </p>

              <div className="mt-12 border-t border-border pt-2">
                <p className="text-sm text-muted">
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

export default DesignerQuotationDetailsPage;