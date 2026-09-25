export const ROOM_TYPES = [
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "home_office", label: "Home Office" },
  { value: "dining_room", label: "Dining Room" },
  { value: "full_home", label: "Full Home" },
  { value: "other", label: "Other" },
] as const;

export const BUDGET_RANGES = [
  { value: "under_10k", label: "Under ₹1L" },
  { value: "10k_25k", label: "₹1L – ₹3L" },
  { value: "25k_50k", label: "₹3L – ₹7L" },
  { value: "50k_100k", label: "₹7L – ₹15L" },
  { value: "100k_plus", label: "₹15L+" },
] as const;

export const PREFERRED_STYLES = [
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "traditional", label: "Traditional" },
  { value: "industrial", label: "Industrial" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "bohemian", label: "Bohemian" },
  { value: "transitional", label: "Transitional" },
  { value: "other", label: "Other" },
] as const;

export const PREFERRED_TIMELINES = [
  { value: "asap", label: "ASAP" },
  { value: "within_1_month", label: "Within 1 Month" },
  { value: "1_3_months", label: "1-3 Months" },
  { value: "3_6_months", label: "3-6 Months" },
  { value: "flexible", label: "Flexible" },
  { value: "other", label: "Other (specify date)" },
] as const;