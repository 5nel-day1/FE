import type { ReportStatus } from "./report";

// 댓글 데이터 타입
export interface CampusIssueComment {
  id: number;
  author: string;
  createdAt: string;
  content: string;
}

// 캠퍼스 문제 현황 데이터 타입
export interface CampusIssue {
  id: number;

  // 장소
  building: string;
  floor: string;
  space: string;

  // 문제 정보
  description: string;
  detail: string;
  category: string;

  // 처리 상태
  status: ReportStatus;

  // 관련 제보
  relatedReports: number;

  // 날짜
  dateLabel: string;
  createdAt: string;

  // 사진
  imageUrl: string | null;

  // 공감 및 댓글
  likes: number;
  comments: CampusIssueComment[];
}