import { useNavigate } from "react-router-dom";

import { useIssueStore } from "../../stores/useIssueStore";
import { useReportStore } from "../../stores/useReportStore";
import { campusIssues } from "../../mocks/campusIssues";

import type { ReportStatus } from "../../types/report";

import ReportStatusBadge from "../common/ReportStatus/ReportStatus";
import { toast } from "../../utils/toast";

interface AdminStatusCardProps {
  issueId: number;
}

const statuses: ReportStatus[] = [
  "접수",
  "확인 중",
  "처리 중",
  "해결 완료",
];

const AdminStatusCard = ({
  issueId,
}: AdminStatusCardProps) => {
  const navigate = useNavigate();

  // 관리자 문제 상태 조회
  const issue = useIssueStore(
    (state) => state.issues[issueId],
  );

  // 새로 접수된 제보 조회
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

  // 현재 처리 상태
  const currentStatus: ReportStatus | undefined =
    issue?.status ??
    submittedReport?.status ??
    mockIssue?.status;

  // 관리자 처리 상태 변경
  const updateStatus = useIssueStore(
    (state) => state.updateStatus,
  );

  if (!currentStatus) return null;

  const handleStatusClick = (status: ReportStatus) => {
    // 해결 완료는 처리 결과 등록 페이지로 이동
    if (status === "해결 완료") {
      if (currentStatus !== "해결 완료") {
        navigate(
          `/admin/problems/${issueId}/resolution`,
        );
      }

      return;
    }

    // 접수 / 확인 중 / 처리 중
    if (currentStatus !== status) {
      updateStatus(issueId, status);

      toast.success(
        `처리 상태가 '${status}' 상태로 변경되었습니다.`,
      );
    }
  };

  // 해결 완료 날짜
  const formattedResolvedAt = issue?.resolvedAt
    ? issue.resolvedAt
        .slice(5, 10)
        .replace("-", ".")
    : null;

  return (
    <section className="w-full rounded-[22px] border border-[#D9D9D9] bg-white px-5 py-6 sm:px-7">
      {/* 제목 및 현재 상태 */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-black sm:text-[22px]">
          관리자 처리
        </h2>

        <ReportStatusBadge status={currentStatus} />
      </div>

      <p className="mt-3 text-[14px] text-[#737373] sm:text-[15px]">
        상태 변경
      </p>

      {/* 상태 선택 */}
      <div className="mt-5 grid grid-cols-4 gap-1 rounded-[16px] bg-[#F5F6F3] p-2 sm:gap-2">
        {statuses.map((status) => {
          const isSelected = currentStatus === status;

          return (
            <button
              key={status}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleStatusClick(status)}
              className={`min-w-0 rounded-[14px] px-1 py-3 text-[12px] font-semibold transition-colors sm:px-3 sm:py-4 sm:text-[16px] ${
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

      {/* 해결 완료 시 처리 결과 */}
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