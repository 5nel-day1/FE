import { api } from "./api";

import type {
  AdminIssueGroupsResponse,
} from "../types/admin";

// 관리자 문제 그룹 목록 조회
// GET /api/admin/issue-groups
export const getAdminIssueGroups =
  async (): Promise<AdminIssueGroupsResponse> => {
    const response = await api.get<AdminIssueGroupsResponse>(
      "/api/admin/issue-groups",
    );

    return response.data;
  };