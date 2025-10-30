import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: false,
});

// 401 리다이렉트에서 제외할 엔드포인트(경로 기준)
const AUTH_BYPASS_PATHS = [
  "/admin/auth/refresh",
  "/admin/auth/logout",
];

// 요청 인터셉터: 액세스 토큰 헤더 주입
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 응답 인터셉터: 401 → 로그인 페이지 이동 (단, refresh/logout 응답은 제외)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const reqUrl: string = err?.config?.url ?? "";
    const apiBase = import.meta.env.VITE_API_URL ?? "";

    // 절대/상대 URL 혼용 대비: baseURL을 제거해 순수 경로만 비교
    const path = reqUrl.startsWith("http")
      ? reqUrl.replace(apiBase, "")
      : reqUrl;

    const isBypassed = AUTH_BYPASS_PATHS.some((p) => path.startsWith(p));

    if (status === 401 && !isBypassed) {
      useAuthStore.getState().setAccessToken(null);

      window.location.assign("/login");
    }

    return Promise.reject(err);
  }
);

export default api;
