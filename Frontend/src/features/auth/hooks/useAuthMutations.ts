import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../services/auth.service";
import type { LoginFormValues, RegisterFormValues } from "../schema/auth.schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (values: LoginFormValues & { expectedRole?: "admin" | "designer" | "client" }) =>
      loginUser(values),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => registerUser(values),
  });
};