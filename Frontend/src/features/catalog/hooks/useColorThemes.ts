import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getColorThemes,
  createColorTheme,
  updateColorTheme,
  deleteColorTheme,
} from "../services/catalog.service";

export const useColorThemes = (
  page = 1,
  limit = 9
) => {
  return useQuery({
    queryKey: [
      "catalog",
      "color-themes",
      page,
      limit,
    ],
    queryFn: () =>
      getColorThemes(page, limit),
    placeholderData: (previousData) =>
      previousData,
  });
};

export const useCreateColorTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColorTheme,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "color-themes"],
      });
    },
  });
};

export const useUpdateColorTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateColorTheme(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "color-themes"],
      });
    },
  });
};

export const useDeleteColorTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColorTheme,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog", "color-themes"],
      });
    },
  });
};