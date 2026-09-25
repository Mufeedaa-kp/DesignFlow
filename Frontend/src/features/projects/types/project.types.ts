import type {
  ICatalogItem,
  ICategory,
  IColorTheme,
  IMaterial,
} from "../../catalog/types/catalog.types";

export interface IProjectClient {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface IProjectDesigner {
  _id: string;
  fullName: string;
  email: string;
}

export interface IProjectSourceRequest {
  _id: string;

  projectName?: string;

  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };

 

  category?: string | ICategory;

  catalogItem?: string | ICatalogItem;

  materials?: string[] | IMaterial[];

  colorThemes?: string[] | IColorTheme[];

  measurements?: {
    height: number;
    width: number;
    squareFeet: number;
  };

  description?: string;

  referenceImages?: string[];

  needBy?: string;

  estimatedTotal?: number;



  roomInfo?: {
    roomType?: string;
    customRoomType?: string;
    totalArea?: number;
    width?: number;
    length?: number;
    budgetRange?: string;
    preferredStyle?: string;
    customStyle?: string;
    preferredTimeline?: string;
    customTimelineDate?: string;
  };

  images?: string[];

  additionalNotes?: string;

  catalogSelections?: unknown[];
}


export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "completed";



export type DesignerStatus =
  | "unassigned"
  | "pending"
  | "accepted"
  | "rejected";



export interface IProjectResponse {
  _id: string;

  sourceRequest: IProjectSourceRequest | string;

  client: IProjectClient | string;

  designer?: IProjectDesigner | string;

  designerStatus: DesignerStatus;

  designerRejectionReason?: string | null;

  status: ProjectStatus;

  createdAt: string;

  updatedAt: string;
}



export interface IProjectsPaginated {
  projects: IProjectResponse[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}