import api from "../../../services/api";
import type { IStudioSettings, UpdateStudioSettingsPayload } from "../types/settings.types";

export const getSettings = async (): Promise<IStudioSettings> => {
  const res = await api.get("/settings");
  return res.data.data;
};

export const updateSettings = async (data: UpdateStudioSettingsPayload): Promise<IStudioSettings> => {
  const res = await api.patch("/settings", data);
  return res.data.data;
};