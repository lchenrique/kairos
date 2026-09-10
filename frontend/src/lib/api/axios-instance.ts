import axios from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useChurchStore } from "@/lib/stores/church-store";
import { getClerkAccessToken } from "@/lib/clerk-token";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
    "X-Kairos-Client": "web",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getClerkAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const churchId = useChurchStore.getState().activeChurchId;
    if (churchId && config.url !== "/system/context") {
      config.headers["X-Church-Id"] = churchId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const auth = useAuthStore.getState();
      auth.logout();
      const publicPaths = [
        "/login",
        "/setup",
        "/cadastro",
        "/auth",
        "/forgot-password",
        "/reset-password",
        "/accept-invite",
      ];
      const isPublic = publicPaths.some(
        (path) =>
          window.location.pathname === path ||
          window.location.pathname.startsWith(`${path}/`),
      );
      if (!auth.isSigningOut && !isPublic) {
        window.location.assign("/auth?mode=login&session=expired");
      }
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>({
  url,
  method,
  params,
  data,
  ...rest
}: Parameters<typeof axiosInstance.request>[0]) =>
  axiosInstance.request<unknown, T>({
    url,
    method,
    params,
    data,
    ...rest,
  });
