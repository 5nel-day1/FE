import DashboardSummary from "../../components/adminDashboard/DashboardSummary";
import AnomalyCard from "../../components/adminDashboard/AnomalyCard";
import RecentReportList from "../../components/adminDashboard/RecentReportList";
import { issueAnalyses } from "../../mocks/adminDashboard";
import Header from "../../components/header/Header";
import { useIssueStore } from "../../stores/useIssueStore";

const AdminDashboard = () => {
  // Zustand에서 현재 문제 상태 가져오기
  const issues = useIssueStore((state) => state.issues);

  // 점검 필요도가 높고 아직 해결되지 않은 문제만 표시
  const highPriorityAnalyses = issueAnalyses.filter(
    (analysis) =>
      analysis.priority === "높음" &&
      issues[analysis.issueId]?.status !== "해결 완료",
  );

  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F8FAF8]">
      <Header />

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