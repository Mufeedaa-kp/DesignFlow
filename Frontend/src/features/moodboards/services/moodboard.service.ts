import api from "../../../services/api";

import type {
  AddMoodBoardVersionData,
  CreateMoodBoardData,
  IClientMoodBoard,
  IDesignerMoodBoardListResponse,
  IMoodBoard,
  IMoodBoardListResponse,
  MoodBoardListParams,
  RequestMoodBoardChangesData,
} from "../types/moodboard.types";



export const getDesignerMoodBoards = async (
  params?: MoodBoardListParams
): Promise<IDesignerMoodBoardListResponse> => {
  const response =
    await api.get(
      "/moodboards/designer",
      {
        params,
      }
    );

  return response.data.data;
};

export const getAdminMoodBoard = async (
  projectId: string
): Promise<IMoodBoard> => {
  const response = await api.get(
    `/moodboards/admin/${projectId}`
  );

  return response.data.data;
};


export const getClientMoodBoards = async (
  params?: MoodBoardListParams
): Promise<IMoodBoardListResponse> => {
  const response =
    await api.get(
      "/moodboards/client",
      {
        params,
      }
    );

  return response.data.data;
};



export const createMoodBoard = async (
  data: CreateMoodBoardData,
  files: File[]
): Promise<IMoodBoard> => {
  const formData = new FormData();

  formData.append(
    "projectId",
    data.projectId
  );

  if (data.designerNotes) {
    formData.append(
      "designerNotes",
      data.designerNotes
    );
  }

  files.forEach((file) => {
    formData.append(
      "files",
      file
    );
  });

  const response =
    await api.post(
      "/moodboards",
      formData
    );

  return response.data.data;
};



export const getDesignerMoodBoard =
  async (
    projectId: string
  ): Promise<IMoodBoard> => {
    const response =
      await api.get(
        `/moodboards/designer/${projectId}`
      );

    return response.data.data;
  };



export const getClientMoodBoard =
  async (
    projectId: string
  ): Promise<IClientMoodBoard> => {
    const response =
      await api.get(
        `/moodboards/client/${projectId}`
      );

    return response.data.data;
  };



export const addMoodBoardVersion =
  async (
    projectId: string,
    data: AddMoodBoardVersionData,
    files: File[]
  ): Promise<IMoodBoard> => {
    const formData = new FormData();

    if (data.designerNotes) {
      formData.append(
        "designerNotes",
        data.designerNotes
      );
    }

    files.forEach((file) => {
      formData.append(
        "files",
        file
      );
    });

    const response =
      await api.post(
        `/moodboards/${projectId}/versions`,
        formData
      );

    return response.data.data;
  };



export const submitMoodBoard =
  async (
    projectId: string
  ): Promise<IMoodBoard> => {
    const response =
      await api.patch(
        `/moodboards/${projectId}/submit`
      );

    return response.data.data;
  };



export const requestMoodBoardChanges =
  async (
    projectId: string,
    data: RequestMoodBoardChangesData,
    referenceImages: File[] = []
  ): Promise<IClientMoodBoard> => {
    const formData = new FormData();

    formData.append(
      "clientFeedback",
      data.clientFeedback
    );

    referenceImages.forEach((file) => {
      formData.append(
        "files",
        file
      );
    });

    const response =
      await api.patch(
        `/moodboards/${projectId}/request-changes`,
        formData
      );

    return response.data.data;
  };



export const approveMoodBoard =
  async (
    projectId: string
  ): Promise<IClientMoodBoard> => {
    const response =
      await api.patch(
        `/moodboards/${projectId}/approve`
      );

    return response.data.data;
  };