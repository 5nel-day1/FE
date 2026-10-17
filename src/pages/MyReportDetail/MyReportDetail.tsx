import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ReportStatusTimeline from "../../components/myReport/ReportStatusTimeline";
import ReportResolutionCard from "../../components/myReport/ReportResolutionCard";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

import { getReportDetail } from "../../api/reports";

import type {
  ReportApiStatus,
  ReportListItem,
} from "../../types/report";

import type { CampusIssue } from "../../types/campusIssue";

// 백엔드 상태 → 화면 상태 변환
const STATUS_LABELS: Record<
  ReportApiStatus,
  CampusIssue["status"]
> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

// 접수 일시 형식 변환
const formatDateTime = (value: string) => {
  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/,
  );

  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ");
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export default function MyReportDetail() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  // 서버에서 조회한 제보 상세 데이터
  const [report, setReport] = useState<ReportListItem | null>(
    null,
  );

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 에러 메시지
  const [error, setError] = useState("");

  // 제보 상세 조회 API
  useEffect(() => {
    let active = true;

    const numericId = Number(id);

    // 잘못된 제보 ID 검사
    if (
      !id ||
      !Number.isSafeInteger(numericId) ||
      numericId <= 0
    ) {
      setReport(null);
      setError("올바르지 않은 제보 번호입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setReport(null);

    const fetchReport = async () => {
      try {
        const response = await getReportDetail(numericId);

        if (!active) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "제보 상세 조회에 실패했습니다.",
          );
        }

        // 서버 데이터 저장
        setReport(response.data);
      } catch (caughtError: unknown) {
        if (!active) return;

        const apiMessage = axios.isAxiosError(caughtError)
          ? (
              caughtError.response?.data as
                | { message?: string }
                | undefined
            )?.message
          : undefined;

        setError(
          typeof apiMessage === "string" &&
            apiMessage.trim()
            ? apiMessage
            : caughtError instanceof Error
              ? caughtError.message
              : "제보 상세 정보를 불러오지 못했습니다.",
        );

        setReport(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchReport();

    return () => {
      active = false;
    };
  }, [id]);

  // 로딩 중 또는 조회 실패
  if (isLoading || !report) {
    return (
      <main className="min-h-screen bg-[#F8F9F7]">
        <CommonHeader
          title="제보 상세"
          img={backButton}
        />

        <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-5 text-center">
          <p className="text-sm text-[#6B7280]">
            {isLoading
              ? "제보 상세 정보를 불러오는 중입니다."
              : error || "제보를 찾을 수 없습니다."}
          </p>

          {!isLoading && (
            <button
              type="button"
              onClick={() => navigate("/my-report")}
              className="rounded-xl bg-[#3B8519] px-5 py-3 text-sm font-semibold text-white"
            >
              내 제보로 돌아가기
            </button>
          )}
        </div>
      </main>
    );
  }

  // 백엔드 상태를 화면 상태로 변환
  const status = STATUS_LABELS[report.status];

  // 해결 완료 시 처리 결과
  const resolution = report.resolveContent;

  // 해결 일시
  const resolvedAt = report.resolvedAt
    ? formatDateTime(report.resolvedAt)
    : undefined;

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      {/* 헤더 */}
      <CommonHeader
        title="제보 상세"
        img={backButton}
      />

      <div className="w-full px-5 py-5">
        {/* 제보 정보 */}
        <section className="mb-5 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#13213C]">
              제보 정보
            </h2>
          </div>

          <dl className="grid grid-cols-[84px_minmax(0,1fr)] gap-x-4 gap-y-4 text-sm sm:grid-cols-[110px_minmax(0,1fr)] sm:text-base">
            {/* 접수번호 */}
            <dt className="text-[#6B7280]">
              접수번호
            </dt>

            <dd className="break-words font-medium text-[#13213C]">
              {report.receiptNumber}
            </dd>

            {/* 접수 일시 */}
            <dt className="text-[#6B7280]">
              접수 일시
            </dt>

            <dd className="break-words text-[#13213C]">
              {formatDateTime(report.createdAt)}
            </dd>

            {/* 장소 */}
            <dt className="text-[#6B7280]">
              장소
            </dt>

            <dd className="break-words text-[#13213C]">
              {report.title}
            </dd>

            {/* 문제 내용 */}
            <dt className="text-[#6B7280]">
              문제 내용
            </dt>

            <dd className="whitespace-pre-wrap break-words leading-7 text-[#13213C]">
              {report.content}
            </dd>
          </dl>
        </section>

        {/* 처리 진행 상황 */}
        <div className="mb-5">
          <ReportStatusTimeline status={status} />
        </div>

        {/* 해결 완료 시 처리 결과 */}
        {status === "해결 완료" && resolution && (
          <ReportResolutionCard
            resolution={resolution}
            resolvedAt={resolvedAt}
          />
        )}
      </div>
    </main>
  );
}