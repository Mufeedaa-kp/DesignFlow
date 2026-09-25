import api from "../../../services/api";

import type {
  IProjectRequest,
  IProjectRequestListResponse,
} from "../types/projectRequest.types";

export const getAllProjectRequests = async (
  page = 1,
  limit = 10,
  status = ""
): Promise<IProjectRequestListResponse> => {
  const response = await api.get("/project-requests", {
    params: {
      page,
      limit,
      status: status || undefined,
    },
  });

  return response.data.data;
};

/*
 * Get one project request
 *
 * Used by admin request details page.
 */
export const getAdminProjectRequestById = async (
  id: string
): Promise<IProjectRequest> => {
  const response = await api.get(
    `/project-requests/${id}`
  );

  return response.data.data;
};

/*
 * Approve project request
 *
 * Admin approval creates the project
 * on the backend.
 */
export const approveProjectRequest = async (
  id: string
): Promise<IProjectRequest> => {
  const response = await api.patch(
    `/project-requests/${id}/approve`
  );

  return response.data.data;
};

/*
 * Reject project request
 */
export const rejectProjectRequest = async (
  id: string,
  rejectionReason: string
): Promise<IProjectRequest> => {
  const response = await api.patch(
    `/project-requests/${id}/reject`,
    {
      rejectionReason,
    }
  );

  return response.data.data;
};