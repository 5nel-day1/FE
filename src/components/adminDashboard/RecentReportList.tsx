import { useNavigate } from "react-router-dom";
import { recentReports } from "../../mocks/reports";
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

  return (
    <section className="w-full" aria-labelledby="recent-reports-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="recent-reports-heading"
          className="text-[20px] font-bold text-[#13213C]"
        >
          최근 제보
        </h2>

        <span className="text-[12px] text-[#6B7280]">최신 6건</span>
      </div>

      {recentReports.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
          아직 등록된 제보가 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          {recentReports.map((report, index) => (
            <button
              key={report.id}
              type="button"
              onClick={() => navigate(`/admin/problems/${report.issueId}`)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F8FAFC] sm:px-5 ${
                index !== recentReports.length - 1
                  ? "border-b border-[#EEF0F2]"
                  : ""
              }`}
            >
              {/* 왼쪽: 제보 정보 */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#13213C] sm:text-[16px]">
                  {report.building} {report.floor} / {report.aiSummary}
                </p>

                <time
                  dateTime={report.createdAt}
                  className="mt-1 block text-[13px] text-[#737373] sm:text-[14px]"
                >
                  {formatDate(report.createdAt)}
                </time>
              </div>

              {/* 오른쪽: 처리 상태 */}
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
