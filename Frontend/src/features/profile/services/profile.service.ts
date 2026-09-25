import api from "../../../services/api";
import type { IProfileResponse, ProfileUpdatePayload } from "../types/profile.types";
 
export const getMyProfile = async (): Promise<IProfileResponse> => {
  const res = await api.get("/profile/me");
  return res.data.data;
};
 
export const updateMyProfile = async (data: ProfileUpdatePayload): Promise<IProfileResponse> => {
  const res = await api.patch("/profile/me", data);
  return res.data.data;
};
 
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/profile/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.url;
};