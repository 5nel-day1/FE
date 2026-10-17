import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSummary from "../../components/adminDashboard/DashboardSummary";
import AnomalyCard from "../../components/adminDashboard/AnomalyCard";
import RecentReportList from "../../components/adminDashboard/RecentReportList";

import { issueAnalyses } from "../../mocks/adminDashboard";

import Header from "../../components/header/Header";

import { logoutUser } from "../../api/auth";
import { useIssueStore } from "../../stores/useIssueStore";
import { useAuthStore } from "../../stores/useAuthStore";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const issues = useIssueStore((state) => state.issues);
  const logout = useAuthStore((state) => state.logout);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 관리자 로그아웃
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await logoutUser();

      if (!response.success) {
        console.error("서버 로그아웃 실패:", response.message);
      }
    } catch (error) {
      console.error("서버 로그아웃 요청 실패:", error);
    } finally {
      // 서버 요청 결과와 관계없이 로컬 인증 정보 초기화
      logout();

      // 관리자 로그인 페이지로 이동
      navigate("/admin/login", { replace: true });
    }
  };

  // 점검 필요도가 높고 아직 해결되지 않은 문제만 표시
  const highPriorityAnalyses = issueAnalyses.filter(
    (analysis) =>
      analysis.priority === "높음" &&
      issues[analysis.issueId]?.status !== "해결 완료",
  );

  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F8FAF8]">
      {/* 관리자 헤더 */}
      <div className="relative w-full">
        <Header />

        {/* 로그아웃 버튼 */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            cursor-pointer
            rounded-md
            px-2
            py-1
            text-sm
            font-semibold
            text-[#3B8519]
            transition-colors
            hover:text-[#3B8519]
            disabled:cursor-not-allowed
            disabled:opacity-50
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#3B8519]
            sm:right-6
          "
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      {/* 대시보드 콘텐츠 */}
      <div className="w-full px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="space-y-9">
          {/* 제보 현황 */}
          <DashboardSummary />

          {/* AI 이상징후 */}
          <section aria-labelledby="anomaly-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                id="anomaly-heading"
                className="text-[20px] font-bold text-[#13213C]"
              >
                이상징후
              </h2>
            </div>

            {highPriorityAnalyses.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
                점검 필요도가 높은 이상징후가 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {highPriorityAnalyses.map((analysis) => (
                  <AnomalyCard
                    key={analysis.issueId}
                    analysis={analysis}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 최근 제보 */}
          <RecentReportList />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;