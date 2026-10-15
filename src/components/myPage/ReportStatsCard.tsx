import { myReports } from "../../mocks/myReport";
import { useReportStore } from "../../stores/useReportStore";
import { useIssueStore } from "../../stores/useIssueStore";

export default function ReportStatsCard() {
  // 새로 등록한 제보
  const submittedReports = useReportStore((state) => state.reports);

  // 관리자에서 변경한 문제 상태
  const issues = useIssueStore((state) => state.issues);

  // 전체 제보 개수 (기존 목업 + 신규 제보)
  const totalReports = myReports.length + submittedReports.length;

  // 기존 목업 제보 중 해결 완료
  const completedMockReports = myReports.filter(
    (report) => report.status === "해결 완료",
  ).length;

  // 새로 등록한 제보 중 해결 완료
  const completedSubmittedReports = submittedReports.filter((report) => {
    const status =
      report.issueId != null
        ? (issues[report.issueId]?.status ?? report.status)
        : report.status;

    return status === "해결 완료";
  }).length;

  // 전체 해결 완료 개수
  const completedReports = completedMockReports + completedSubmittedReports;

  return (
    <div className="flex w-full items-center rounded-2xl border border-[#D9D9D9] bg-white px-8 py-4">
      {/* 내 제보 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-3xl font-bold text-black">{totalReports}</span>

        <span className="text-base font-semibold text-[#737373]">내 제보</span>
      </div>

      {/* 해결 완료 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-3xl font-bold text-[#3B8519]">
          {completedReports}
        </span>

        <span className="text-base font-semibold text-[#737373]">
          해결 완료
        </span>
      </div>
    </div>
  );
}
