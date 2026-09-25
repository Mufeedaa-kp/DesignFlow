import api from "../../../services/api";

import type {
  IProjectResponse,
  IProjectsPaginated,
  ProjectStatus,
} from "../types/project.types";


/* Client Projects               */


export const getMyProjects = async (): Promise<IProjectResponse[]> => {
  const response = await api.get("/projects/mine");

  return response.data.data;
};


/* Admin - All Projects          */


export const getAllProjects = async (
  page = 1,
  status?: string,
  sort: "newest" | "oldest" = "newest",
  dateRange?: string
): Promise<IProjectsPaginated> => {
  const response = await api.get("/projects", {
    params: {
      page,
      limit: 20,
      status: status || undefined,
      sort,
      dateRange,
    },
  });

  return response.data.data;
};

/* Project Details               */


export const getProjectById = async (
  id: string
): Promise<IProjectResponse> => {
  const response = await api.get(`/projects/${id}`);

  return response.data.data;
};

/* ----------------------------- */
/* Admin - Update Project Status */
/* ----------------------------- */

export const updateProjectStatus = async (
  id: string,
  status: ProjectStatus
): Promise<IProjectResponse> => {
  const response = await api.patch(`/projects/${id}/status`, {
    status,
  });

  return response.data.data;
};

/* ----------------------------- */
/* Admin - Assign Designer       */
/* ----------------------------- */

export const assignDesigner = async (
  id: string,
  designerId: string
): Promise<IProjectResponse> => {
  const response = await api.patch(
    `/projects/${id}/assign-designer`,
    {
      designerId,
    }
  );

  return response.data.data;
};

/* ----------------------------- */
/* Designer - Assigned Projects  */
/* ----------------------------- */

export const getMyAssignedProjects = async (): Promise<
  IProjectResponse[]
> => {
  const response = await api.get("/projects/assigned");

  return response.data.data;
};

/* ----------------------------- */
/* Designer - Accept Assignment  */
/* ----------------------------- */

export const acceptAssignment = async (
  id: string
): Promise<IProjectResponse> => {
  const response = await api.patch(`/projects/${id}/accept`);

  return response.data.data;
};

/* ----------------------------- */
/* Designer - Reject Assignment  */
/* ----------------------------- */

export const rejectAssignment = async (
  id: string,
  reason: string
): Promise<IProjectResponse> => {
  const response = await api.patch(`/projects/${id}/reject`, {
    reason,
  });

  return response.data.data;
};