import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import type { ProjectRequestFormValues } from "../schemas/projectRequest.schema";

// Client: fetch my own requests
export const useMyRequests = () => {
  return useQuery({
    queryKey: ["project-requests", "mine"],
    queryFn: async () => {
      const res = await api.get("/project-requests/mine");
      return res.data.requests;
    },
  });
};

// Admin: fetch all requests, paginated
export const useAllRequests = (page: number, status?: string) => {
  return useQuery({
    queryKey: ["project-requests", "all", page, status],
    queryFn: async () => {
      const res = await api.get("/project-requests", {
        params: { page, limit: 20, status },
      });
      return res.data; // { requests, total, page, totalPages }
    },
  });
};

// Client: submit a new request
export const useSubmitRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProjectRequestFormValues) => {
      const res = await api.post("/project-requests", values);
      return res.data.request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-requests", "mine"] });
    },
  });
};

// Admin: approve a request (assign designer)
export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, designerId }: { id: string; designerId: string }) => {
      const res = await api.patch(`/project-requests/${id}/approve`, { designerId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-requests", "all"] });
    },
  });
};

// Admin: reject a request
export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await api.patch(`/project-requests/${id}/reject`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-requests", "all"] });
    },
  });
};