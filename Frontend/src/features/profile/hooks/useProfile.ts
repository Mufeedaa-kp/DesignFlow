import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as profileService from "../services/profile.service";
import type { IProfileResponse, ProfileUpdatePayload } from "../types/profile.types";
 
export const useMyProfile = () => {
  return useQuery<IProfileResponse>({
    queryKey: ["profile", "me"],
    queryFn: profileService.getMyProfile,
  });
};
 
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdatePayload) => profileService.updateMyProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile", "me"], updated);
    },
  });
};
 
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: (file: File) => profileService.uploadProfileImage(file),
  });
};