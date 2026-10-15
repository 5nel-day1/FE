import type { IssueAnalysis } from "../../types/adminDashboard";
import type { CampusIssue } from "../../types/campusIssue";

import { getRelatedReportCount } from "../../mocks/adminDashboard";
import { campusIssues } from "../../mocks/campusIssues";

interface ProblemSummaryCardProps {
  analysis?: IssueAnalysis;
  issueOverride?: CampusIssue;
}

const ProblemSummaryCard = ({
  analysis,
  issueOverride,
}: ProblemSummaryCardProps) => {
  const issue =
    issueOverride ??
    (analysis
      ? campusIssues.find((item) => item.id === analysis.issueId)
      : undefined);

  if (!issue) return null;

  const reportCount = analysis
    ? getRelatedReportCount(analysis.issueId)
    : issue.relatedReports;

  const trend = analysis?.trend ?? [
    {
      date: issue.dateLabel,
      count: 1,
    },
  ];

  const maxCount = Math.max(
    ...trend.map((item) => item.count),
    1,
  );

  return (
    <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-6 sm:px-6">
      {/* 문제 장소 */}
      <h2 className="break-keep text-[20px] font-bold text-black sm:text-[22px]">
        {issue.building} {issue.floor} {issue.space}
      </h2>

      {/* 문제 카테고리 */}
      <p className="mt-2 text-[13px] text-[#737373] sm:text-[14px]">
        {analysis ? issue.category : "분석 대기"}
      </p>

      {/* 점검 필요도 / 관련 제보 */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#F2F2F2] px-3 py-3">
          <p className="text-[12px] text-[#737373]">
            점검 필요도
          </p>

          <p
            className={`mt-1 text-[17px] font-bold ${
              analysis
                ? "text-[#A50000]"
                : "text-[#737373]"
            }`}
          >
            {analysis?.priority ?? "분석 대기"}
          </p>
        </div>

        <div className="rounded-xl bg-[#F2F2F2] px-3 py-3">
          <p className="text-[12px] text-[#737373]">
            관련 제보
          </p>

          <p className="mt-1 text-[17px] font-bold text-black">
            {reportCount}건
          </p>
        </div>
      </div>

      {/* 최근 3일 제보 추이 */}
      <div className="mt-6">
        <h3 className="mb-4 text-[14px] font-medium text-[#737373]">
          최근 3일 제보 추이
        </h3>

        <div
          className="flex h-[118px] items-end gap-3 sm:gap-5"
          role="img"
          aria-label={`최근 제보 추이: ${trend
            .map((item) => `${item.date} ${item.count}건`)
            .join(", ")}`}
        >
          {trend.map((item, index) => (
            <div
              key={item.date}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              {/* 제보 개수 */}
              <span className="mb-1 text-center text-[13px] font-semibold text-black">
                {item.count}건
              </span>

              {/* 그래프 */}
              <div
                className={`w-full rounded-lg ${
                  index === trend.length - 1
                    ? "bg-[#A50000]"
                    : "bg-[#D9D9D9]"
                }`}
                style={{
                  height: `${Math.max(
                    (item.count / maxCount) * 80,
                    6,
                  )}px`,
                }}
              />

              {/* 날짜 */}
              <span className="mt-2 text-center text-[12px] text-[#737373]">
                {item.date.slice(5).replace("-", ".")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSummaryCard;