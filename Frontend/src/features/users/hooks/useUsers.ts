import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import type {  ICreateUserPayload, IUsersPaginated,IUserResponse } from "../schema/user.schema";

export const useAllUsers = (page: number, role?: string) => {
  return useQuery<IUsersPaginated>({
    queryKey: ["users", "all", page, role],
    queryFn: async () => {
      const res = await api.get("/users", { params: { page, limit: 20, role } });
      return res.data.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateUserPayload) => {
      const res = await api.post("/users", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/users/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
  });
};

export const useUserById = (id?: string) => {
  return useQuery<IUserResponse>({
    queryKey: ["users", "detail", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<{ fullName: string; phone: string }> }) => {
      const res = await api.patch(`/users/${id}`, values);
      return res.data.data as IUserResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", variables.id] });
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
  });
};