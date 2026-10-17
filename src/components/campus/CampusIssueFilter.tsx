import type { ReportStatus } from "../../types/report";
import type { CampusIssue } from "../../types/campusIssue";

export type IssueFilter = "전체" | ReportStatus;

interface CampusIssueFilterProps {
  issues: CampusIssue[];
  selectedFilter: IssueFilter;
  onFilterChange: (filter: IssueFilter) => void;
}

const filters: IssueFilter[] = [
  "전체",
  "접수",
  "확인 중",
  "처리 중",
  "해결 완료",
];

export default function CampusIssueFilter({
  issues,
  selectedFilter,
  onFilterChange,
}: CampusIssueFilterProps) {
  return (
    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full items-center gap-2 py-1">
        {filters.map((filter) => {
          const count =
            filter === "전체"
              ? issues.length
              : issues.filter((issue) => issue.status === filter).length;

          const isSelected = selectedFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              aria-pressed={isSelected}
              className={`
                flex shrink-0 items-center justify-center
                gap-1 whitespace-nowrap
                rounded-full border
                px-4 py-2
                text-xs font-medium
                sm:text-sm
                transition-colors
                cursor-pointer
                ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-[#D9D9D9] bg-white text-black"
                }
              `}
            >
              <span>{filter}</span>
              <span>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}