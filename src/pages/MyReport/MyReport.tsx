import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MyReportCard from "../../components/myReport/MyReportCard";
import Footer from "../../components/footer/Footer";
import { getMyReports } from "../../api/reports";

import type {
  ReportApiStatus,
  ReportListItem,
  ReportStatus,
} from "../../types/report";

// 백엔드 상태 → 화면 상태 변환
const STATUS_LABELS: Record<ReportApiStatus, ReportStatus> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

export default function MyReport() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // 내 제보 목록 조회
  useEffect(() => {
    let active = true;

    const fetchMyReports = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMyReports();

        if (!active) return;

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "내 제보 목록을 불러오지 못했습니다.",
          );
        }

        // 최신순 정렬
        setReports(
          [...response.data].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt),
          ),
        );
      } catch (caughtError: unknown) {
        if (!active) return;

        setReports([]);

        const apiMessage = axios.isAxiosError(caughtError)
          ? caughtError.response?.data?.message
          : undefined;

        setError(
          typeof apiMessage === "string" && apiMessage.trim()
            ? apiMessage
            : caughtError instanceof Error
              ? caughtError.message
              : "내 제보 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchMyReports();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <div className="min-h-screen bg-[#F8F9F7] pb-[73px]">
      <main className="w-full px-5 py-8 sm:px-8 sm:py-10">
        {/* 페이지 제목 */}
        <div className="mb-7 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#111827]">내 제보</h1>

          <span className="text-sm text-[#6B7280]">
            {isLoading ? "조회 중..." : `총 ${reports.length}건`}
          </span>
        </div>

        {/* 제보 목록 */}
        {isLoading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-16 text-center">
            <p className="text-sm text-[#6B7280]">
              내 제보를 불러오는 중입니다.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-16 text-center">
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-5 cursor-pointer rounded-xl bg-[#3B8519] px-6 py-3 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-16 text-center">
            <p className="text-sm text-[#6B7280]">
              아직 등록한 제보가 없습니다.
            </p>

            <button
              type="button"
              onClick={() => navigate("/student/report")}
              className="mt-5 cursor-pointer rounded-xl bg-[#3B8519] px-6 py-3 text-sm font-semibold text-white"
            >
              제보하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((report) => (
              <MyReportCard
                key={report.id}
                building=""
                floor=""
                space={report.title}
                content={report.content}
                status={STATUS_LABELS[report.status] ?? "접수"}
                createdAt={report.createdAt}
                onClick={() => navigate(`/my-report/${report.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Footer />
      </div>
    </div>
  );
}
