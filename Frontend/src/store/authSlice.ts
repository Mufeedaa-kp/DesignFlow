import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
 
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: "admin" | "designer" | "client";
}
 
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
 
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("designflow_user");
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
 
const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem("designflow_token"),
  isAuthenticated: !!localStorage.getItem("designflow_token"),
};
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("designflow_user", JSON.stringify(action.payload.user));
      localStorage.setItem("designflow_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("designflow_user");
      localStorage.removeItem("designflow_token");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("designflow_user", JSON.stringify(state.user));
    },
  },
});
 
export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;