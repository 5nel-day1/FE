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

// 제보 등록 요청 데이터
export type CreateReport = Pick<
  Report,
  "building" | "floor" | "space" | "description"
> & {
  image?: File;
};
