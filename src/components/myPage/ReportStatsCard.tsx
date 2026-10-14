import { myReports } from "../../mocks/myReport";

export default function ReportStatsCard() {
  // 전체 제보 개수
  const totalReports = myReports.length;

  // 해결 완료된 제보 개수
  const completedReports = myReports.filter(
    (report) => report.status === "해결 완료"
  ).length;

  return (
    <div className="flex w-full items-center rounded-2xl border border-[#D9D9D9] bg-white px-8 py-4">
      {/* 내 제보 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-3xl font-bold text-black">
          {totalReports}
        </span>

        <span className="text-base font-semibold text-[#737373]">
          내 제보
        </span>
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