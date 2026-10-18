import { api } from "./api";

import type {
  IssueGroupListResponse,
  IssueGroupDetailResponse,
} from "../types/issueGroup";

// 전체 문제 그룹 목록 조회
// GET /api/issue-groups
export const getIssueGroups =
  async (): Promise<IssueGroupListResponse> => {
    const response = await api.get<IssueGroupListResponse>(
      "/api/issue-groups",
    );

    return response.data;
  };

// 문제 그룹 상세 조회
// GET /api/issue-groups/{issueGroupId}
export const getIssueGroupDetail = async (
  issueGroupId: number,
): Promise<IssueGroupDetailResponse> => {
  const response = await api.get<IssueGroupDetailResponse>(
    `/api/issue-groups/${issueGroupId}`,
  );

  return response.data;
};

export type IssueGroupStatusCode =
  | "RECEIVED"
  | "CHECKING"
  | "IN_PROGRESS"
  | "RESOLVED";

// 관리자 문제 그룹 처리 상태 변경
// PATCH /api/admin/issue-groups/{id}/status
export const updateIssueGroupStatus = async (
  issueGroupId: number,
  status: IssueGroupStatusCode,
  resolutionContent = "",
): Promise<IssueGroupDetailResponse> => {
  const response = await api.patch<IssueGroupDetailResponse>(
    `/api/admin/issue-groups/${issueGroupId}/status`,
    {
      status,
      resolutionContent,
    },
  );

  return response.data;
};