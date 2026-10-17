import { api } from "./api";

import type {
  CreateReportResponse,
  ReportListParams,
  ReportListResponse,
  ReportDetailResponse,
} from "../types/report";

// 제보 등록
// POST /api/reports
// multipart/form-data
export const createReport = async (
  data: FormData,
): Promise<CreateReportResponse> => {
  const response = await api.post<CreateReportResponse>(
    "/api/reports",
    data,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  return response.data;
};

// 전체 제보 목록 조회
// GET /api/reports
export const getReports = async (
  params?: ReportListParams,
): Promise<ReportListResponse> => {
  const response = await api.get<ReportListResponse>(
    "/api/reports",
    { params },
  );

  return response.data;
};

// 내 제보 목록 조회
// GET /api/reports/me
export const getMyReports =
  async (): Promise<ReportListResponse> => {
    const response = await api.get<ReportListResponse>(
      "/api/reports/me",
    );

    return response.data;
  };

// 제보 상세 조회
// GET /api/reports/{reportId}
export const getReportDetail = async (
  reportId: number,
): Promise<ReportDetailResponse> => {
  const response = await api.get<ReportDetailResponse>(
    `/api/reports/${reportId}`,
  );

  return response.data;
};