import api from "../../../services/api";

import type {
  IProjectRequest,
  IProjectRequestForm,
  IProjectRequestListResponse,
} from "../types/projectRequest.types";

/* --------------------------------
   Upload Reference Image
--------------------------------- */

export const uploadProjectRequestImage = async (
  file: File
): Promise<string> => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post(
    "/project-requests/upload-image",
    formData
  );

  return response.data.data.url;
};

/* --------------------------------
   Create Project Request
--------------------------------- */

export const createProjectRequest = async (
  data: IProjectRequestForm
): Promise<IProjectRequest> => {
  const response = await api.post(
    "/project-requests",
    data
  );

  return response.data.data;
};

/* --------------------------------
   Get My Project Requests
--------------------------------- */

export const getMyProjectRequests = async (
  page = 1,
  limit = 9,
  search = "",
  status = ""
): Promise<IProjectRequestListResponse> => {
  const response = await api.get(
    "/project-requests/mine",
    {
      params: {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );

  return response.data.data;
};

/* --------------------------------
   Get Project Request By ID
--------------------------------- */

export const getProjectRequestById = async (
  id: string
): Promise<IProjectRequest> => {
  const response = await api.get(
    `/project-requests/${id}`
  );

  return response.data.data;
};