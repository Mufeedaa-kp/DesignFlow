import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  acceptAssignment,
  assignDesigner,
  getAllProjects,
  getMyAssignedProjects,
  getMyProjects,
  getProjectById,
  rejectAssignment,
  updateProjectStatus,
} from "../services/project.service";

import type {
  IProjectResponse,
  ProjectStatus,
} from "../types/project.types";


export const projectKeys = {
  all: ["projects"] as const,

  mine: ["projects", "mine"] as const,

  assigned: ["projects", "assigned"] as const,

  list: (
    page: number,
    status?: string,
    sort: "newest" | "oldest" = "newest",
    dateRange?: string
  ) =>
    [
      "projects",
      "all",
      page,
      status,
      sort,
      dateRange,
    ] as const,

  detail: (id: string) =>
    ["projects", "detail", id] as const,
}

export const useMyProjects = () => {
  return useQuery<IProjectResponse[]>({
    queryKey: projectKeys.mine,
    queryFn: getMyProjects,
  });
};


export const useAllProjects = (
  page: number,
  status?: string,
  sort: "newest" | "oldest" = "newest",
  dateRange?: string
) => {
  return useQuery({
    queryKey: projectKeys.list(
      page,
      status,
      sort,
      dateRange
    ),

    queryFn: () =>
      getAllProjects(
        page,
        status,
        sort,
        dateRange
      ),

    placeholderData: (previousData) =>
      previousData,
  });
};



export const useProjectById = (id?: string) => {
  return useQuery<IProjectResponse>({
    queryKey: projectKeys.detail(id || ""),

    queryFn: () =>
      getProjectById(id as string),

    enabled: Boolean(id),
  });
};



export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ProjectStatus;
    }) =>
      updateProjectStatus(id, status),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(
          variables.id
        ),
      });
    },
  });
};



export const useAssignDesigner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      designerId,
    }: {
      id: string;
      designerId: string;
    }) =>
      assignDesigner(id, designerId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(
          variables.id
        ),
      });
    },
  });
};


export const useMyAssignedProjects = () => {
  return useQuery<IProjectResponse[]>({
    queryKey: projectKeys.assigned,
    queryFn: getMyAssignedProjects,
  });
};


export const useAcceptAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      acceptAssignment(id),

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.assigned,
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
};


export const useRejectAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) =>
      rejectAssignment(id, reason),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.assigned,
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(
          variables.id
        ),
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
};