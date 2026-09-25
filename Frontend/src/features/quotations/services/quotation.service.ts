import api from "../../../services/api"

import type {
  IQuotation,
  ICreateQuotationInput,
  IUpdateQuotationInput,
  IRejectQuotationInput,
  ISignQuotationInput,
} from "../types/quotation.types";

export const getQuotationByProject =
  async (
    projectId: string
  ): Promise<IQuotation> => {
    const response = await api.get(
      `/quotations/project/${projectId}`
    );

    return response.data.data;
  };

export const getDesignerQuotations =
  async (): Promise<IQuotation[]> => {
    const response = await api.get(
      "/quotations/designer"
    );

    return response.data.data;
  };

export const createQuotation = async (
  data: ICreateQuotationInput
): Promise<IQuotation> => {
  const response = await api.post(
    "/quotations",
    data
  );

  return response.data.data;
};

export const updateQuotation = async (
  quotationId: string,
  data: IUpdateQuotationInput
): Promise<IQuotation> => {
  const response = await api.patch(
    `/quotations/${quotationId}`,
    data
  );

  return response.data.data;
};

export const submitQuotationForApproval =
  async (
    quotationId: string,
    data: ISignQuotationInput
  ): Promise<IQuotation> => {
    const response = await api.patch(
      `/quotations/${quotationId}/submit`,
      data
    );

    return response.data.data;
  };

export const approveQuotation = async (
  quotationId: string,
  data: ISignQuotationInput
): Promise<IQuotation> => {
  const response = await api.patch(
    `/quotations/${quotationId}/approve`,
    data
  );

  return response.data.data;
};

export const rejectQuotation = async (
  quotationId: string,
  data: IRejectQuotationInput
): Promise<IQuotation> => {
  const response = await api.patch(
    `/quotations/${quotationId}/reject`,
    data
  );

  return response.data.data;
};

export const acceptQuotation = async (
  quotationId: string,
  data: ISignQuotationInput
): Promise<IQuotation> => {
  const response = await api.patch(
    `/quotations/${quotationId}/accept`,
    data
  );

  return response.data.data;
};

export const rejectQuotationByClient =
  async (
    quotationId: string,
    data: IRejectQuotationInput
  ): Promise<IQuotation> => {
    const response = await api.patch(
      `/quotations/${quotationId}/client-reject`,
      data
    );

    return response.data.data;
  };

  export const downloadQuotation = async (
  quotationId: string
): Promise<Blob> => {
  const response = await api.get(
    `/quotations/${quotationId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};