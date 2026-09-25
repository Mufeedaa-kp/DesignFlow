export interface IUserResponse {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "designer" | "client";
  status: "active" | "inactive" | "blocked";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "designer";
  phone?: string;
}

export interface IUsersPaginated {
  users: IUserResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}