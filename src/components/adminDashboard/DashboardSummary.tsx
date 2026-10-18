import type { AdminIssueGroup } from "../../types/admin";

interface DashboardSummaryProps {
  groups: AdminIssueGroup[];
  isLoading?: boolean;
  error?: string;
}

const DashboardSummary = ({
  groups,
  isLoading = false,
  error = "",
}: DashboardSummaryProps) => {
  const summaryItems = [
    {
      label: "전체",
      count: groups.length,
      color: "#13213C",
    },
    {
      label: "확인 중",
      count: groups.filter((group) => group.status === "CHECKING").length,
      color: "#A67C52",
    },
    {
      label: "처리 중",
      count: groups.filter((group) => group.status === "IN_PROGRESS").length,
      color: "#2C6FB0",
    },
    {
      label: "해결 완료",
      count: groups.filter((group) => group.status === "RESOLVED").length,
      color: "#3B8519",
    },
  ];

  return (
    <section className="w-full">
      <h2 className="mb-4 text-[20px] font-bold text-[#13213C]">
        현황
      </h2>

      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-6 shadow-sm sm:gap-4 sm:px-6">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-col items-center justify-center gap-2"
          >
            <span
              className="text-[26px] font-bold sm:text-[30px]"
              style={{ color: item.color }}
            >
              {isLoading || error ? "-" : item.count}
            </span>

            <span className="whitespace-nowrap text-center text-[11px] font-medium text-[#6B7280] sm:text-[14px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardSummary;