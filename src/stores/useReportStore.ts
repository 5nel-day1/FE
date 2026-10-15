import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReportStatus } from "../types/report";
import { myReports } from "../mocks/myReport";

type ReportId = number;

export interface SubmittedReport {
  id: ReportId;
  receiptNumber: string;
  userId: number;
  issueId: number | null;
  building: string;
  floor: string;
  space: string;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: string;
}

export type NewReport = Pick<
  SubmittedReport,
  "userId" | "building" | "floor" | "space" | "description"
> & {
  imageUrl?: string;
  issueId?: number | null;
};

interface ReportStore {
  reports: SubmittedReport[];
  addReport: (report: NewReport) => SubmittedReport;
  updateReportIssue: (reportId: ReportId, issueId: number) => void;
  clearReports: () => void;
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: [],

      // 새로운 제보 등록
      addReport: (report) => {
        const existingIds = get().reports.map((item) => item.id);
        const nextId = Math.max(Date.now(), ...existingIds, 0) + 1;

        const mockReceiptNumbers = myReports.map((item) => {
          const withReceipt = item as typeof item & {
            receiptNumber?: string;
          };

          return (
            withReceipt.receiptNumber ??
            `SKU${String(item.id).padStart(4, "0")}`
          );
        });

        const usedReceiptNumbers = [
          ...mockReceiptNumbers,
          ...get().reports.map((item) => item.receiptNumber),
        ];

        const lastReceiptNumber = usedReceiptNumbers.reduce(
          (max, value) => {
            const match = /^SKU(\d{4})$/.exec(value);

            return match
              ? Math.max(max, Number(match[1]))
              : max;
          },
          0,
        );

        const receiptNumber = `SKU${String(
          lastReceiptNumber + 1,
        ).padStart(4, "0")}`;

        const created: SubmittedReport = {
          ...report,
          id: nextId,
          receiptNumber,
          issueId: report.issueId ?? null,
          status: "접수",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reports: [created, ...state.reports],
        }));

        return created;
      },

      // AI 분석 후 기존 문제와 연결
      updateReportIssue: (reportId, issueId) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? { ...report, issueId }
              : report,
          ),
        })),

      // 등록된 제보 초기화
      clearReports: () => set({ reports: [] }),
    }),
    {
      name: "catch-u-submitted-reports",
    },
  ),
);