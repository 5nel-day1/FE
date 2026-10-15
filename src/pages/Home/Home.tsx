import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Button from "../../components/common/button/Button";
import ReportStatus from "../../components/common/ReportStatus/ReportStatus";

import type { CampusIssue, CampusIssueComment } from "../../types/campusIssue";

import CampusIssueFilter, {
  type IssueFilter,
} from "../../components/campus/CampusIssueFilter";
import CampusIssueCard from "../../components/campus/CampusIssueCard";

import { reports } from "../../mocks/reports";
import { campusIssues } from "../../mocks/campusIssues";

import { useIssueStore } from "../../stores/useIssueStore";
import { useReportStore } from "../../stores/useReportStore";

// ----------------------------------------
// 댓글 및 공감 저장소
// ----------------------------------------

const STORAGE_KEY = "catch-u-issue-engagement-v1";

interface IssueEngagement {
  comments: CampusIssueComment[];
  myCommentIds: number[];
  isLiked: boolean;
}

type EngagementStorage = Record<string, IssueEngagement>;

// 특정 문제의 저장된 댓글 및 공감 정보 조회
const getStoredEngagement = (
  issueId: string | number,
): IssueEngagement | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    const engagement = (parsed as EngagementStorage)[String(issueId)];

    if (!engagement || typeof engagement !== "object") {
      return null;
    }

    if (
      !Array.isArray(engagement.comments) ||
      typeof engagement.isLiked !== "boolean"
    ) {
      return null;
    }

    return engagement;
  } catch {
    return null;
  }
};

export default function Home() {
  const navigate = useNavigate();

  // 관리자와 학생이 동일한 문제 상태 사용
  const issues = useIssueStore((state) => state.issues);

  // 학생이 새로 등록한 제보
  const submittedReports = useReportStore((state) => state.reports);

  // 캠퍼스 문제 현황 필터
  const [selectedFilter, setSelectedFilter] = useState<IssueFilter>("전체");

  // ----------------------------------------
  // 진행 중인 내 제보
  // ----------------------------------------

  // 기존 목업 데이터 + 새로 등록한 제보
  // 해결 완료된 제보 제외, 최신 2개 표시
  const recentReports = [
    ...submittedReports.map((report) => ({
      ...report,
      status: issues[report.issueId ?? report.id]?.status ?? report.status,
    })),

    ...reports.map((report) => ({
      ...report,
      status: issues[report.issueId]?.status ?? report.status,
    })),
  ]
    .filter((report) => report.status !== "해결 완료")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 2);

  // ----------------------------------------
  // 캠퍼스 문제 현황
  // ----------------------------------------

  // 기존 캠퍼스 문제 + 댓글 및 공감 동기화
  const existingCampusIssues: CampusIssue[] = campusIssues.map((issue) => {
    const engagement = getStoredEngagement(issue.id);

    return {
      ...issue,

      // 관리자 처리 상태
      status: issues[issue.id]?.status ?? issue.status,

      // 상세 페이지에서 작성한 댓글
      comments: engagement?.comments ?? issue.comments,

      // 상세 페이지에서 누른 공감
      likes: issue.likes + (engagement?.isLiked ? 1 : 0),
    };
  });

  // 기존 문제에 연결되지 않은 신규 제보
  const newCampusIssues: CampusIssue[] = submittedReports
    .filter((report) => report.issueId == null)
    .map((report) => {
      const engagement = getStoredEngagement(report.id);

      return {
        // 기존 CampusIssue 구조 기반
        ...campusIssues[0],

        id: report.id,

        building: report.building,
        floor: report.floor,
        space: report.space,

        description: report.description,
        detail: report.description,
        aiSummary: "AI 분석 대기 중입니다.",

        createdAt: report.createdAt,
        dateLabel: report.createdAt.slice(0, 10),

        imageUrl: report.imageUrl ?? "",

        category: "분석 대기",

        // 관리자 처리 상태
        status: issues[report.issueId ?? report.id]?.status ?? report.status,

        relatedReports: 1,

        // 상세 페이지에서 누른 공감
        likes: engagement?.isLiked ? 1 : 0,

        // 상세 페이지에서 작성한 댓글
        comments: engagement?.comments ?? [],
      };
    });

  // 기존 문제 + 신규 문제
  const syncedCampusIssues: CampusIssue[] = [
    ...newCampusIssues,
    ...existingCampusIssues,
  ];

  // 선택한 상태에 따라 필터링
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

          {/* 제보 목록 */}
          <div className="w-full overflow-hidden rounded-[20px] border border-[#D9D9D9] bg-white">
            {recentReports.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#727070]">
                진행 중인 제보가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-[#D9D9D9]">
                {recentReports.map((report) => (
                  <li
                    key={
                      "receiptNumber" in report
                        ? report.receiptNumber
                        : `mock-${report.id}`
                    }
                    className="flex min-w-0 items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5"
                  >
                    {/* 제보 장소 + 내용 */}
                    <div className="min-w-0 flex-1 gap-1">
                      <p className="text-sm font-semibold text-black sm:text-base lg:text-lg">
                        {report.building} {report.floor} {report.space}
                      </p>

                      <p className="text-xs font-medium text-[#B0B0B0] sm:text-sm lg:text-base">
                        {report.description}
                      </p>
                    </div>

                    {/* 제보 처리 상태 */}
                    <ReportStatus status={report.status} />
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

          {/* 상태별 필터 */}
          <div className="mt-3">
            <CampusIssueFilter
              issues={syncedCampusIssues}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* 문제 현황 카드 목록 */}
          <div className="mt-3 flex flex-col gap-[10px]">
            {filteredIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => navigate(`/reports/${issue.id}`)}
                className="block w-full cursor-pointer rounded-[20px] text-left"
              >
                <CampusIssueCard issue={issue} />
              </button>
            ))}
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="mt-3 w-full text-xs leading-relaxed text-[#727070] sm:text-sm lg:text-base">
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
