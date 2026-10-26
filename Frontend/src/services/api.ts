import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("designflow_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;

let refreshQueue: Array<
  (token: string) => void
> = [];

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(
            (newToken: string) => {
              originalRequest.headers.Authorization =
                `Bearer ${newToken}`;

              resolve(api(originalRequest));
            }
          );
        });
      }

      isRefreshing = true;

      try {
        const response = await api.post(
          "/auth/refresh"
        );

        const newToken =
          response.data.data.accessToken;

        localStorage.setItem(
          "designflow_token",
          newToken
        );

        refreshQueue.forEach((callback) => {
          callback(newToken);
        });

        refreshQueue = [];

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        refreshQueue = [];

        localStorage.removeItem(
          "designflow_user"
        );

        localStorage.removeItem(
          "designflow_token"
        );

        window.location.href =
          "/designer/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;