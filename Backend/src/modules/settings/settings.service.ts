import { StudioSettings } from "./settings.model";

// Singleton pattern — always operate on the one settings document,
// creating it with defaults on first access if it doesn't exist yet.
export const getSettings = async () => {
  let settings = await StudioSettings.findOne();
  if (!settings) {
    settings = await StudioSettings.create({});
  }
  return settings;
};

export const updateSettings = async (data: Partial<{
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
}>) => {
  let settings = await StudioSettings.findOne();
  if (!settings) {
    settings = await StudioSettings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return settings;
};