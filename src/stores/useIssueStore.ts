import { create } from "zustand";
import { persist } from "zustand/middleware";

import { campusIssues } from "../mocks/campusIssues";
import type { ReportStatus } from "../types/report";

type ActiveStatus = Exclude<ReportStatus, "해결 완료">;

export interface IssueStateItem {
  id: number;
  status: ReportStatus;
  resolution?: string;
  resolvedAt?: string;
}

interface IssueStore {
  issues: Record<number, IssueStateItem>;

  getIssue: (issueId: number) => IssueStateItem | undefined;

  updateStatus: (issueId: number, status: ActiveStatus) => void;

  completeIssue: (issueId: number, resolution: string) => boolean;
}

// 목업 데이터 기반 초기 상태
const initialIssues: Record<number, IssueStateItem> = Object.fromEntries(
  campusIssues.map((issue) => [
    issue.id,
    {
      id: issue.id,
      status: issue.status,
      resolution: issue.resolution,
    },
  ]),
);

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: initialIssues,

      // 문제 정보 조회
      getIssue: (issueId) => get().issues[issueId],

      // 처리 상태 변경
      updateStatus: (issueId, status) => {
        set((state) => {
          const current = state.issues[issueId];

          return {
            issues: {
              ...state.issues,
              [issueId]: {
                ...current,
                id: issueId,
                status,
                resolution: undefined,
                resolvedAt: undefined,
              },
            },
          };
        });
      },

      // 해결 완료 및 처리 결과 등록
      completeIssue: (issueId, resolution) => {
        const trimmedResolution = resolution.trim();

        if (!trimmedResolution) {
          return false;
        }

        set((state) => ({
          issues: {
            ...state.issues,
            [issueId]: {
              ...state.issues[issueId],
              id: issueId,
              status: "해결 완료",
              resolution: trimmedResolution,
              resolvedAt: new Date().toISOString(),
            },
          },
        }));

        return true;
      },
    }),
    {
      // localStorage 저장 키
      name: "catch-u-issue-status",

      // 문제 상태 데이터만 저장
      partialize: (state) => ({
        issues: state.issues,
      }),
    },
  ),
);
