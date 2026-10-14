import type { ReportStatus as ReportStatusType } from "../../types/report";
import ReportProcessBar from "./ReportProcessBar";
import ReportStatus from "../common/ReportStatus/ReportStatus";

interface MyReportCardProps {
  building: string;
  floor: string;
  space: string;
  content: string;
  status: ReportStatusType;
  createdAt: string;
  onClick?: () => void;
}

export default function MyReportCard({
  building,
  floor,
  space,
  content,
  status,
  createdAt,
  onClick,
}: MyReportCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded-xl border border-[#D9D9D9] bg-white p-4 text-left transition-shadow hover:shadow-sm sm:p-5"
    >
      {/* 장소 및 상태 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words text-base font-bold text-[#111827]">
          {building} {floor} {space}
        </h3>

        <ReportStatus status={status} />
      </div>

      {/* 문제 내용 */}
      <p className="mt-1 line-clamp-2 text-sm text-[#374151]">
        “{content}”
      </p>

      {/* 처리 진행 바 */}
      <ReportProcessBar status={status} className="mt-5" />

      {/* 접수 일시 */}
      <p className="mt-2 text-xs text-[#9CA3AF]">
        {createdAt.replace("T", " ")} 접수
      </p>
    </button>
  );
}