export const getGoogleClientId = () => {
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return typeof rawClientId === "string" ? rawClientId.trim() : "";
};

export const isGoogleSignInConfigured = () => {
  return getGoogleClientId().length > 0;
};
