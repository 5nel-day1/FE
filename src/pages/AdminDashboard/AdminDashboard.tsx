import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSummary from "../../components/adminDashboard/DashboardSummary";
import AnomalyCard from "../../components/adminDashboard/AnomalyCard";
import RecentReportList from "../../components/adminDashboard/RecentReportList";
import Header from "../../components/header/Header";

import { logoutUser } from "../../api/auth";
import { getAdminIssueGroups } from "../../api/admin";
import { getIssueGroups } from "../../api/issueGroups";
import { useAuthStore } from "../../stores/useAuthStore";

import type { AdminIssueGroup } from "../../types/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 관리자 점검 필요도순 이슈 목록
  const [issueGroups, setIssueGroups] = useState<AdminIssueGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState("");

  // 전체 이슈 그룹 목록
  const [allIssueGroups, setAllIssueGroups] = useState<AdminIssueGroup[]>([]);
  const [isLoadingAllGroups, setIsLoadingAllGroups] = useState(true);
  const [allGroupsError, setAllGroupsError] = useState("");

  // 점검 필요도순 이슈 목록 조회
  useEffect(() => {
    let active = true;

    const fetchIssueGroups = async () => {
      try {
        const response = await getAdminIssueGroups();

        if (!active) return;

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "문제 그룹 조회에 실패했습니다.",
          );
        }

        setIssueGroups(response.data);
        setGroupsError("");
      } catch (error) {
        if (!active) return;

        console.error("관리자 문제 그룹 조회 실패:", error);
        setGroupsError("문제 그룹을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoadingGroups(false);
      }
    };

    void fetchIssueGroups();

    return () => {
      active = false;
    };
  }, []);

  // 전체 이슈 그룹 목록 조회
  useEffect(() => {
    let active = true;

    const fetchAllGroups = async () => {
      try {
        const response = await getIssueGroups();

        if (!active) return;

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "전체 문제 현황 조회에 실패했습니다.",
          );
        }

        setAllIssueGroups(response.data);
        setAllGroupsError("");
      } catch (error) {
        if (!active) return;

        console.error("전체 문제 현황 조회 실패:", error);
        setAllGroupsError("전체 문제 현황을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoadingAllGroups(false);
      }
    };

    void fetchAllGroups();

    return () => {
      active = false;
    };
  }, []);

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
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  // 동일한 문제 그룹 중복 표시 방지
  const normalizeTitle = (title: string) =>
    title.replace(/\s+/g, "").toLowerCase();

  // 해결 완료된 문제는 이상징후 목록에서 제외
  const activeIssueGroups = issueGroups.filter(
    (group) => group.status !== "RESOLVED",
  );

  // 실제 문제 그룹 목록에 존재하는 문제만 표시
  const validIssueGroups = activeIssueGroups.filter((group) =>
    allIssueGroups.some((item) => item.id === group.id),
  );

  // 같은 제목의 문제가 여러 개라면 하나만 표시
  // 실제 문제 그룹 목록에 존재하는 ID를 우선 사용
  const uniqueIssueGroups = validIssueGroups.reduce<AdminIssueGroup[]>(
    (acc, group) => {
      const normalizedTitle = normalizeTitle(group.title);

      const existingIndex = acc.findIndex(
        (item) => normalizeTitle(item.title) === normalizedTitle,
      );

      if (existingIndex === -1) {
        acc.push(group);
      } else {
        const existingGroup = acc[existingIndex];

        // 동일한 문제라면 더 높은 점검 필요도 점수를 가진 그룹 유지
        if (group.urgencyScore > existingGroup.urgencyScore) {
          acc[existingIndex] = group;
        }
      }

      return acc;
    },
    [],
  );

  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F8FAF8]">
      <div className="relative w-full">
        <Header />

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-[#3B8519] transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:right-6"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      <div className="w-full px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="space-y-9">
          {/* 전체 문제 현황 */}
          <DashboardSummary
            groups={allIssueGroups}
            isLoading={isLoadingAllGroups}
            error={allGroupsError}
          />

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

            {isLoadingGroups || isLoadingAllGroups ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
                점검 필요 문제를 불러오는 중입니다.
              </div>
            ) : groupsError || allGroupsError ? (
              <div
                role="alert"
                className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-red-600"
              >
                {groupsError || allGroupsError}
              </div>
            ) : uniqueIssueGroups.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
                점검이 필요한 이상징후가 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {uniqueIssueGroups.map((group) => (
                  <AnomalyCard key={group.id} group={group} />
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