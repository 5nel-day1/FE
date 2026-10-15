import type { ReportStatus } from "./report";

// AI가 판단한 점검 필요도
export type InspectionPriority = "높음" | "보통" | "낮음";

// 날짜별 관련 제보 발생 추이
export interface ReportTrend {
  date: string;
  count: number;
}

// AI가 여러 제보를 분석해 도출한 주요 증상
export interface IssueSymptom {
  label: string;
  count?: number;
}

// 통합 문제별 관리자 AI 분석 정보
export interface IssueAnalysis {
  issueId: number;
  priority: InspectionPriority;
  reason: string;
  symptoms: IssueSymptom[];
  trend: ReportTrend[];
  severity: InspectionPriority;
  aiSummary: string;
}

// 관리자 대시보드 제보 현황
export interface DashboardSummary {
  total: number;
  received: number;
  checking: number;
  inProgress: number;
  resolved: number;
}

// 통합 문제와 AI 분석을 결합해 화면에 표시할 데이터
export interface AdminIssueOverview {
  issueId: number;
  building: string;
  floor: string;
  space: string;
  category: string;
  status: ReportStatus;
  relatedReportCount: number;
  analysis: IssueAnalysis;
}