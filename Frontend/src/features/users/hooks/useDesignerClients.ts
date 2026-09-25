import { useQuery } from "@tanstack/react-query";
import { getMyClients, getMyClientById } from "../services/designerClients.service";

export const useMyClients = (page: number, search?: string) =>
  useQuery({
    queryKey: ["designer-clients", page, search],
    queryFn: () => getMyClients(page, search),
  });

export const useMyClientById = (id?: string) =>
  useQuery({
    queryKey: ["designer-client", id],
    queryFn: () => getMyClientById(id!),
    enabled: !!id,
  });