import api from "../../../services/api"
interface AuthResponseData {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "admin" | "designer" | "client"
  }
}
export const registerUser = async (data: {
  fullName: string
  email: string
  password: string
}) => {
  const res = await api.post("/auth/register", data)
  return res.data.data as AuthResponseData
}

export const loginUser = async (
  data: { email: string; password: string } & { expectedRole?: "admin" | "designer" | "client" }
) => {
  const res = await api.post("/auth/login", data)
  return res.data.data as AuthResponseData
}