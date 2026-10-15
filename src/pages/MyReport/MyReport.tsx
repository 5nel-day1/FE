import { useNavigate } from "react-router-dom";

import MyReportCard from "../../components/myReport/MyReportCard";
import Footer from "../../components/footer/Footer";

import { myReports } from "../../mocks/myReport";
import { useReportStore } from "../../stores/useReportStore";
import { useIssueStore } from "../../stores/useIssueStore";

export default function MyReport() {
  const navigate = useNavigate();

  // 학생이 새로 등록한 제보
  const submittedReports = useReportStore((state) => state.reports);

  // 관리자에서 변경한 문제 상태
  const issues = useIssueStore((state) => state.issues);

  // 기존 목업 데이터 + 새로 등록한 제보
  const allReports = [
    // 새로 등록한 제보
    ...submittedReports.map((report) => ({
      ...report,
      sourceKey: `submitted-${report.id}`,
      detailId: report.id,

      // 관리자 처리 상태 우선 적용
      status:
        issues[report.issueId ?? report.id]?.status ??
        report.status,
    })),

    // 기존 목업 제보
    ...myReports.map((report) => ({
      ...report,
      sourceKey: `mock-${report.id}`,
      detailId: report.id,

      // 기존 목업도 관리자 처리 상태 반영
      status:
        issues[report.issueId ?? report.id]?.status ??
        report.status,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="min-h-screen bg-[#F8F9F7] pb-[73px]">
      <main className="w-full px-5 py-8 sm:px-8 sm:py-10">
        {/* 페이지 제목 */}
        <div className="mb-7 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#111827]">
            내 제보
          </h1>

          <span className="text-sm text-[#6B7280]">
            총 {allReports.length}건
          </span>
        </div>

        {/* 제보 목록 */}
        {allReports.length === 0 ? (
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
            {allReports.map((report) => (
              <MyReportCard
                key={report.sourceKey}
                building={report.building}
                floor={report.floor}
                space={report.space}
                content={report.description}
                status={report.status}
                createdAt={report.createdAt}
                onClick={() =>
                  navigate(`/my-report/${report.detailId}`, {
                    state: {
                      submittedReport: report.sourceKey.startsWith(
                        "submitted-",
                      )
                        ? report
                        : undefined,
                    },
                  })
                }
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