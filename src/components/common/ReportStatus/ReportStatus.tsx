import type { ReportStatus as ReportStatusType } from "../../../types/report";

interface ReportStatusProps {
  status: ReportStatusType;
}

const statusStyles: Record<ReportStatusType, string> = {
  "접수": "bg-[#6B7280]/[0.13] text-[#6B7280]",
  "확인 중": "bg-[#A16207]/[0.13] text-[#A16207]",
  "처리 중": "bg-[#2458C6]/[0.13] text-[#2458C6]",
  "해결 완료": "bg-[#3B8519]/[0.13] text-[#3B8519]",
};

export default function ReportStatus({ status }: ReportStatusProps) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-[5px] text-xs font-semibold sm:text-sm ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}