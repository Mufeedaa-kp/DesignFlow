import { User } from "../users/user.model";
import { ApiError } from "../../utils/ApiError";
 
export const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password")
 
  if (!user) {
    throw new ApiError(404, "User not found");
  }
 
  return user
}
 
export const updateMyProfile = async (
  userId: string,
  data: Partial<{
    fullName: string
    phone: string
    address: string
    profileImage: string
  }>
) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("-password")
 
  if (!user) {
    throw new ApiError(404, "User not found");
  }
 
  return user
}