export type MoodBoardStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "approved";

export type MoodBoardVersionStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "approved";

export type MoodBoardFileType =
  | "image"
  | "pdf";

export interface IMoodBoardFile {
  url: string;
  publicId: string;
  fileName: string;
  fileType: MoodBoardFileType;
}

export interface IMoodBoardVersion {
  _id?: string;
  versionNumber: number;
  files: IMoodBoardFile[];
  designerNotes?: string;
  status: MoodBoardVersionStatus;
  clientFeedback?: string;
  clientReferenceImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IMoodBoardCatalogReference {
  _id: string;
  name: string;
  image?: string;
}

export interface IMoodBoardProjectSourceRequest {
  _id: string;
  projectName?: string;
  description?: string;
  referenceImages?: string[];
  needBy?: string;
  estimatedTotal?: number;
  category?:
    | string
    | IMoodBoardCatalogReference;
  catalogItem?:
    | string
    | IMoodBoardCatalogReference;
  roomInfo?: {
    roomType?: string;
    customRoomType?: string;
  };
}

export interface IMoodBoardProject {
  _id: string;
  status: string;
  designerStatus: string;
  sourceRequest?:
    | string
    | IMoodBoardProjectSourceRequest;
}

export interface IMoodBoardUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface IMoodBoard {
  _id: string;

  project:
    | string
    | IMoodBoardProject;

  client:
    | string
    | IMoodBoardUser;

  designer:
    | string
    | IMoodBoardUser;

  status: MoodBoardStatus;

  versions: IMoodBoardVersion[];

  createdAt: string;
  updatedAt: string;
}

export interface IClientMoodBoard {
  _id: string;

  project:
    | string
    | IMoodBoardProject;

  designer:
    | string
    | IMoodBoardUser;

  status: MoodBoardStatus;

  currentVersion: IMoodBoardVersion;

  createdAt: string;
  updatedAt: string;
}


export interface IDesignerMoodBoardListItem {
  _id: string;

  project: IMoodBoardProject;

  client: IMoodBoardUser;

  designer: IMoodBoardUser;

  moodBoard: {
    _id: string;
    status: MoodBoardStatus;
    versions: IMoodBoardVersion[];
    createdAt: string;
    updatedAt: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export interface IDesignerMoodBoardListResponse {
  data: IDesignerMoodBoardListItem[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}



export interface IMoodBoardListResponse {
  data: IMoodBoard[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}



export interface CreateMoodBoardData {
  projectId: string;
  designerNotes?: string;
}

export interface AddMoodBoardVersionData {
  designerNotes?: string;
}

export interface RequestMoodBoardChangesData {
  clientFeedback: string;
}



export interface MoodBoardListParams {
  page?: number;
  limit?: number;
  search?: string;
}