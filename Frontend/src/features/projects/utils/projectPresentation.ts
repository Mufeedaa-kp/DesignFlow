import type {
  IProjectClient,
} from "../types/project.types";

interface ProjectCatalogReference {
  name?: string;
  image?: string;
}

export interface ProjectDisplaySource {
  projectName?: string;
  category?:
    | string
    | ProjectCatalogReference;
  catalogItem?:
    | string
    | ProjectCatalogReference;
  referenceImages?: string[];
  images?: string[];
  needBy?: string;
  estimatedTotal?: number;
  roomInfo?: {
    roomType?: string;
    customRoomType?: string;
  };
}

type ProjectClient =
  | string
  | Pick<IProjectClient, "fullName" | "email">
  | null
  | undefined;

export const getProjectSource = (
  sourceRequest:
    | string
    | ProjectDisplaySource
    | null
    | undefined
): ProjectDisplaySource | undefined => {
  if (
    !sourceRequest ||
    typeof sourceRequest === "string"
  ) {
    return undefined;
  }

  return sourceRequest;
};

export const getProjectName = (
  source?: ProjectDisplaySource | null
) => {
  if (!source) {
    return "Project";
  }

  if (source.projectName?.trim()) {
    return source.projectName.trim();
  }

  if (
    source.catalogItem &&
    typeof source.catalogItem === "object" &&
    source.catalogItem.name
  ) {
    return source.catalogItem.name;
  }

  if (source.roomInfo) {
    if (
      source.roomInfo.roomType === "other" &&
      source.roomInfo.customRoomType
    ) {
      return source.roomInfo.customRoomType;
    }

    if (source.roomInfo.roomType) {
      return source.roomInfo.roomType;
    }
  }

  return "Project";
};

export const getProjectImage = (
  source?: ProjectDisplaySource | null
): string | undefined => {
  if (!source) {
    return undefined;
  }

  const catalogImage =
    source.catalogItem &&
    typeof source.catalogItem === "object"
      ? source.catalogItem.image
      : undefined;

  const categoryImage =
    source.category &&
    typeof source.category === "object"
      ? source.category.image
      : undefined;

  return (
    catalogImage ||
    categoryImage ||
    source.referenceImages?.[0] ||
    source.images?.[0]
  );
};

export const getProjectCategoryName = (
  source?: ProjectDisplaySource | null
): string | undefined => {
  if (
    !source?.category ||
    typeof source.category === "string"
  ) {
    return undefined;
  }

  return source.category.name;
};

export const getProjectClientName = (
  client: ProjectClient
) => {
  if (!client || typeof client === "string") {
    return "Client";
  }

  return client.fullName || "Client";
};

export const getProjectClientEmail = (
  client: ProjectClient
): string | undefined => {
  if (!client || typeof client === "string") {
    return undefined;
  }

  return client.email;
};
