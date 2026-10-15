import { useNavigate, useParams } from "react-router-dom";

import backButton from "../../assets/images/back_button.png";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";

import ProblemSummaryCard from "../../components/adminProblem/ProblemSummaryCard";
import SymptomCard from "../../components/adminProblem/SymptomCard";
import AnalysisInfoCard from "../../components/adminProblem/AnalysisInfoCard";
import RelatedReportReview from "../../components/adminProblem/RelatedReportReview";
import AdminStatusCard from "../../components/adminProblem/AdminStatusCard";

import { getIssueAnalysis } from "../../mocks/adminDashboard";
import { campusIssues } from "../../mocks/campusIssues";

import { useReportStore } from "../../stores/useReportStore";
import { useIssueStore } from "../../stores/useIssueStore";

import type { CampusIssue } from "../../types/campusIssue";

const AdminProblemDetail = () => {
  const navigate = useNavigate();

  // URL에서 문제 ID 또는 신규 제보 ID 가져오기
  const { problemId, reportId } = useParams<{
    problemId?: string;
    reportId?: string;
  }>();

  // 기존 문제 ID
  const issueId = Number(problemId);

  // 신규 제보 목록
  const submittedReports = useReportStore(
    (state) => state.reports,
  );

  // 관리자 처리 상태
  const storedIssues = useIssueStore(
    (state) => state.issues,
  );

  // 신규 제보 조회
  const submittedReport = reportId
    ? submittedReports.find(
        (report) => report.id === Number(reportId),
      )
    : undefined;

  // 기존 캠퍼스 문제 조회
  const issue = problemId
    ? campusIssues.find((item) => item.id === issueId)
    : undefined;

  // 기존 문제 AI 분석 데이터
  const analysis = problemId
    ? getIssueAnalysis(issueId)
    : undefined;

  // 신규 제보의 현재 처리 상태
  const submittedStatus = submittedReport
    ? submittedReport.issueId != null
      ? (storedIssues[submittedReport.issueId]?.status ??
        submittedReport.status)
      : (storedIssues[submittedReport.id]?.status ??
        submittedReport.status)
    : undefined;

  // 신규 제보를 CampusIssue 타입으로 변환
  const newIssue: CampusIssue | undefined = submittedReport
    ? {
        ...campusIssues[0],

        id: submittedReport.id,

        building: submittedReport.building,
        floor: submittedReport.floor,
        space: submittedReport.space,

        description: submittedReport.description,

        status: submittedStatus ?? submittedReport.status,

        relatedReports: 1,

        dateLabel: submittedReport.createdAt.slice(0, 10),

        likes: 0,
        comments: [],
      }
    : undefined;

  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F8FAF8]">
      <CommonHeader
        img={backButton}
        title="문제 상세"
      />

      <div className="w-full px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        {newIssue && submittedReport ? (
          // ----------------------------------------
          // 신규 제보 상세
          // ----------------------------------------
          <div className="space-y-4">
            {/* 문제 요약 */}
            <ProblemSummaryCard issueOverride={newIssue} />

            {/* 주요 증상 */}
            <SymptomCard symptoms={[]} />

            {/* AI 분석 정보 */}
            <AnalysisInfoCard issueOverride={newIssue} />

            {/* 관련 제보 */}
            <RelatedReportReview issueId={newIssue.id} />

            {/* 관리자 처리 상태 */}
            <AdminStatusCard issueId={newIssue.id} />
          </div>
        ) : !issue ? (
          // ----------------------------------------
          // 존재하지 않는 문제
          // ----------------------------------------
          <div className="rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-10 text-center">
            <p className="text-[15px] text-[#737373]">
              존재하지 않는 문제입니다.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="mt-4 cursor-pointer rounded-xl bg-[#3B8519] px-5 py-3 text-sm font-semibold text-white"
            >
              대시보드로 돌아가기
            </button>
          </div>
        ) : (
          // ----------------------------------------
          // 기존 캠퍼스 문제 상세
          // ----------------------------------------
          <div className="space-y-4">
            {analysis ? (
              <>
                {/* 문제 요약 */}
                <ProblemSummaryCard analysis={analysis} />

                {/* 주요 증상 */}
                <SymptomCard symptoms={analysis.symptoms} />

                {/* AI 분석 정보 */}
                <AnalysisInfoCard analysis={analysis} />
              </>
            ) : (
              <section className="rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-6">
                <h2 className="text-[20px] font-bold text-[#13213C]">
                  {issue.building} {issue.floor} {issue.space}
                </h2>

                <p className="mt-2 text-[14px] text-[#737373]">
                  {issue.category}
                </p>

                <p className="mt-4 text-[14px] text-[#737373]">
                  이 문제의 AI 분석 정보는 아직 등록되지
                  않았습니다.
                </p>
              </section>
            )}

            {/* 관련 제보 */}
            <RelatedReportReview issueId={issueId} />

            {/* 관리자 처리 상태 */}
            <AdminStatusCard issueId={issueId} />
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProblemDetail;