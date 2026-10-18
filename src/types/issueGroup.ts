import type { ReportApiStatus } from "./report";

// 문제 그룹 목록 데이터
export interface IssueGroup {
  id: number;
  title: string;
  building: string;
  floor: string;
  facility: string;
  problemType: string;
  aiSummary: string;
  severity: string;
  urgencyScore: number;
  status: ReportApiStatus;
}

// 문제 그룹 목록 조회 응답
export interface IssueGroupListResponse {
  success: boolean;
  code: number;
  message: string;
  data: IssueGroup[];
}

// 문제 그룹 상세 데이터
export interface IssueGroupDetail extends IssueGroup {
  reportContents: string[];
  resolutionContent: string | null;
  resolvedAt: string | null;
  reportTrend?: {
    date: string;
    count: number;
  }[];
}

// 문제 그룹 상세 조회 응답
export interface IssueGroupDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: IssueGroupDetail;
}
