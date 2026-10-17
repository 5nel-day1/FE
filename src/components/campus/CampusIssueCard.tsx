import type { CampusIssue } from "../../types/campusIssue";
import ReportStatus from "../common/ReportStatus/ReportStatus";

interface CampusIssueCardProps {
  issue: CampusIssue & { commentCount?: number };
  onClick?: (id: number) => void;
}

export default function CampusIssueCard({
  issue,
  onClick,
}: CampusIssueCardProps) {
  return (
    <article
      onClick={() => onClick?.(issue.id)}
      className={`
        w-full rounded-[20px] border border-[#D9D9D9]
        bg-white p-4 sm:p-5 lg:p-6
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* 장소 + 처리 상태 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-base font-bold text-black sm:text-lg lg:text-xl">
          {issue.building} {issue.floor} {issue.space}
        </h3>

        <ReportStatus status={issue.status} />
      </div>

      {/* 문제 요약 */}
      <p className="mt-3 text-sm font-medium text-[#555555] sm:text-base lg:text-lg">
        {issue.description}
      </p>

      {/* 관련 제보 정보 + 공감 및 댓글 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-[#999999] sm:text-sm">
        <p>
          {issue.category} · 관련 제보 {issue.relatedReports}건 ·{" "}
          {issue.dateLabel}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span>공감 {issue.likes}</span>
          <span>댓글 {issue.commentCount ?? issue.comments.length}</span>
        </div>
      </div>
    </article>
  );
}