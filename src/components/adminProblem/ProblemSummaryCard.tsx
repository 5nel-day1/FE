import type { IssueAnalysis } from "../../types/adminDashboard";
import type { CampusIssue } from "../../types/campusIssue";
import type { IssueGroupDetail } from "../../types/issueGroup";

import { getRelatedReportCount } from "../../mocks/adminDashboard";
import { campusIssues } from "../../mocks/campusIssues";

interface ProblemSummaryCardProps {
  analysis?: IssueAnalysis;
  issueOverride?: CampusIssue;
  groupDetail?: IssueGroupDetail;
}

const ProblemSummaryCard = ({
  analysis,
  issueOverride,
  groupDetail,
}: ProblemSummaryCardProps) => {
  // 실제 API 데이터
  if (groupDetail) {
    console.log("문제 그룹 상세 데이터:", groupDetail);
    console.log("최근 3일 제보 추이:", groupDetail.reportTrend);

    const trend = groupDetail.reportTrend ?? [];

    const maxCount = Math.max(
      ...trend.map((item) => item.count),
      1,
    );

    return (
      <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-6 sm:px-6">
        {/* 문제 장소 */}
        <h2 className="break-keep text-[20px] font-bold text-black sm:text-[22px]">
          {groupDetail.title}
        </h2>

        {/* 문제 카테고리 */}
        <p className="mt-2 text-[13px] text-[#737373] sm:text-[14px]">
          {groupDetail.problemType}
        </p>

        {/* 점검 필요도 / 관련 제보 */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F2F2F2] px-3 py-3">
            <p className="text-[12px] text-[#737373]">
              점검 필요도
            </p>

            <p className="mt-1 text-[17px] font-bold text-[#A50000]">
              {groupDetail.urgencyScore}점
            </p>
          </div>

          <div className="rounded-xl bg-[#F2F2F2] px-3 py-3">
            <p className="text-[12px] text-[#737373]">
              관련 제보
            </p>

            <p className="mt-1 text-[17px] font-bold text-black">
              {groupDetail.reportContents?.length ?? 0}건
            </p>
          </div>
        </div>

        {/* 최근 3일 제보 추이 */}
        <div className="mt-6">
          <h3 className="mb-3 text-[14px] font-medium text-[#737373]">
            최근 3일 제보 추이
          </h3>

          {trend.length > 0 ? (
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
                  <span className="mb-1 text-center text-[13px] font-semibold text-black">
                    {item.count}건
                  </span>

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

                  <span className="mt-2 text-center text-[12px] text-[#737373]">
                    {item.date.slice(5).replace("-", ".")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-[#F8F8F8] px-4 py-6 text-center text-[13px] text-[#737373]">
              날짜별 제보 데이터가 제공되지 않습니다.
            </p>
          )}
        </div>
      </section>
    );
  }

  // 기존 목업 데이터 처리
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

          <p className="mt-1 text-[17px] font-bold text-[#A50000]">
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
              <span className="mb-1 text-center text-[13px] font-semibold text-black">
                {item.count}건
              </span>

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