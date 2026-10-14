import { useNavigate, useParams } from "react-router-dom";
import ReportStatusTimeline from "../../components/myReport/ReportStatusTimeline";
import ReportResolutionCard from "../../components/myReport/ReportResolutionCard";
import { myReports } from "../../mocks/myReport";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

export default function MyReportDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const report = myReports.find((item) => String(item.id) === id);

  if (!report) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center gap-5 px-5 text-center">
        <h1 className="text-xl font-bold text-[#13213C]">
          제보를 찾을 수 없습니다.
        </h1>

        <button
          type="button"
          onClick={() => navigate("/student/my-reports")}
          className="rounded-xl bg-[#3B8519] px-5 py-3 text-sm font-semibold text-white"
        >
          내 제보로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9F7]">
      <CommonHeader title="제보 상세" img={backButton} />
      <div className="w-full px-5 py-5">
        {/* 제보 정보 */}
        <section className="mb-5 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#13213C]">제보 정보</h2>
          </div>

          <dl className="grid grid-cols-[84px_minmax(0,1fr)] gap-x-4 gap-y-4 text-sm sm:grid-cols-[110px_minmax(0,1fr)] sm:text-base">
            <dt className="text-[#6B7280]">접수번호</dt>
            <dd className="break-words font-medium text-[#13213C]">
              {`SKU${String(report.id).padStart(4, "0")}`}
            </dd>

            <dt className="text-[#6B7280]">접수 일시</dt>
            <dd className="break-words text-[#13213C]">
              {report.createdAt.replace("T", " ")}
            </dd>

            <dt className="text-[#6B7280]">장소</dt>
            <dd className="break-words text-[#13213C]">
              {[report.building, report.floor, report.space]
                .filter(Boolean)
                .join(" ")}
            </dd>

            <dt className="text-[#6B7280]">문제 내용</dt>
            <dd className="whitespace-pre-wrap break-words leading-7 text-[#13213C]">
              {report.description}
            </dd>
          </dl>
        </section>

        {/* 처리 상태 타임라인 */}
        <div className="mb-5">
          <ReportStatusTimeline status={report.status} />
        </div>

        {/* 해결 완료 시 처리 결과 표시 */}
        {report.status === "해결 완료" && (
          <ReportResolutionCard
            resolution={report.resolution}
            resolvedAt={report.resolvedAt}
          />
        )}
      </div>
    </main>
  );
}
