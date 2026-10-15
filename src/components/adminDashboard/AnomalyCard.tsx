import { useNavigate } from "react-router-dom";
import type { IssueAnalysis } from "../../types/adminDashboard";
import { campusIssues } from "../../mocks/campusIssues";
import { getRelatedReportCount } from "../../mocks/adminDashboard";
import ReportStatus from "../common/ReportStatus/ReportStatus";

interface AnomalyCardProps {
  analysis: IssueAnalysis;
}

const AnomalyCard = ({ analysis }: AnomalyCardProps) => {
  const navigate = useNavigate();

  // AI 분석 결과와 연결된 통합 문제
  const issue = campusIssues.find((item) => item.id === analysis.issueId);

  if (!issue) return null;

  const reportCount = getRelatedReportCount(analysis.issueId);

  const maxTrend = Math.max(...analysis.trend.map((item) => item.count), 1);

  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/problems/${analysis.issueId}`)}
      className="w-full rounded-[22px] border border-[#D9D9D9] bg-white px-5 py-5 text-left transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        {/* 왼쪽: 문제 정보 */}
        <div className="min-w-0 flex-1">
          {/* 점검 필요도 */}
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#A50000]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#A50000]" />

            <span>점검 필요도 {analysis.priority}</span>
          </div>

          {/* 장소 */}
          <h3 className="break-keep text-[18px] font-bold text-black sm:text-[20px]">
            {issue.building} {issue.floor} {issue.space}
          </h3>

          {/* 카테고리 및 관련 제보 */}
          <p className="mt-3 text-[13px] text-[#737373] sm:text-[14px]">
            {issue.category} · 관련 제보 {reportCount}건
          </p>
        </div>

        {/* 오른쪽: 처리 상태 및 그래프 */}
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch gap-4">
          {/* 기존 공통 컴포넌트 재사용 */}
          <ReportStatus status={issue.status} />

          {/* 미니 그래프 */}
          <div
            className="flex h-10 items-end gap-1"
            role="img"
            aria-label={`최근 3일 제보 수: ${analysis.trend
              .map((item) => item.count)
              .join(", ")}건`}
          >
            {analysis.trend.map((item, index) => (
              <span
                key={item.date}
                className={`w-3 rounded-t-[3px] ${
                  index === analysis.trend.length - 1
                    ? "bg-[#A50000]"
                    : "bg-[#D9D9D9]"
                }`}
                style={{
                  height: `${Math.max((item.count / maxTrend) * 36, 4)}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};

export default AnomalyCard;
