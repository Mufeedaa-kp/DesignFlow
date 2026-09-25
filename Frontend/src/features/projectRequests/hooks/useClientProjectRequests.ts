import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProjectRequest,
  getMyProjectRequests,
  getProjectRequestById,
  uploadProjectRequestImage,
} from "../services/projectRequest.service";

import type {
  IProjectRequestForm,
} from "../types/projectRequest.types";

export const projectRequestKeys = {
  all: ["projectRequests"] as const,

  mine: (
    page: number,
    limit: number,
    search: string,
    status: string
  ) =>
    [
      "projectRequests",
      "mine",
      page,
      limit,
      search,
      status,
    ] as const,

  detail: (id: string) =>
    ["projectRequests", id] as const,
};


export const useUploadProjectRequestImage =
  () => {
    return useMutation({
      mutationFn:
        uploadProjectRequestImage,
    });
  };


export const useCreateProjectRequest = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: IProjectRequestForm
    ) => createProjectRequest(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "projectRequests",
          "mine",
        ],
      });
    },
  });
};


export const useMyProjectRequests = (
  page = 1,
  limit = 9,
  search = "",
  status = ""
) => {
  return useQuery({
    queryKey:
      projectRequestKeys.mine(
        page,
        limit,
        search,
        status
      ),

    queryFn: () =>
      getMyProjectRequests(
        page,
        limit,
        search,
        status
      ),

    placeholderData: (
      previousData
    ) => previousData,
  });
};

export const useProjectRequest = (
  id?: string
) => {
  return useQuery({
    queryKey:
      projectRequestKeys.detail(
        id || ""
      ),

    queryFn: () =>
      getProjectRequestById(
        id as string
      ),

    enabled: Boolean(id),
  });
};