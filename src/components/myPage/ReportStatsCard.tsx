interface ReportStatsCardProps {
  totalReports: number;
  solvedReports: number;
}

export default function ReportStatsCard({
  totalReports,
  solvedReports,
}: ReportStatsCardProps) {
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
          {solvedReports}
        </span>

        <span className="text-base font-semibold text-[#737373]">
          해결 완료
        </span>
      </div>
    </div>
  );
}