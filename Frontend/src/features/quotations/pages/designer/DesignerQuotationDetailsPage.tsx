import { useState } from "react";
import { Link } from "react-router-dom";

import { useDesignerQuotations } from "../../hooks/useQuotations";

import type {
  IQuotation,
  IQuotationClient,
} from "../../types/quotation.types";



const statusStyles: Record<
  IQuotation["status"],
  string
> = {
  draft:
    "bg-gray-100 text-gray-700",
  pending_admin_approval:
    "bg-yellow-100 text-yellow-700",
  admin_rejected:
    "bg-red-100 text-red-700",
  sent:
    "bg-blue-100 text-blue-700",
  client_accepted:
    "bg-green-100 text-green-700",
  client_rejected:
    "bg-red-100 text-red-700",
  expired:
    "bg-gray-100 text-gray-500",
};

const statusLabels: Record<
  IQuotation["status"],
  string
> = {
  draft: "Draft",
  pending_admin_approval:
    "Pending Admin Approval",
  admin_rejected:
    "Admin Rejected",
  sent: "Sent to Client",
  client_accepted:
    "Client Accepted",
  client_rejected:
    "Client Rejected",
  expired: "Expired",
};

const getClientName = (
  client: IQuotation["client"]
) => {
  if (typeof client === "string") {
    return "Client";
  }

  return client.fullName;
};

const getProjectId = (
  quotation: IQuotation
) => {
  if (typeof quotation.project === "string") {
    return quotation.project;
  }

  return quotation.project._id;
};

const getProjectName = (
  quotation: IQuotation
) => {
  if (typeof quotation.project === "string") {
    return "Project";
  }

  const sourceRequest =
    quotation.project.sourceRequest;

  if (
    typeof sourceRequest === "object" &&
    sourceRequest.projectName
  ) {
    return sourceRequest.projectName;
  }

  return "Project";
};

const DesignerQuotationDetailsPage = () => {
  const {
    data: quotations = [],
    isLoading,
    isError,
  } = useDesignerQuotations();

  const [selectedRejectionReason, setSelectedRejectionReason] =
    useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#6B5A4A]">
          Loading quotations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">
          Failed to load quotations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="text-xl font-semibold text-[#3F332A]">
          Quotations
        </h1>

        <p className="mt-1 text-sm text-[#6B5A4A]">
          Manage quotations for your assigned projects.
        </p>
      </div>

      {quotations.length === 0 ? (
        <div className="rounded-lg border border-[#E5DDD5] bg-white p-8 text-center">
          <p className="text-sm text-[#6B5A4A]">
            No quotations found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#E5DDD5] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E5DDD5] bg-[#F8F6F2]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#6B5A4A]">
                    Project
                  </th>

                  <th className="px-4 py-3 font-medium text-[#6B5A4A]">
                    Client
                  </th>

                  <th className="px-4 py-3 font-medium text-[#6B5A4A]">
                    Total
                  </th>

                  <th className="px-4 py-3 font-medium text-[#6B5A4A]">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-medium text-[#6B5A4A]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {quotations.map(
                  (quotation) => {
                    const client =
                      typeof quotation.client ===
                      "string"
                        ? null
                        : (quotation.client as IQuotationClient);

                    return (
                      <tr
                        key={quotation._id}
                        className="border-b border-[#E5DDD5] last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#3F332A]">
                            {getProjectName(
                              quotation
                            )}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="text-[#3F332A]">
                            {getClientName(
                              quotation.client
                            )}
                          </p>

                          {client?.email && (
                            <p className="mt-0.5 text-xs text-muted">
                              {client.email}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3 font-medium text-[#3F332A]">
                          ₹
                          {quotation.total.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                statusStyles[quotation.status]
                              }`}
                            >
                              {statusLabels[quotation.status]}
                            </span>

                            {quotation.status === "admin_rejected" &&
                              quotation.adminRejectionReason && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedRejectionReason(
                                      quotation.adminRejectionReason ?? null
                                    )
                                  }
                                  className="text-xs font-medium text-[#8B5E3C] underline underline-offset-2 hover:text-[#6F472F]"
                                >
                                  See Reason
                                </button>
                              )}

                            {quotation.status === "client_rejected" &&
                              quotation.clientRejectionReason && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedRejectionReason(
                                      quotation.clientRejectionReason ?? null
                                    )
                                  }
                                  className="text-xs font-medium text-[#8B5E3C] underline underline-offset-2 hover:text-[#6F472F]"
                                >
                                  See Reason
                                </button>
                              )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/designer/projects/${getProjectId(
                              quotation
                            )}/quotation`}
                            className="inline-flex rounded-md border border-[#8B5E3C] px-3 py-1.5 text-xs font-medium text-[#8B5E3C] transition hover:bg-[#8B5E3C] hover:text-white"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRejectionReason && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedRejectionReason(null)
          }
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3F332A]">
                Admin Rejection Reason
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedRejectionReason(null)
                }
                className="text-lg text-[#6B5A4A] hover:text-[#3F332A]"
              >
                ×
              </button>
            </div>

            <div className="mt-4 rounded-md border border-[#E5DDD5] bg-[#F8F6F2] p-4">
              <p className="text-sm leading-6 text-[#3F332A]">
                {selectedRejectionReason}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setSelectedRejectionReason(null)
                }
                className="rounded-md bg-[#8B5E3C] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#6F472F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerQuotationDetailsPage;