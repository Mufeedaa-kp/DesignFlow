import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  approveProjectRequest,
  getAdminProjectRequestById,
  getAllProjectRequests,
  rejectProjectRequest,
} from "../services/adminProjectRequest.service";



export const adminProjectRequestKeys = {
  all: ["adminProjectRequests"] as const,

  list: (
    page: number,
    limit: number,
    status: string
  ) =>
    [
      "adminProjectRequests",
      "list",
      page,
      limit,
      status,
    ] as const,

  detail: (id: string) =>
    ["adminProjectRequests", "detail", id] as const,
};



export const useAdminProjectRequests = (
  page = 1,
  limit = 10,
  status = ""
) => {
  return useQuery({
    queryKey: adminProjectRequestKeys.list(
      page,
      limit,
      status
    ),

    queryFn: () =>
      getAllProjectRequests(
        page,
        limit,
        status
      ),

    placeholderData: (previousData) =>
      previousData,
  });
};



export const useAdminProjectRequest = (
  id?: string
) => {
  return useQuery({
    queryKey: adminProjectRequestKeys.detail(
      id || ""
    ),

    queryFn: () =>
      getAdminProjectRequestById(id as string),

    enabled: Boolean(id),
  });
};



export const useApproveProjectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      approveProjectRequest(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey:
          adminProjectRequestKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          adminProjectRequestKeys.detail(id),
      });
    },
  });
};



export const useRejectProjectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) =>
      rejectProjectRequest(
        id,
        rejectionReason
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          adminProjectRequestKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          adminProjectRequestKeys.detail(
            variables.id
          ),
      });
    },
  });
};