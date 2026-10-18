export type AdminIssueStatus =
  | "RECEIVED"
  | "CHECKING"
  | "IN_PROGRESS"
  | "RESOLVED";

export interface AdminIssueGroup {
  id: number;
  title: string;
  building: string;
  floor: string;
  facility: string;
  problemType: string;
  aiSummary: string;
  severity: string;
  urgencyScore: number;
  status: AdminIssueStatus;
}

export interface AdminIssueGroupsResponse {
  success: boolean;
  code: number;
  message: string;
  data: AdminIssueGroup[];
}