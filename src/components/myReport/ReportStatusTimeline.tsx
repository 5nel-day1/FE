import type { ReportStatus } from "../../types/report";

interface ReportStatusTimelineProps {
  status: ReportStatus;
}

const STEPS: { status: ReportStatus; description: string }[] = [
  { status: "접수", description: "제보가 등록되었습니다." },
  { status: "확인 중", description: "담당자가 제보 내용을 확인하고 있습니다." },
  { status: "처리 중", description: "문제 해결을 위한 조치를 진행하고 있습니다." },
  { status: "해결 완료", description: "제보 처리가 완료되었습니다." },
];

export default function ReportStatusTimeline({
  status,
}: ReportStatusTimelineProps) {
  const currentIndex = STEPS.findIndex(
    (step) => step.status === status
  );

  return (
    <section className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-5 py-6 sm:px-7">
      <h2 className="mb-7 text-lg font-bold text-[#13213C]">
        처리 진행 상황
      </h2>

      <ol className="space-y-0">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isActive = index <= currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.status}
              className="relative flex min-h-[88px] gap-4 last:min-h-0"
            >
              {/* 상태 아이콘 및 연결선 */}
              <div className="relative flex w-7 shrink-0 flex-col items-center">
                <div
                  aria-hidden="true"
                  className={`z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isComplete
                      ? "border-[#3B8519] bg-[#3B8519] text-white"
                      : isCurrent
                        ? "border-[#3B8519] bg-white text-[#3B8519]"
                        : "border-[#D1D5DB] bg-white text-[#9CA3AF]"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`absolute top-7 bottom-0 w-0.5 ${
                      index < currentIndex
                        ? "bg-[#3B8519]"
                        : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
              </div>

              {/* 상태 설명 */}
              <div className="min-w-0 pb-7">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm font-bold sm:text-base ${
                      isActive
                        ? "text-[#13213C]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {step.status}
                  </p>

                  {isCurrent && (
                    <span className="rounded-full bg-[#E9F3E4] px-2.5 py-0.5 text-xs font-semibold text-[#3B8519]">
                      현재 상태
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    isActive
                      ? "text-[#6B7280]"
                      : "text-[#B0B6BF]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}