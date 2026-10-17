// 제보 처리 상태
export type ReportStatus =
  | "접수"
  | "확인 중"
  | "처리 중"
  | "해결 완료";

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

// 제보 등록 API 요청 데이터
// multipart/form-data의 data 파트
export interface CreateReportRequest {
  building: string;
  floor: string;
  spaceDetail: string;
  content: string;
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

// 백엔드 제보 처리 상태
export type ReportApiStatus =
  | "RECEIVED"
  | "CHECKING"
  | "IN_PROGRESS"
  | "RESOLVED";

// 제보 목록 조회 데이터
export interface ReportListItem {
  id: number;
  receiptNumber: string;
  title: string;
  studentName: string;
  content: string;
  photoUrl: string | null;
  status: ReportApiStatus;
  likeCount: number;
  resolveContent: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

// 전체 제보 목록 조회 응답
export interface ReportListResponse {
  success: boolean;
  code: number;
  message: string;
  data: ReportListItem[];
}

// 제보 목록 조회 필터
export interface ReportListParams {
  status?: ReportApiStatus;
}

// 제보 상세 조회 데이터
export interface ReportDetail {
  id: number;
  receiptNumber: string;
  title: string;
  studentName: string;
  content: string;
  photoUrl: string | null;
  status: ReportApiStatus;
  likeCount: number;

  // 로그인한 사용자의 공감 여부
  liked: boolean;

  resolveContent: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

// 제보 상세 조회 응답
export interface ReportDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: ReportDetail;
}