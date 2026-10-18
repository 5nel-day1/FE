import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIssueStore } from "../../stores/useIssueStore";
import { useReportStore } from "../../stores/useReportStore";
import { campusIssues } from "../../mocks/campusIssues";

import {
  getIssueGroupDetail,
  updateIssueGroupStatus,
  type IssueGroupStatusCode,
} from "../../api/issueGroups";

import type { ReportStatus } from "../../types/report";

import ReportStatusBadge from "../common/ReportStatus/ReportStatus";
import { toast } from "../../utils/toast";

interface AdminStatusCardProps {
  issueId: number;
  serverStatus?: IssueGroupStatusCode;
  onStatusChanged?: (status: IssueGroupStatusCode) => void;
}

const statuses: ReportStatus[] = [
  "접수",
  "확인 중",
  "처리 중",
  "해결 완료",
];

const statusToCode: Record<
  ReportStatus,
  IssueGroupStatusCode
> = {
  접수: "RECEIVED",
  "확인 중": "CHECKING",
  "처리 중": "IN_PROGRESS",
  "해결 완료": "RESOLVED",
};

const codeToStatus: Record<
  IssueGroupStatusCode,
  ReportStatus
> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

const AdminStatusCard = ({
  issueId,
  serverStatus,
  onStatusChanged,
}: AdminStatusCardProps) => {
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);

  const [
    confirmedServerStatus,
    setConfirmedServerStatus,
  ] = useState<IssueGroupStatusCode | undefined>(
    serverStatus,
  );

  // 부모 컴포넌트에서 전달받은 서버 상태 동기화
  useEffect(() => {
    setConfirmedServerStatus(serverStatus);
  }, [serverStatus, issueId]);

  // 서버 상태가 전달되지 않았다면 상세 API에서 조회
  useEffect(() => {
    if (serverStatus !== undefined) return;

    let active = true;

    const fetchStatus = async () => {
      try {
        const response = await getIssueGroupDetail(issueId);

        if (active && response.success && response.data) {
          setConfirmedServerStatus(
            response.data.status as IssueGroupStatusCode,
          );
        }
      } catch (error) {
        console.error(
          "관리자 문제 그룹 상태 조회 실패:",
          error,
        );
      }
    };

    void fetchStatus();

    return () => {
      active = false;
    };
  }, [issueId, serverStatus]);

  // 기존 Zustand 문제 조회
  const issue = useIssueStore(
    (state) => state.issues[issueId],
  );

  // 기존 신규 제보 조회
  const submittedReport = useReportStore((state) =>
    state.reports.find(
      (report) =>
        report.id === issueId ||
        report.issueId === issueId,
    ),
  );

  // 기존 목업 문제 조회
  const mockIssue = campusIssues.find(
    (item) => item.id === issueId,
  );

  const updateStatus = useIssueStore(
    (state) => state.updateStatus,
  );

  // 실제 서버 상태를 최우선으로 사용
  const currentStatus: ReportStatus | undefined =
    confirmedServerStatus !== undefined
      ? codeToStatus[confirmedServerStatus]
      : issue?.status ??
        submittedReport?.status ??
        mockIssue?.status;

  const handleStatusClick = async (
    status: ReportStatus,
  ) => {
    if (isUpdating || currentStatus === status) {
      return;
    }

    // 해결 완료는 처리 결과 등록 화면으로 이동
    if (status === "해결 완료") {
      navigate(
        `/admin/problems/${issueId}/resolution`,
      );
      return;
    }

    // 실제 서버 문제 그룹 상태 변경
    if (
      confirmedServerStatus !== undefined ||
      serverStatus !== undefined
    ) {
      setIsUpdating(true);

      try {
        const response = await updateIssueGroupStatus(
          issueId,
          statusToCode[status],
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "상태 변경에 실패했습니다.",
          );
        }

        const updatedStatus =
          response.data.status as IssueGroupStatusCode;

        setConfirmedServerStatus(updatedStatus);

        onStatusChanged?.(updatedStatus);

        toast.success(
          `처리 상태가 '${status}' 상태로 변경되었습니다.`,
        );
      } catch (error) {
        console.error(
          "관리자 상태 변경 실패:",
          error,
        );

        toast.error(
          "처리 상태 변경에 실패했습니다. 다시 시도해 주세요.",
        );
      } finally {
        setIsUpdating(false);
      }

      return;
    }

    // 기존 목업 및 Zustand 상태 변경 유지
    updateStatus(issueId, status);

    toast.success(
      `처리 상태가 '${status}' 상태로 변경되었습니다.`,
    );
  };

  const formattedResolvedAt = issue?.resolvedAt
    ? issue.resolvedAt
        .slice(5, 10)
        .replace("-", ".")
    : null;

  if (!currentStatus) {
    return null;
  }

  return (
    <section className="w-full rounded-[22px] border border-[#D9D9D9] bg-white px-5 py-6 sm:px-7">
      {/* 제목 및 현재 상태 */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-black sm:text-[22px]">
          관리자 처리
        </h2>

        <ReportStatusBadge
          status={currentStatus}
        />
      </div>

      <p className="mt-3 text-[14px] text-[#737373] sm:text-[15px]">
        상태 변경
      </p>

      {/* 상태 선택 */}
      <div className="mt-5 grid grid-cols-4 gap-1 rounded-[16px] bg-[#F5F6F3] p-2 sm:gap-2">
        {statuses.map((status) => {
          const isSelected =
            currentStatus === status;

          return (
            <button
              key={status}
              type="button"
              aria-pressed={isSelected}
              disabled={isUpdating}
              onClick={() =>
                void handleStatusClick(status)
              }
              className={`min-w-0 rounded-[14px] px-1 py-3 text-[12px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 sm:px-3 sm:py-4 sm:text-[16px] ${
                isSelected
                  ? "bg-white text-black"
                  : "bg-transparent text-black hover:bg-white/70"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* 기존 처리 결과 표시 */}
      {currentStatus === "해결 완료" &&
        issue?.resolution && (
          <div className="mt-5 rounded-xl bg-[#E5EFE0] px-4 py-4">
            <p className="text-[12px] text-[#737373]">
              등록된 처리 결과
              {formattedResolvedAt && (
                <> · {formattedResolvedAt}</>
              )}
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words text-[14px] font-semibold leading-6 text-black">
              {issue.resolution}
            </p>
          </div>
        )}
    </section>
  );
};

export default AdminStatusCard;