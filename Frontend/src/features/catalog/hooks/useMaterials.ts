import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../services/catalog.service";

export const useMaterials = (
  page = 1,
  limit = 9
) => {
  return useQuery({
    queryKey: [
      "catalog",
      "materials",
      page,
      limit,
    ],
    queryFn: () =>
      getMaterials(page, limit),
    placeholderData: (previousData) =>
      previousData,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "materials"],
      });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateMaterial(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "materials"],
      });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "materials"],
      });
    },
  });
};