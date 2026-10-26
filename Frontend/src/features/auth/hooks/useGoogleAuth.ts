import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { getErrorMessage } from "../../../shared/utils/errors";
import { useAuth } from "./useAuth";
import { useGoogleAuthMutation } from "./useAuthMutations";

type Role = "admin" | "designer" | "client";

export interface GoogleAuthFailure {
  message: string;
  action?: {
    label: string;
    to: string;
  };
}

const roleRedirects: Record<Role, string> = {
  admin: "/admin/dashboard",
  designer: "/designer/dashboard",
  client: "/client/dashboard",
};

const roleLabels: Record<Role, string> = {
  admin: "an admin",
  designer: "a designer",
  client: "a client",
};

const roleLoginPaths: Record<Role, string> = {
  admin: "/admin/login",
  designer: "/designer/login",
  client: "/client/login",
};

const roleLoginLabels: Record<Role, string> = {
  admin: "Go to admin sign-in",
  designer: "Go to designer sign-in",
  client: "Go to client sign-in",
};

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { mutateAsync: authenticateWithGoogle, isPending } =
    useGoogleAuthMutation();

  const signInWithGoogle = async (
    credential: string,
    expectedRole?: Role,
  ): Promise<GoogleAuthFailure | null> => {
    try {
      const data = await authenticateWithGoogle(credential);

      if (expectedRole && data.user.role !== expectedRole) {
        logout();
        await api.post("/auth/logout").catch(() => undefined);

        const actualRole = data.user.role;

        return {
          message: `This Google account belongs to ${roleLabels[actualRole]}. Please use the ${actualRole} login page.`,
          action: {
            label: roleLoginLabels[actualRole],
            to: roleLoginPaths[actualRole],
          },
        };
      }

      login(data.user, data.accessToken);
      toast.success("Signed in with Google");
      navigate(roleRedirects[data.user.role], { replace: true });
      return null;
    } catch (error: unknown) {
      return { message: getErrorMessage(error) };
    }
  };

  return { signInWithGoogle, isPending };
};
