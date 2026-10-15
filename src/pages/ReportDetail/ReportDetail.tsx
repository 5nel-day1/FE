import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReportDetailCard from "../../components/reportDetail/ReportDetailCard";
import ReportCommentList from "../../components/reportDetail/ReportCommentList";
import ReportCommentInput from "../../components/reportDetail/ReportCommentInput";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";

import backButton from "../../assets/images/back_button.png";

import { campusIssues } from "../../mocks/campusIssues";
import { useReportStore } from "../../stores/useReportStore";
import { useIssueStore } from "../../stores/useIssueStore";

import type {
  CampusIssue,
  CampusIssueComment,
} from "../../types/campusIssue";

// 댓글 및 공감 저장소
const STORAGE_KEY = "catch-u-issue-engagement-v1";

interface IssueEngagement {
  comments: CampusIssueComment[];
  myCommentIds: number[];
  isLiked: boolean;
}

type EngagementStorage = Record<string, IssueEngagement>;

// 저장된 전체 데이터 불러오기
const getStoredEngagements = (): EngagementStorage => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed as EngagementStorage;
  } catch {
    return {};
  }
};

// 특정 제보의 댓글 및 공감 데이터 불러오기
const getIssueEngagement = (
  issueId: string,
  initialComments: CampusIssueComment[],
): IssueEngagement => {
  const stored = getStoredEngagements()[issueId];

  if (!stored) {
    return {
      comments: initialComments,
      myCommentIds: [],
      isLiked: false,
    };
  }

  return {
    comments: Array.isArray(stored.comments)
      ? stored.comments
      : initialComments,
    myCommentIds: Array.isArray(stored.myCommentIds)
      ? stored.myCommentIds
      : [],
    isLiked:
      typeof stored.isLiked === "boolean"
        ? stored.isLiked
        : false,
  };
};

// 특정 제보의 댓글 및 공감 데이터 저장하기
const saveIssueEngagement = (
  issueId: string,
  engagement: IssueEngagement,
) => {
  try {
    const stored = getStoredEngagements();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...stored,
        [issueId]: engagement,
      }),
    );
  } catch (error) {
    console.error("댓글 및 공감 저장 실패:", error);
  }
};

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();

  // 신규 등록 제보 목록
  const submittedReports = useReportStore(
    (state) => state.reports,
  );

  // 관리자 처리 상태
  const storedIssues = useIssueStore(
    (state) => state.issues,
  );

  // 기존 목업 문제 조회
  const existingIssue = campusIssues.find(
    (issue) => String(issue.id) === id,
  );

  // 신규 등록 제보 조회
  const submittedReport = submittedReports.find(
    (report) => String(report.id) === id,
  );

  // 현재 문제 처리 상태
  const issueStatus = existingIssue
    ? storedIssues[existingIssue.id]?.status
    : submittedReport
      ? storedIssues[
          submittedReport.issueId ?? submittedReport.id
        ]?.status
      : undefined;

  // 기존 문제 또는 신규 제보 데이터 변환
  const report = useMemo<CampusIssue | undefined>(() => {
    // 기존 목업 문제
    if (existingIssue) {
      return {
        ...existingIssue,
        status: issueStatus ?? existingIssue.status,
      };
    }

    // 신규 등록 제보
    if (submittedReport) {
      return {
        id: submittedReport.id,
        building: submittedReport.building,
        floor: submittedReport.floor,
        space: submittedReport.space,

        description: submittedReport.description,
        detail: submittedReport.description,
        aiSummary: "AI 분석 대기 중입니다.",

        createdAt: submittedReport.createdAt,
        dateLabel: submittedReport.createdAt.slice(0, 10),

        imageUrl: submittedReport.imageUrl ?? "",

        status: issueStatus ?? submittedReport.status,
        category: "분석 대기",

        relatedReports: 1,
        likes: 0,
        comments: [],
      };
    }

    return undefined;
  }, [existingIssue, submittedReport, issueStatus]);

  // 제보별 저장된 댓글 및 공감 정보
  const initialEngagement = getIssueEngagement(
    id ?? "",
    report?.comments ?? [],
  );

  // 댓글 목록
  const [comments, setComments] = useState<CampusIssueComment[]>(
    initialEngagement.comments,
  );

  // 본인이 작성한 댓글 ID
  const [myCommentIds, setMyCommentIds] = useState<number[]>(
    initialEngagement.myCommentIds,
  );

  // 공감 여부
  const [isLiked, setIsLiked] = useState(
    initialEngagement.isLiked,
  );

  // 다른 제보로 이동하면 해당 제보의 저장된 데이터 불러오기
  useEffect(() => {
    const stored = getIssueEngagement(
      id ?? "",
      report?.comments ?? [],
    );

    setComments(stored.comments);
    setMyCommentIds(stored.myCommentIds);
    setIsLiked(stored.isLiked);
  }, [id]);

  // 댓글 등록
  const handleAddComment = (content: string) => {
    if (!id) return;

    const nextAnonymousNumber =
      comments.reduce((max, comment) => {
        const match = /^익명\s*(\d+)$/.exec(
          comment.author,
        );

        return match
          ? Math.max(max, Number(match[1]))
          : max;
      }, 0) + 1;

    const newComment: CampusIssueComment = {
      id: Date.now(),
      author: `익명 ${nextAnonymousNumber}`,
      createdAt: new Date().toLocaleString("ko-KR"),
      content,
    };

    const nextComments = [...comments, newComment];
    const nextMyCommentIds = [
      ...myCommentIds,
      newComment.id,
    ];

    setComments(nextComments);
    setMyCommentIds(nextMyCommentIds);

    saveIssueEngagement(id, {
      comments: nextComments,
      myCommentIds: nextMyCommentIds,
      isLiked,
    });
  };

  // 본인 댓글 삭제
  const handleDeleteComment = (commentId: number) => {
    if (!id || !myCommentIds.includes(commentId)) return;

    const nextComments = comments.filter(
      (comment) => comment.id !== commentId,
    );

    const nextMyCommentIds = myCommentIds.filter(
      (commentIdValue) => commentIdValue !== commentId,
    );

    setComments(nextComments);
    setMyCommentIds(nextMyCommentIds);

    saveIssueEngagement(id, {
      comments: nextComments,
      myCommentIds: nextMyCommentIds,
      isLiked,
    });
  };

  // 공감 클릭 및 취소
  const handleToggleLike = () => {
    if (!id) return;

    const nextIsLiked = !isLiked;

    setIsLiked(nextIsLiked);

    saveIssueEngagement(id, {
      comments,
      myCommentIds,
      isLiked: nextIsLiked,
    });
  };

  // 존재하지 않는 제보
  if (!report) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-base text-[#555555]">
          제보를 찾을 수 없습니다.
        </p>

        <Link
          to="/home"
          className="font-semibold text-[#3B8519] underline"
        >
          홈으로 돌아가기
        </Link>
      </main>
    );
  }

  // 상세 페이지에 전달할 최종 데이터
  const currentReport: CampusIssue = {
    ...report,
    comments,
    likes: report.likes + (isLiked ? 1 : 0),
  };

  return (
    <main className="min-h-screen bg-[#F8F9F8]">
      {/* 헤더 */}
      <CommonHeader
        img={backButton}
        title="문제 현황"
      />

      <div className="flex w-full flex-col gap-5 px-4 pb-8 pt-8 sm:px-6">
        {/* 제보 상세 카드 */}
        <ReportDetailCard
          report={currentReport}
          isLiked={isLiked}
          onToggleLike={handleToggleLike}
        />

        {/* 댓글 목록 */}
        <ReportCommentList
          comments={comments}
          myCommentIds={myCommentIds}
          onDeleteComment={handleDeleteComment}
        />
      </div>

      {/* 댓글 입력창 */}
      <ReportCommentInput
        onSubmit={handleAddComment}
      />
    </main>
  );
}