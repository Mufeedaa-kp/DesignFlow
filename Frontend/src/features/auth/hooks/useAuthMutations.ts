import { useMutation } from "@tanstack/react-query";
import {
  googleLogin,
  loginUser,
  requestRegistrationOtp,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "../services/auth.service";
import type { LoginFormValues, RegisterFormValues } from "../schema/auth.schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (values: LoginFormValues & { expectedRole?: "admin" | "designer" | "client" }) =>
      loginUser(values),
  });
};

export const useGoogleAuthMutation = () => {
  return useMutation({
    mutationFn: (credential: string) => googleLogin(credential),
  });
};

export const useRequestRegistrationOtpMutation = () => {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => requestRegistrationOtp(values),
  });
};

export const useResendRegistrationOtpMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resendRegistrationOtp(email),
  });
};

export const useVerifyRegistrationOtpMutation = () => {
  return useMutation({
    mutationFn: (values: { email: string; otp: string }) =>
      verifyRegistrationOtp(values),
  });
};
