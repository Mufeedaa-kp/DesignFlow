export interface IStudioSettings {
  _id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
}

export type UpdateStudioSettingsPayload = Partial <
  Pick<IStudioSettings, "businessName" | "contactEmail" | "contactPhone" | "address" | "businessHours">
>;