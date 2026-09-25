import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCredentials, logout as logoutAction, updateUser as updateUserAction, type User } from "../../../store/authSlice";
 
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
 
  const login = (userData: User, tokenData: string) => {
    dispatch(setCredentials({ user: userData, token: tokenData }));
  };
 
  const logout = () => {
    dispatch(logoutAction());
  };
 
  const updateUser = (partialUser: Partial<User>) => {
    dispatch(updateUserAction(partialUser));
  };
 
  return { user, token, isAuthenticated, login, logout, updateUser };
};