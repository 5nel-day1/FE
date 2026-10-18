import { useNavigate } from "react-router-dom";

import ReportStatus from "../common/ReportStatus/ReportStatus";

import type { AdminIssueGroup } from "../../types/admin";
import type { CampusIssue } from "../../types/campusIssue";

interface AnomalyCardProps {
  group: AdminIssueGroup;
}

const STATUS_LABELS: Record<
  AdminIssueGroup["status"],
  CampusIssue["status"]
> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

const AnomalyCard = ({ group }: AnomalyCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/problems/${group.id}`)}
      className="w-full rounded-[22px] border border-[#D9D9D9] bg-white px-5 py-5 text-left transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#A50000]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#A50000]" />
            <span>점검 필요도 {group.urgencyScore}점</span>
          </div>

          <h3 className="break-keep text-[18px] font-bold text-black sm:text-[20px]">
            {group.title ||
              `${group.building} ${group.floor} ${group.facility}`}
          </h3>

          <p className="mt-3 text-[13px] text-[#737373] sm:text-[14px]">
            {group.problemType} · 심각도 {group.severity}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between self-stretch gap-4">
          <ReportStatus status={STATUS_LABELS[group.status]} />

          <span className="text-xs font-medium text-[#737373]">
            점검 필요도 {group.urgencyScore}점
          </span>
        </div>
      </div>
    </button>
  );
};

export default AnomalyCard;