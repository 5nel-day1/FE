import { api } from "./api";

import type {
  NotificationSettings,
  UpdateNotificationResponse,
} from "../types/user";

// 알림 설정 변경
// PATCH /api/users/me/notifications
export const updateNotificationSettings = async (
  settings: NotificationSettings,
): Promise<UpdateNotificationResponse> => {
  const response = await api.patch<UpdateNotificationResponse>(
    "/api/users/me/notifications",
    settings,
  );

  return response.data;
};

import type { MyPageResponse } from "../types/user";

// 마이페이지 정보 조회
// GET /api/users/me
export const getMyPage = async (): Promise<MyPageResponse> => {
  const response = await api.get<MyPageResponse>("/api/users/me");

  return response.data;
};

// 회원 탈퇴
export const withdrawUser = async () => {
  const response = await api.delete<{
    success: boolean;
    code: number;
    message: string;
    data: string | null;
  }>("/api/users/me");

  return response.data;
};