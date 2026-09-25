import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/catalog.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "categories"],
      });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateCategory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "categories"],
      });
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "categories"],
      });
    },
  });
};