import type { ReportStatus } from "../../types/report";

interface ReportProcessBarProps {
  status: ReportStatus;
  className?: string;
}

const STATUS_STEPS: ReportStatus[] = [
  "접수",
  "확인 중",
  "처리 중",
  "해결 완료",
];

export default function ReportProcessBar({
  status,
  className = "",
}: ReportProcessBarProps) {
  const currentStep = STATUS_STEPS.indexOf(status) + 1;

  return (
    <div
      role="img"
      aria-label={`처리 진행 상태: ${status}, 총 4단계 중 ${currentStep}단계`}
      className={`flex w-full gap-2 ${className}`}
    >
      {STATUS_STEPS.map((step, index) => (
        <span
          key={step}
          aria-hidden="true"
          className={`h-1.5 min-w-0 flex-1 rounded-full ${
            index < currentStep
              ? "bg-[#3B8519]"
              : "bg-[#D9D9D9]"
          }`}
        />
      ))}
    </div>
  );
}