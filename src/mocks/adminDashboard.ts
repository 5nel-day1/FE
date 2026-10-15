import type {
  DashboardSummary,
  IssueAnalysis,
  InspectionPriority,
} from "../types/adminDashboard";

import { reports, getReportsByIssueId } from "./reports";

// 관리자 화면에서 표시할 AI 이상징후 분석 목업 데이터
// issueId는 campusIssues.ts의 통합 문제 ID와 연결
export const issueAnalyses: IssueAnalysis[] = [
  {
    issueId: 1,
    priority: "높음",
    reason: "최근 제보 급증",
    severity: "높음",
    aiSummary:
      "유담관 4층 화장실에서 세면대 배수 불량과 물 고임 관련 제보가 집중적으로 발생하고 있어 점검이 필요합니다.",

    symptoms: [
      { label: "배수 속도 저하", count: 4 },
      { label: "세면대 물 고임", count: 3 },
      { label: "배수구 막힘 의심", count: 1 },
    ],

    trend: [
      { date: "2026-10-08", count: 1 },
      { date: "2026-10-09", count: 2 },
      { date: "2026-10-10", count: 5 },
    ],
  },

  {
    issueId: 2,
    priority: "높음",
    reason: "동일 장소 집중",
    severity: "보통",
    aiSummary:
      "본관 2층 201호 강의실에서 냉방 성능 저하 제보가 반복적으로 접수되어 냉난방 설비 확인이 필요합니다.",

    symptoms: [
      { label: "냉방 성능 저하", count: 3 },
      { label: "실내 온도 상승", count: 1 },
      { label: "에어컨 풍량 부족", count: 1 },
    ],

    trend: [
      { date: "2026-10-08", count: 1 },
      { date: "2026-10-09", count: 1 },
      { date: "2026-10-10", count: 3 },
    ],
  },

  {
    issueId: 3,
    priority: "보통",
    reason: "반복 제보",
    severity: "보통",
    aiSummary:
      "청운관 지하 1층 열람실에서 조명 점등 불량과 반복 소등 문제가 보고되어 조명 설비 점검이 필요합니다.",

    symptoms: [
      { label: "조명 점등 불량", count: 1 },
      { label: "조명 반복 소등", count: 1 },
      { label: "일부 자리 조명 고장", count: 1 },
    ],

    trend: [
      { date: "2026-10-08", count: 1 },
      { date: "2026-10-09", count: 1 },
      { date: "2026-10-10", count: 1 },
    ],
  },
];

// 점검 필요도 정렬 순서
const priorityOrder: Record<InspectionPriority, number> = {
  높음: 0,
  보통: 1,
  낮음: 2,
};

// 점검 필요도가 높은 문제부터 정렬
export const sortedIssueAnalyses = [...issueAnalyses].sort(
  (a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority]
);

// 전체 제보 현황
// reports.ts의 실제 목업 데이터를 기준으로 자동 계산
export const dashboardSummary: DashboardSummary = {
  total: reports.length,

  received: reports.filter(
    (report) => report.status === "접수"
  ).length,

  checking: reports.filter(
    (report) => report.status === "확인 중"
  ).length,

  inProgress: reports.filter(
    (report) => report.status === "처리 중"
  ).length,

  resolved: reports.filter(
    (report) => report.status === "해결 완료"
  ).length,
};

// 문제 ID로 AI 분석 결과 조회
export const getIssueAnalysis = (
  issueId: number
): IssueAnalysis | undefined => {
  return issueAnalyses.find(
    (analysis) => analysis.issueId === issueId
  );
};

// 문제 ID로 관련 제보 수 조회
export const getRelatedReportCount = (
  issueId: number
): number => {
  return getReportsByIssueId(issueId).length;
};