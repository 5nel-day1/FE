import type { IssueAnalysis } from "../../types/adminDashboard";
import type { CampusIssue } from "../../types/campusIssue";

import { campusIssues } from "../../mocks/campusIssues";

interface AnalysisInfoCardProps {
  analysis?: IssueAnalysis;
  issueOverride?: CampusIssue;
}

const AnalysisInfoCard = ({
  analysis,
  issueOverride,
}: AnalysisInfoCardProps) => {
  const issue =
    issueOverride ??
    (analysis
      ? campusIssues.find((item) => item.id === analysis.issueId)
      : undefined);

  if (!issue) return null;

  const infoItems = [
    {
      label: "장소",
      value: `${issue.building} ${issue.floor} ${issue.space}`,
    },
    {
      label: "시설",
      value: issue.space,
    },
    {
      label: "카테고리",
      value: analysis ? issue.category : "분석 대기",
    },
    {
      label: "심각도",
      value: analysis?.severity ?? "분석 대기",
    },
  ];

  return (
    <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
      {/* 제목 */}
      <h2 className="text-[18px] font-bold text-[#13213C] sm:text-[20px]">
        AI 분석 정보
      </h2>

      {/* AI 분석 요약 */}
      <p className="mt-3 break-keep text-[14px] leading-6 text-[#4B5563]">
        {analysis?.aiSummary ??
          "신규 접수된 제보로, AI 분석을 기다리고 있습니다."}
      </p>

      {/* 분석 정보 */}
      <dl className="mt-5 divide-y divide-[#EEEEEE] border-t border-[#EEEEEE]">
        {infoItems.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-start gap-4 py-3"
          >
            <dt className="w-[76px] shrink-0 text-[13px] font-medium text-[#737373] sm:w-[90px] sm:text-[14px]">
              {label}
            </dt>

            <dd
              className={`min-w-0 flex-1 break-keep text-[13px] font-semibold sm:text-[14px] ${
                label === "심각도" && value === "높음"
                  ? "text-[#A50000]"
                  : "text-[#13213C]"
              }`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default AnalysisInfoCard;