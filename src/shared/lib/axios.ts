import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().setAccessToken(null);
      // 필요시 location.href="/login"
    }
    return Promise.reject(err);
  }
);

export default api;
