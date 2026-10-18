import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import backButton from "../../assets/images/back_button.png";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import ProblemSummaryCard from "../../components/adminProblem/ProblemSummaryCard";
import SymptomCard from "../../components/adminProblem/SymptomCard";
import AnalysisInfoCard from "../../components/adminProblem/AnalysisInfoCard";
import RelatedReportReview from "../../components/adminProblem/RelatedReportReview";
import AdminStatusCard from "../../components/adminProblem/AdminStatusCard";

import { getIssueGroupDetail } from "../../api/issueGroups";

import type { IssueGroupDetail } from "../../types/issueGroup";

type ReportStatusCode =
  | "RECEIVED"
  | "CHECKING"
  | "IN_PROGRESS"
  | "RESOLVED";

interface RecentReport {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  status: ReportStatusCode;
  receiptNumber: string;
}

const AdminProblemDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { problemId, reportId } = useParams<{
    problemId?: string;
    reportId?: string;
  }>();

  const issueId = Number(problemId);

  // 최근 제보에서 전달받은 실제 데이터
  const recentReport = (
    location.state as {
      recentReport?: RecentReport;
    } | null
  )?.recentReport;

  // 실제 문제 그룹 상세 API
  const [groupDetail, setGroupDetail] =
    useState<IssueGroupDetail | null>(null);

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (
      !problemId ||
      !/^\d+$/.test(problemId) ||
      !Number.isSafeInteger(issueId) ||
      issueId <= 0
    ) {
      setGroupDetail(null);
      setIsLoadingDetail(false);
      setDetailError("");
      return;
    }

    let active = true;

    setGroupDetail(null);
    setIsLoadingDetail(true);
    setDetailError("");

    const fetchDetail = async () => {
      try {
        const response = await getIssueGroupDetail(issueId);

        if (!active) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "문제 상세 조회에 실패했습니다.",
          );
        }

        setGroupDetail(response.data);
      } catch (error) {
        if (!active) return;

        console.error("문제 그룹 상세 조회 실패:", error);

        setDetailError("문제 상세 정보를 불러오지 못했습니다.");
      } finally {
        if (active) {
          setIsLoadingDetail(false);
        }
      }
    };

    void fetchDetail();

    return () => {
      active = false;
    };
  }, [problemId, issueId]);

  // 현재 URL의 제보 ID와 전달받은 제보 ID 일치 여부 확인
  const isMatchingRecentReport =
    !!recentReport &&
    !!reportId &&
    /^\d+$/.test(reportId) &&
    recentReport.id === Number(reportId);

  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F8FAF8]">
      <CommonHeader img={backButton} title="문제 상세" />

      <div className="w-full px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        {problemId && isLoadingDetail ? (
          // API 로딩
          <div className="rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-10 text-center text-[15px] text-[#737373]">
            문제 상세 정보를 불러오는 중입니다.
          </div>
        ) : problemId && detailError ? (
          // API 오류
          <div
            role="alert"
            className="rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-10 text-center text-[15px] text-red-600"
          >
            {detailError}
          </div>
        ) : problemId && groupDetail ? (
          // 실제 API: AI 이상징후 문제 그룹 상세
          <div className="space-y-4">
            <ProblemSummaryCard groupDetail={groupDetail} />

            <SymptomCard
              symptoms={(groupDetail.reportContents ?? []).map(
                (content) => ({
                  label: content,
                }),
              )}
            />

            <AnalysisInfoCard groupDetail={groupDetail} />

            <RelatedReportReview
              issueId={groupDetail.id}
              reportContents={groupDetail.reportContents ?? []}
            />

            <AdminStatusCard
              issueId={groupDetail.id}
              serverStatus={groupDetail.status}
              onStatusChanged={(status) => {
                setGroupDetail((prev) =>
                  prev ? { ...prev, status } : prev,
                );
              }}
            />

            {groupDetail.status === "RESOLVED" && (
              <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
                <h2 className="text-[18px] font-bold text-[#13213C] sm:text-[20px]">
                  처리 결과
                </h2>

                <p className="mt-3 whitespace-pre-wrap break-keep text-[14px] leading-6 text-[#4B5563]">
                  {groupDetail.resolutionContent ||
                    "등록된 처리 결과가 없습니다."}
                </p>

                {groupDetail.resolvedAt && (
                  <p className="mt-2 text-[13px] text-[#737373]">
                    해결 일시:{" "}
                    {groupDetail.resolvedAt
                      .replace("T", " ")
                      .slice(0, 16)}
                  </p>
                )}
              </section>
            )}
          </div>
        ) : isMatchingRecentReport && recentReport ? (
          // 실제 서버에서 전달받은 최근 제보
          <div className="space-y-4">
            <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
              <h2 className="text-[18px] font-bold text-[#13213C] sm:text-[20px]">
                {recentReport.title}
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-keep text-[14px] leading-6 text-[#4B5563]">
                {recentReport.content}
              </p>

              <p className="mt-2 text-[13px] text-[#737373]">
                접수 일시:{" "}
                {recentReport.createdAt
                  .replace("T", " ")
                  .slice(0, 16)}
              </p>
            </section>

            <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
              <h2 className="text-[18px] font-bold text-[#13213C] sm:text-[20px]">
                처리 상태
              </h2>

              <p className="mt-3 text-[14px] text-[#4B5563]">
                {recentReport.status}
              </p>
            </section>
          </div>
        ) : (
          // 실제 데이터가 존재하지 않는 경우
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
        )}

        {problemId &&
          groupDetail &&
          groupDetail.status !== "RESOLVED" && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/problems/${groupDetail.id}/resolve`,
                )
              }
              className="mt-8 w-full rounded-[10px] bg-[#3B8519] px-4 py-4 text-center text-[15px] font-bold text-white transition-colors hover:bg-[#327315]"
            >
              처리 결과 등록
            </button>
          )}
      </div>
    </main>
  );
};

export default AdminProblemDetail;