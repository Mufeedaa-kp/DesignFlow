

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCatalogItems,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from "../services/catalog.service";

export const useCatalogItems = (
  categoryId?: string,
  page = 1,
  limit = 9
) => {
  return useQuery({
    queryKey: [
      "catalogItems",
      categoryId,
      page,
      limit,
    ],

    queryFn: () =>
      getCatalogItems(
        categoryId,
        page,
        limit
      ),

    enabled: Boolean(categoryId),

    placeholderData: (previousData) =>
      previousData,
  });
};

export const useCreateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCatalogItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "items"],
      });
    },
  });
};

// Update catalog item
export const useUpdateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateCatalogItem(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "items"],
      });
    },
  });
};

// Delete catalog item
export const useDeleteCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCatalogItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "items"],
      });
    },
  });
};