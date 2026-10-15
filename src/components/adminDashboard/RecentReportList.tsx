import { useNavigate } from "react-router-dom";

import { reports } from "../../mocks/reports";
import { useIssueStore } from "../../stores/useIssueStore";
import { useReportStore } from "../../stores/useReportStore";

import ReportStatus from "../common/ReportStatus/ReportStatus";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString.replace("T", " ");
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day} ${hours}:${minutes}`;
};

const RecentReportList = () => {
  const navigate = useNavigate();

  // 관리자에서 변경한 문제 상태
  const issues = useIssueStore((state) => state.issues);

  // 학생이 새로 등록한 제보
  const submittedReports = useReportStore((state) => state.reports);

  // 목업 데이터 + 새로 등록한 제보
  // 해결 완료 제외, 최신 6건 표시
  const activeReports = [
    ...submittedReports.map((report) => ({
      ...report,
      aiSummary: report.description,

      // 신규 제보도 관리자 처리 상태 반영
      status:
        issues[report.issueId ?? report.id]?.status ??
        report.status,

      sourceKey: `submitted-${report.id}`,
    })),

    ...reports.map((report) => ({
      ...report,

      // 기존 목업 제보의 관리자 처리 상태 반영
      status:
        issues[report.issueId]?.status ??
        report.status,

      sourceKey: `mock-${report.id}`,
    })),
  ]
    .filter((report) => report.status !== "해결 완료")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <section
      className="w-full"
      aria-labelledby="recent-reports-heading"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="recent-reports-heading"
          className="text-[20px] font-bold text-[#13213C]"
        >
          최근 제보
        </h2>

        <span className="text-[12px] text-[#6B7280]">
          최신 {activeReports.length}건
        </span>
      </div>

      {activeReports.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
          현재 확인할 제보가 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          {activeReports.map((report, index) => (
            <button
              key={report.sourceKey}
              type="button"
              onClick={() => {
                if (
                  report.sourceKey.startsWith("submitted-")
                ) {
                  navigate(
                    `/admin/problems/submitted/${report.id}`,
                  );
                } else if (report.issueId != null) {
                  navigate(
                    `/admin/problems/${report.issueId}`,
                  );
                }
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F8FAFC] sm:px-5 ${
                index !== activeReports.length - 1
                  ? "border-b border-[#EEF0F2]"
                  : ""
              }`}
            >
              {/* 제보 정보 */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#13213C] sm:text-[16px]">
                  {report.building} {report.floor} /{" "}
                  {report.aiSummary}
                </p>

                <time
                  dateTime={report.createdAt}
                  className="mt-1 block text-[13px] text-[#737373] sm:text-[14px]"
                >
                  {formatDate(report.createdAt)}
                </time>
              </div>

              {/* 처리 상태 */}
              <div className="ml-auto shrink-0">
                <ReportStatus status={report.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentReportList;