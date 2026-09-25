import type {
  ICatalogItem,
  ICategory,
  IMaterial,
  IColorTheme,
} from "../../catalog/types/catalog.types";

export interface IProjectRequestForm {
  projectName: string;

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };

  category: string;

  catalogItem: string;

  materials: string[];

  colorThemes: string[];

  measurements: {
    height: number;
    width: number;
    unit: "ft" | "cm";
    squareFeet: number;
  };

  description: string;

  referenceImages: string[];

  needBy?: string;
}

export interface IProjectRequest {
  _id: string;

  projectName?: string;

  client:
    | string
    | {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        address?: string;
      };

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };

  category?: string | ICategory;

  catalogItem?: string | ICatalogItem;

  materials: string[] | IMaterial[];

  colorThemes: string[] | IColorTheme[];

  measurements?: {
    height: number;
    width: number;
    unit: "ft" | "cm";
    squareFeet: number;
  };

  description?: string;

  referenceImages: string[];

  needBy?: string;

  estimatedTotal: number;

  status: "pending" | "approved" | "rejected";

  rejectionReason?: string;

  createdAt: string;

  updatedAt: string;


  roomInfo?: {
    roomType?: string;
    customRoomType?: string;
    totalArea?: number;
    width?: number;
    length?: number;
    budgetRange?: string;
    preferredStyle?: string;
    preferredTimeline?: string;
    customTimelineDate?: string;
  };

  images?: string[];

  additionalNotes?: string;

  catalogSelections?: unknown[];
}

export interface IProjectRequestPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProjectRequestListResponse {
  requests: IProjectRequest[];
  pagination: IProjectRequestPagination;
}

export interface ICatalogItemPagination {
  items: ICatalogItem[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}