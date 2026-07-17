export const validateRegister = (data: any) => {
  const errors: string[] = [];
  if (!data.fullName || data.fullName.trim().length < 2)
    errors.push("Full name is required");
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
    errors.push("Valid email is required");
  if (!data.password || data.password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!data.role || !["admin", "designer", "client"].includes(data.role))
    errors.push("Valid role is required");
  return errors;
};

export const validateLogin = (data: any) => {
  const errors: string[] = [];
  if (!data.email) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  return errors;
};