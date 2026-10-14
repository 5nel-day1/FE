interface ReportResolutionCardProps {
  resolution?: string;
  resolvedAt?: string;
}

export default function ReportResolutionCard({
  resolution,
  resolvedAt,
}: ReportResolutionCardProps) {
  return (
    <section className="w-full rounded-2xl border border-[#DCEBD5] bg-[#F4F9F1] p-5 sm:p-6">
      {/* 처리 완료 제목 */}
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B8519] text-sm font-bold text-white"
        >
          ✓
        </span>

        <h2 className="text-base font-bold text-[#3B8519] sm:text-lg">
          처리 완료
        </h2>
      </div>
      {/* 처리 결과 */}
      {resolution?.trim() && (
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#374151] sm:text-base">
          {resolution}
        </p>
      )}
      {/* 처리 완료일 */}
      {resolvedAt && (
        <p className="mt-4 text-xs text-[#6B7280] sm:text-sm">
          처리 완료일: {resolvedAt}
        </p>
      )}
    </section>
  );
}
