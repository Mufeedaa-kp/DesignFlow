export interface IProfileResponse {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "designer" | "client";
  status: "active" | "inactive" | "blocked";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}
 
export type ProfileUpdatePayload = Partial<{
  fullName: string;
  phone: string;
  address: string;
  profileImage: string;
}>;
 