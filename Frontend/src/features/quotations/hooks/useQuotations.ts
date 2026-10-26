
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getQuotationByProject,
  getDesignerQuotations,
  createQuotation,
  updateQuotation,
  submitQuotationForApproval,
  approveQuotation,
  rejectQuotation,
  acceptQuotation,
  rejectQuotationByClient,
  downloadQuotation,
} from "../services/quotation.service";

import { getApiError } from "../../../shared/utils/errors";

import type {
  ICreateQuotationInput,
  IRejectQuotationInput,
  IUpdateQuotationInput,
  ISignQuotationInput,
} from "../types/quotation.types";

export const quotationKeys = {
  all: ["quotations"] as const,

  designer: ["quotations", "designer"] as const,

  byProject: (projectId: string) =>
    ["quotations", "project", projectId] as const,
};

export const useQuotationByProject = (
  projectId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: quotationKeys.byProject(projectId),
    queryFn: () =>
      getQuotationByProject(projectId),
    enabled: Boolean(projectId) && enabled,
    retry: (failureCount, error) => {
      const status = getApiError(error).status;

      if (status === 403 || status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};

export const useDesignerQuotations = () => {
  return useQuery({
    queryKey: quotationKeys.designer,
    queryFn: getDesignerQuotations,
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateQuotationInput) =>
      createQuotation(data),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project === "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );

      queryClient.invalidateQueries({
        queryKey: quotationKeys.designer,
      });
    },
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: IUpdateQuotationInput;
    }) => updateQuotation(quotationId, data),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project === "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );

      queryClient.invalidateQueries({
        queryKey: quotationKeys.designer,
      });
    },
  });
};

export const useSubmitQuotationForApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: ISignQuotationInput;
    }) =>
      submitQuotationForApproval(
        quotationId,
        data
      ),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project === "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );

      queryClient.invalidateQueries({
        queryKey: quotationKeys.designer,
      });
    },
  });
};

export const useApproveQuotation = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: ISignQuotationInput;
    }) =>
      approveQuotation(
        quotationId,
        data
      ),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project ===
            "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );

      queryClient.invalidateQueries({
        queryKey: quotationKeys.designer,
      });
    },
  });
};

export const useRejectQuotation = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: IRejectQuotationInput;
    }) =>
      rejectQuotation(
        quotationId,
        data
      ),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project ===
            "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );

      queryClient.invalidateQueries({
        queryKey: quotationKeys.designer,
      });
    },
  });
};

export const useAcceptQuotation = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: ISignQuotationInput;
    }) =>
      acceptQuotation(
        quotationId,
        data
      ),

    onSuccess: (quotation) => {
      queryClient.setQueryData(
        quotationKeys.byProject(
          typeof quotation.project ===
            "string"
            ? quotation.project
            : quotation.project._id
        ),
        quotation
      );
    },
  });
};

export const useRejectQuotationByClient =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        quotationId,
        data,
      }: {
        quotationId: string;
        data: IRejectQuotationInput;
      }) =>
        rejectQuotationByClient(
          quotationId,
          data
        ),

      onSuccess: (quotation) => {
        queryClient.setQueryData(
          quotationKeys.byProject(
            typeof quotation.project ===
              "string"
              ? quotation.project
              : quotation.project._id
          ),
          quotation
        );
      },
    });
  };

/* Download quotation PDF */

export const useDownloadQuotation = () => {
  return useMutation({
    mutationFn: (quotationId: string) =>
      downloadQuotation(quotationId),

    onSuccess: (blob, quotationId) => {
      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        `quotation-${quotationId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });
};

