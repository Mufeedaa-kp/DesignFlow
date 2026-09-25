import type { IProjectResponse } from "../../projects/types/project.types";

export type QuotationStatus =
  | "draft"
  | "pending_admin_approval"
  | "admin_rejected"
  | "sent"
  | "client_accepted"
  | "client_rejected"
  | "expired";

export interface IQuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuotationClient {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface IQuotationDesigner {
  _id: string;
  fullName: string;
  email: string;
}

export interface IQuotation {
  _id: string;

  project:
    | string
    | IProjectResponse;

  client:
    | string
    | IQuotationClient;

  designer:
    | string
    | IQuotationDesigner;

  items: IQuotationItem[];

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  notes?: string;

  // Signatures
  designerSignature?: string;
  designerSignedAt?: string;

  adminSignature?: string;
  adminSignedAt?: string;

  clientSignature?: string;
  clientSignedAt?: string;

  status: QuotationStatus;

  adminRejectionReason?: string | null;
  clientRejectionReason?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface IQuotationItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ICreateQuotationInput {
  projectId: string;
  items: IQuotationItemInput[];
  discount?: number;
  tax?: number;
  notes?: string;
}

export interface IUpdateQuotationInput {
  projectId: string;
  items: IQuotationItemInput[];
  discount?: number;
  tax?: number;
  notes?: string;
}

export interface IRejectQuotationInput {
  rejectionReason: string;
}

export interface ISignQuotationInput {
  signature: string;
}