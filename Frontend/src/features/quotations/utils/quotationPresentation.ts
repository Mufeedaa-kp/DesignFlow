import type {
  IQuotation,
  QuotationStatus,
} from "../types/quotation.types";

export const quotationStatusLabels: Record<
  QuotationStatus,
  string
> = {
  draft: "Draft",
  pending_admin_approval:
    "Pending Admin Approval",
  admin_rejected: "Admin Rejected",
  sent: "Sent to Client",
  client_accepted: "Client Accepted",
  client_rejected: "Client Rejected",
  expired: "Expired",
};

export const quotationStatusStyles: Record<
  QuotationStatus,
  string
> = {
  draft: "bg-panel text-muted",
  pending_admin_approval:
    "bg-amber/10 text-amber",
  admin_rejected: "bg-ember/10 text-ember",
  sent: "bg-clay/10 text-clay",
  client_accepted: "bg-olive/10 text-olive",
  client_rejected: "bg-ember/10 text-ember",
  expired: "bg-panel text-muted",
};

export const getQuotationProjectId = (
  quotation: IQuotation
) => {
  return typeof quotation.project === "string"
    ? quotation.project
    : quotation.project._id;
};

export const getQuotationRejectionReason = (
  quotation: IQuotation
) => {
  if (quotation.status === "admin_rejected") {
    return quotation.adminRejectionReason;
  }

  if (quotation.status === "client_rejected") {
    return quotation.clientRejectionReason;
  }

  return null;
};

export const canEditQuotation = (
  quotation?: IQuotation
) => {
  return (
    quotation?.status === "draft" ||
    quotation?.status === "admin_rejected" ||
    quotation?.status === "client_rejected"
  );
};
