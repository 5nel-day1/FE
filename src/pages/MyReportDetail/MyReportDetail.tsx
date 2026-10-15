import { useLocation, useNavigate, useParams } from "react-router-dom";

import ReportStatusTimeline from "../../components/myReport/ReportStatusTimeline";
import ReportResolutionCard from "../../components/myReport/ReportResolutionCard";

import { myReports } from "../../mocks/myReport";
import { useReportStore } from "../../stores/useReportStore";
import { useIssueStore } from "../../stores/useIssueStore";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

// 접수 일시 형식 변환
const formatDateTime = (value: string) => {
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
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // 새로 등록한 제보
  const submittedReports = useReportStore((state) => state.reports);

  // 관리자에서 변경한 문제 상태
  const issues = useIssueStore((state) => state.issues);

  // 신규 제보 조회
  const submittedReport = submittedReports.find(
    (item) => String(item.id) === id,
  );

  // 기존 목업 제보 조회
  const mockReport = myReports.find(
    (item) => String(item.id) === id,
  );

  // 목록 페이지에서 전달받은 데이터 확인
  const isSubmittedFromList = Boolean(
    (location.state as { submittedReport?: unknown } | null)
      ?.submittedReport,
  );

  const preferMock =
    new URLSearchParams(location.search).get("source") === "mock";

  // 신규 제보 우선 조회, 기존 목업 데이터도 지원
  const report =
    preferMock && !isSubmittedFromList
      ? (mockReport ?? submittedReport)
      : (submittedReport ?? mockReport);

  // 제보를 찾을 수 없는 경우
  if (!report) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center gap-5 px-5 text-center">
        <h1 className="text-xl font-bold text-[#13213C]">
          제보를 찾을 수 없습니다.
        </h1>

        <button
          type="button"
          onClick={() => navigate("/my-report")}
          className="rounded-xl bg-[#3B8519] px-5 py-3 text-sm font-semibold text-white"
        >
          내 제보로 돌아가기
        </button>
      </main>
    );
  }

  // 연결된 문제 ID
  // 신규 제보는 issueId가 없으면 report.id 사용
  const issueId =
    "issueId" in report
      ? (report.issueId ?? report.id)
      : report.id;

  // 관리자에서 저장한 최신 문제 정보
  const linkedIssue = issues[issueId];

  // 현재 처리 상태
  const status = linkedIssue?.status ?? report.status;

  // 해결 완료 시 처리 결과
  const resolution =
    linkedIssue?.resolution ??
    ("resolution" in report ? report.resolution : undefined);

  const resolvedAt =
    linkedIssue?.resolvedAt ??
    ("resolvedAt" in report ? report.resolvedAt : undefined);

  // 접수번호
  const receiptNumber =
    "receiptNumber" in report
      ? report.receiptNumber
      : `SKU${String(report.id).padStart(4, "0")}`;

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      <CommonHeader title="제보 상세" img={backButton} />

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
            <dt className="text-[#6B7280]">접수번호</dt>
            <dd className="break-words font-medium text-[#13213C]">
              {receiptNumber}
            </dd>

            {/* 접수 일시 */}
            <dt className="text-[#6B7280]">접수 일시</dt>
            <dd className="break-words text-[#13213C]">
              {formatDateTime(report.createdAt)}
            </dd>

            {/* 장소 */}
            <dt className="text-[#6B7280]">장소</dt>
            <dd className="break-words text-[#13213C]">
              {[report.building, report.floor, report.space]
                .filter(Boolean)
                .join(" ")}
            </dd>

            {/* 문제 내용 */}
            <dt className="text-[#6B7280]">문제 내용</dt>
            <dd className="whitespace-pre-wrap break-words leading-7 text-[#13213C]">
              {report.description}
            </dd>
          </dl>
        </section>

        {/* 처리 상태 타임라인 */}
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