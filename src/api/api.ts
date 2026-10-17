import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// API 요청 시 Access Token 자동 첨부
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  return config;
});