import { User } from "./user.model";
import { ApiError } from "../../utils/ApiError";
import bcrypt from "bcrypt";
import { Project } from "../projects/project.model";
 
 
 
export const getAllUsers = async (page: number, limit: number, role?: string) => {
  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
 
  const skip = (page - 1) * limit;
 
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);
 
  return {
    users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};
 
 
export const getUserById = async (
  userId: string
) => {
 
  const user = await User
    .findById(userId)
    .select("-password");
 
 
  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }
 
 
  return user;
 
};
 
 
export const createUser = async (data: { fullName: string; email: string; password: string; role: "designer" | "admin"; phone?: string }) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new ApiError(400, "Email already registered");
 
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });
  return user;
};
 
export const updateUserProfile = async (
  userId: string,
  data: Partial<{
    fullName: string;
    phone: string;
    address: string;
    profileImage: string;
  }>
) => {
 
 
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");
 
 
  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }
 
 
  return user;
 
};
 
 
export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive" | "blocked"
) => {
 
 
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    {
      new:true,
      runValidators:true
    }
  )
  .select("-password");
 
 
  if(!user){
 
    throw new ApiError(
      404,
      "User not found"
    );
 
  }
 
 
  return user;
 
};
 
export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: "inactive" },
    { new: true, runValidators: true }
  ).select("-password");
 
  if (!user) {
    throw new ApiError(404, "User not found");
  }
 
  return user;
};

export const getClientsForDesigner = async (
  designerId: string,
  page: number,
  limit: number,
  search?: string
) => {
  const clientIds = await Project.find({ designer: designerId }).distinct("client");

  const filter: Record<string, unknown> = {
    _id: { $in: clientIds },
    role: "client",
  };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").sort({ fullName: 1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getClientForDesigner = async (designerId: string, clientId: string) => {
  const hasSharedProject = await Project.exists({ designer: designerId, client: clientId });
  if (!hasSharedProject) {
    throw new ApiError(403, "This client is not on any of your assigned projects");
  }

  const user = await User.findOne({ _id: clientId, role: "client" }).select("-password");
  if (!user) throw new ApiError(404, "Client not found");

  return user;
};