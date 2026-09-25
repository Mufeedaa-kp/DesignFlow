import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addMoodBoardVersion,
  approveMoodBoard,
  createMoodBoard,
  getClientMoodBoard,
  getClientMoodBoards,
  getDesignerMoodBoard,
  getDesignerMoodBoards,
  getAdminMoodBoard,
  requestMoodBoardChanges,
  submitMoodBoard,
} from "../services/moodboard.service";

import type {
  AddMoodBoardVersionData,
  CreateMoodBoardData,
  MoodBoardListParams,
  RequestMoodBoardChangesData,
} from "../types/moodboard.types";



export const moodBoardKeys = {
  all: ["moodboards"] as const,

  designerList: (
    params?: MoodBoardListParams
  ) =>
    [
      "moodboards",
      "designer",
      "list",
      params,
    ] as const,

  clientList: (
    params?: MoodBoardListParams
  ) =>
    [
      "moodboards",
      "client",
      "list",
      params,
    ] as const,

  designerDetail: (
    projectId: string
  ) =>
    [
      "moodboards",
      "designer",
      projectId,
    ] as const,

  clientDetail: (
    projectId: string
  ) =>
    [
      "moodboards",
      "client",
      projectId,
    ] as const,
};



export const useDesignerMoodBoards = (
  params?: MoodBoardListParams
) => {
  return useQuery({
    queryKey:
      moodBoardKeys.designerList(
        params
      ),
    queryFn: () =>
      getDesignerMoodBoards(params),
  });
};



export const useClientMoodBoards = (
  params?: MoodBoardListParams
) => {
  return useQuery({
    queryKey:
      moodBoardKeys.clientList(params),
    queryFn: () =>
      getClientMoodBoards(params),
  });
};



export const useDesignerMoodBoard = (
  projectId?: string
) => {
  return useQuery({
    queryKey: projectId
      ? moodBoardKeys.designerDetail(
          projectId
        )
      : [
          "moodboards",
          "designer",
          "detail",
          "empty",
        ],

    queryFn: () => {
      if (!projectId) {
        throw new Error(
          "Project ID is required"
        );
      }

      return getDesignerMoodBoard(
        projectId
      );
    },

    enabled: Boolean(projectId),
  });
};



export const useClientMoodBoard = (
  projectId?: string
) => {
  return useQuery({
    queryKey: projectId
      ? moodBoardKeys.clientDetail(
          projectId
        )
      : [
          "moodboards",
          "client",
          "detail",
          "empty",
        ],

    queryFn: () => {
      if (!projectId) {
        throw new Error(
          "Project ID is required"
        );
      }

      return getClientMoodBoard(
        projectId
      );
    },

    enabled: Boolean(projectId),
  });
};

export const useAdminMoodBoard = (
  projectId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [
      "moodboards",
      "admin",
      projectId,
    ],
    queryFn: () =>
      getAdminMoodBoard(projectId),
    enabled:
      Boolean(projectId) && enabled,
  });
};


export const useCreateMoodBoard = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateMoodBoardData;
      files: File[];
    }) =>
      createMoodBoard(
        data,
        files
      ),

    onSuccess: (
      _data,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.designerDetail(
            variables.data.projectId
          ),
      });
    },
  });
};



export const useAddMoodBoardVersion =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        projectId,
        data,
        files,
      }: {
        projectId: string;
        data: AddMoodBoardVersionData;
        files: File[];
      }) =>
        addMoodBoardVersion(
          projectId,
          data,
          files
        ),

      onSuccess: (
        _data,
        variables
      ) => {
        queryClient.invalidateQueries({
          queryKey:
            moodBoardKeys.designerDetail(
              variables.projectId
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            moodBoardKeys.all,
        });
      },
    });
  };



export const useSubmitMoodBoard = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      projectId: string
    ) =>
      submitMoodBoard(
        projectId
      ),

    onSuccess: (
      _data,
      projectId
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.designerDetail(
            projectId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.all,
      });
    },
  });
};



export const useRequestMoodBoardChanges =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        projectId,
        data,
        referenceImages,
      }: {
        projectId: string;
        data: RequestMoodBoardChangesData;
        referenceImages?: File[];
      }) =>
        requestMoodBoardChanges(
          projectId,
          data,
          referenceImages
        ),

      onSuccess: (
        _data,
        variables
      ) => {
        queryClient.invalidateQueries({
          queryKey:
            moodBoardKeys.clientDetail(
              variables.projectId
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            moodBoardKeys.clientList(),
        });

        queryClient.invalidateQueries({
          queryKey:
            moodBoardKeys.all,
        });
      },
    });
  };



export const useApproveMoodBoard = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      projectId: string
    ) =>
      approveMoodBoard(
        projectId
      ),

    onSuccess: (
      _data,
      projectId
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.clientDetail(
            projectId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.clientList(),
      });

      queryClient.invalidateQueries({
        queryKey:
          moodBoardKeys.all,
      });
    },
  });
};