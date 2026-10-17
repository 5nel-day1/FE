import { api } from "./api";

import type {
  CreateReportRequest,
  CreateReportResponse,
} from "../types/report";

export const createReport = async (
  data: CreateReportRequest,
): Promise<CreateReportResponse> => {
  const response = await api.post<CreateReportResponse>(
    "/api/reports",
    data,
  );

  return response.data;
};