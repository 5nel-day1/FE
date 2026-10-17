// 제보 처리 상태
export type ReportStatus = "접수" | "확인 중" | "처리 중" | "해결 완료";

// 제보 데이터
export interface Report {
  id: number;
  building: string;
  floor: string;
  space: string;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: string;
  resolution?: string;
  resolvedAt?: string;

  // 관리자 페이지 연동
  userId?: number;
  issueId?: number;
  aiSummary?: string;
}

// 제보 등록 요청 데이터 (기존 프론트엔드)
export type CreateReport = Pick<
  Report,
  "building" | "floor" | "space" | "description"
> & {
  image?: File;
};

// 제보 등록 API 요청 데이터 (POST /api/reports)
export interface CreateReportRequest {
  building: string;
  floor: string;
  spaceDetail: string;
  content: string;
  photoUrl: string;
}

// 제보 등록 API 응답 데이터
export interface CreateReportResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    id: number;
    receiptNumber: string;
    title: string;
    studentName: string;
    content: string;
    photoUrl: string | null;
    status: string;
    likeCount: number;
    resolveContent: string | null;
    resolvedAt: string | null;
    createdAt: string;
  };
}