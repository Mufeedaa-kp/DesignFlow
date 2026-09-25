import api from "../../../services/api";
import type { IUserResponse, IUsersPaginated } from "../schema/user.schema";

export const getMyClients = async (page: number, search?: string) => {
  const res = await api.get("/users/my-clients", { params: { page, limit: 10, search } });
  return res.data.data as IUsersPaginated;
};

export const getMyClientById = async (id: string) => {
  const res = await api.get(`/users/my-clients/${id}`);
  return res.data.data as IUserResponse;
};