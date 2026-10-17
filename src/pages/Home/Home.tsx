import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyReports, getReports } from "../../api/reports";
import { getComments } from "../../api/comments";

import type { ReportListItem, ReportApiStatus } from "../../types/report";
import type { CampusIssue } from "../../types/campusIssue";

import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Button from "../../components/common/button/Button";
import ReportStatus from "../../components/common/ReportStatus/ReportStatus";

import CampusIssueFilter, {
  type IssueFilter,
} from "../../components/campus/CampusIssueFilter";
import CampusIssueCard from "../../components/campus/CampusIssueCard";

// API 상태 → 화면 상태 변환
const STATUS_LABELS: Record<ReportApiStatus, CampusIssue["status"]> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

export default function Home() {
  const navigate = useNavigate();

  // 캠퍼스 문제 현황 필터
  const [selectedFilter, setSelectedFilter] = useState<IssueFilter>("전체");

  // 전체 제보 목록
  const [serverReports, setServerReports] = useState<ReportListItem[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  // 제보별 댓글 개수
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {},
  );

  // 내 제보 목록
  const [myReports, setMyReports] = useState<ReportListItem[]>([]);
  const [isLoadingMyReports, setIsLoadingMyReports] = useState(true);
  const [myReportsError, setMyReportsError] = useState("");

  // 전체 제보 목록 조회
  useEffect(() => {
    let active = true;

    const fetchReports = async () => {
      setIsLoadingReports(true);
      setReportsError("");

      try {
        const response = await getReports();

        if (!active) return;

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "제보 목록 조회에 실패했습니다.",
          );
        }

        setServerReports(response.data);
      } catch (error) {
        if (!active) return;

        setServerReports([]);

        setReportsError(
          error instanceof Error
            ? error.message
            : "제보 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (active) {
          setIsLoadingReports(false);
        }
      }
    };

    void fetchReports();

    return () => {
      active = false;
    };
  }, []);

  // 각 제보의 댓글 개수 조회
  useEffect(() => {
    if (serverReports.length === 0) {
      setCommentCounts({});
      return;
    }

    let active = true;

    const fetchCommentCounts = async () => {
      const results = await Promise.allSettled(
        serverReports.map(async (report) => {
          const response = await getComments(report.id);

          if (!response.success || !Array.isArray(response.data)) {
            throw new Error(
              response.message || "댓글 조회에 실패했습니다.",
            );
          }

          return {
            id: report.id,
            count: response.data.length,
          };
        }),
      );

      if (!active) return;

      const nextCounts: Record<number, number> = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          nextCounts[result.value.id] = result.value.count;
        } else {
          console.error(
            `제보 ${serverReports[index].id} 댓글 개수 조회 실패:`,
            result.reason,
          );
        }
      });

      setCommentCounts(nextCounts);
    };

    void fetchCommentCounts();

    return () => {
      active = false;
    };
  }, [serverReports]);

  // 내 제보 목록 조회
  useEffect(() => {
    let active = true;

    const fetchMyReports = async () => {
      setIsLoadingMyReports(true);
      setMyReportsError("");

      try {
        const response = await getMyReports();

        if (!active) return;

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(
            response.message || "내 제보 목록 조회에 실패했습니다.",
          );
        }

        setMyReports(response.data);
      } catch (error) {
        if (!active) return;

        setMyReports([]);

        setMyReportsError(
          error instanceof Error
            ? error.message
            : "내 제보 목록을 불러오지 못했습니다.",
        );
      } finally {
        if (active) {
          setIsLoadingMyReports(false);
        }
      }
    };

    void fetchMyReports();

    return () => {
      active = false;
    };
  }, []);

  // 진행 중인 내 제보: 해결 완료 제외, 최신순 2개
  const recentReports = myReports
    .filter((report) => report.status !== "RESOLVED")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 2);

  // 서버 제보 데이터 → 기존 카드 UI 데이터 변환
  const syncedCampusIssues: (CampusIssue & {
    commentCount?: number;
  })[] = serverReports.map((report) => {
    return {
      id: report.id,
      building: "",
      floor: "",
      space: report.title,
      description: report.content,
      detail: report.content,
      aiSummary: "AI 분석 대기 중입니다.",
      createdAt: report.createdAt,
      dateLabel: report.createdAt.slice(0, 10),
      imageUrl: report.photoUrl ?? "",
      category: "제보",
      status: STATUS_LABELS[report.status],
      relatedReports: 1,
      likes: report.likeCount,
      comments: [],
      commentCount: commentCounts[report.id],
    };
  });

  // 기존 카드 목록 필터링 유지
  const filteredIssues =
    selectedFilter === "전체"
      ? syncedCampusIssues
      : syncedCampusIssues.filter((issue) => issue.status === selectedFilter);

  return (
    <div className="mb-5 min-h-screen pb-[73px]">
      <Header />

      <main className="w-full px-4 sm:px-6 lg:px-8">
        {/* 안내 문구 + 제보하기 */}
        <section className="mt-[21px] flex w-full flex-col items-start gap-[10px] rounded-[20px] border border-[#D9D9D9] bg-white p-4 sm:p-6 lg:gap-4 lg:p-8">
          <p className="text-xl font-bold leading-snug text-black sm:text-2xl lg:text-3xl">
            캠퍼스 시설 · 위생 불편을
            <br />
            제보해 주십시오.
          </p>

          <p className="text-xs font-normal leading-relaxed text-[#727070] sm:text-sm lg:text-base">
            접수된 제보는 AI가 분석하여 같은 문제끼리 묶은 뒤 시설관리팀에
            전달됩니다.
          </p>

          <Button
            title="제보하기"
            onClick={() => navigate("/student/report")}
          />
        </section>

        {/* 진행 중인 내 제보 */}
        <section className="mt-5 flex w-full flex-col gap-[9px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-bold text-black sm:text-base lg:text-xl">
              진행 중인 내 제보
            </p>

            <p
              onClick={() => navigate("/my-report")}
              className="cursor-pointer text-xs font-semibold text-[#3B8519] sm:text-sm lg:text-base"
            >
              전체보기
            </p>
          </div>

          {/* 내 제보 목록 */}
          <div className="w-full overflow-hidden rounded-[20px] border border-[#D9D9D9] bg-white">
            {isLoadingMyReports ? (
              <p className="px-4 py-8 text-center text-sm text-[#727070]">
                내 제보를 불러오는 중입니다.
              </p>
            ) : myReportsError ? (
              <p
                role="alert"
                className="px-4 py-8 text-center text-sm text-red-600"
              >
                {myReportsError}
              </p>
            ) : recentReports.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#727070]">
                진행 중인 제보가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-[#D9D9D9]">
                {recentReports.map((report) => (
                  <li
                    key={report.id}
                    className="flex min-w-0 items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5"
                  >
                    {/* 제보 장소 + 내용 */}
                    <div className="min-w-0 flex-1 gap-1">
                      <p className="text-sm font-semibold text-black sm:text-base lg:text-lg">
                        {report.title}
                      </p>

                      <p className="text-xs font-medium text-[#B0B0B0] sm:text-sm lg:text-base">
                        {report.content}
                      </p>
                    </div>

                    {/* 제보 처리 상태 */}
                    <ReportStatus status={STATUS_LABELS[report.status]} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 캠퍼스 문제 현황 */}
        <section className="mt-[31px] w-full">
          <h2 className="text-sm font-bold text-black sm:text-base lg:text-xl">
            캠퍼스 문제 현황
          </h2>

          {/* 상태별 필터: 제보 목록 기준으로 개수 계산 */}
          <div className="mt-3">
            <CampusIssueFilter
              issues={syncedCampusIssues}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* 문제 현황 카드 목록 */}
          <div className="mt-3 flex flex-col gap-[10px]">
            {isLoadingReports ? (
              <p className="py-8 text-center text-sm text-[#727070]">
                제보 목록을 불러오는 중입니다.
              </p>
            ) : reportsError ? (
              <p role="alert" className="py-8 text-center text-sm text-red-600">
                {reportsError}
              </p>
            ) : filteredIssues.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#727070]">
                등록된 제보가 없습니다.
              </p>
            ) : (
              filteredIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => navigate(`/reports/${issue.id}`)}
                  className="block w-full cursor-pointer rounded-[20px] text-left"
                >
                  <CampusIssueCard issue={issue} />
                </button>
              ))
            )}
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="mt-3 w-full text-xs leading-relaxed text-[#727070] sm:text-sm sm:leading-relaxed lg:text-base">
          개별 제보 내용과 제보자 정보는 공개되지 않으며, 같은 문제로 묶인
          현황만 표시됩니다.
        </p>
      </main>

      {/* 하단 푸터 */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Footer />
      </div>
    </div>
  );
}