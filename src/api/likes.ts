import { api } from "./api";
import type { ToggleLikeResponse } from "../types/like";

// 제보 공감 등록 및 취소
export const toggleReportLike = async (
  reportId: number,
): Promise<ToggleLikeResponse> => {
  const response = await api.post<ToggleLikeResponse>(
    `/api/reports/${reportId}/like`,
  );

  return response.data;
};