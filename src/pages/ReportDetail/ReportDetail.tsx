import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import ReportDetailCard from "../../components/reportDetail/ReportDetailCard";
import ReportCommentList from "../../components/reportDetail/ReportCommentList";
import ReportCommentInput from "../../components/reportDetail/ReportCommentInput";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";

import backButton from "../../assets/images/back_button.png";

import { getReportDetail } from "../../api/reports";

import type {
  ReportApiStatus,
  ReportListItem,
} from "../../types/report";

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

// 저장된 전체 댓글 및 공감 데이터 불러오기
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

// 백엔드 상태 → 화면 상태 변환
const STATUS_LABELS: Record<
  ReportApiStatus,
  CampusIssue["status"]
> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

// 서버 제보 데이터 → 기존 상세 카드 데이터 변환
const toCampusIssue = (
  data: ReportListItem,
): CampusIssue => {
  return {
    id: data.id,

    building: "",
    floor: "",
    space: data.title,

    description: data.content,
    detail: data.content,

    createdAt: data.createdAt,
    dateLabel: data.createdAt.slice(0, 10),

    imageUrl: data.photoUrl ?? "",

    status: STATUS_LABELS[data.status],

    category: "제보",

    relatedReports: 1,
    likes: data.likeCount,
    comments: [],
  };
};

export default function ReportDetail() {
  // 두 라우트의 파라미터 이름 모두 지원
  const { id, reportId } = useParams<{
    id?: string;
    reportId?: string;
  }>();

  const currentId = id ?? reportId ?? "";

  // 제보 상세 정보
  const [report, setReport] = useState<CampusIssue | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 댓글 목록
  const [comments, setComments] = useState<
    CampusIssueComment[]
  >([]);

  // 본인이 작성한 댓글 ID
  const [myCommentIds, setMyCommentIds] = useState<
    number[]
  >([]);

  // 공감 여부
  const [isLiked, setIsLiked] = useState(false);

  // 제보 상세 조회 API
  useEffect(() => {
    let active = true;

    const numericId = Number(currentId);

    if (
      !currentId ||
      !Number.isSafeInteger(numericId) ||
      numericId <= 0
    ) {
      setReport(null);
      setError("올바르지 않은 제보 번호입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setReport(null);

    const fetchReportDetail = async () => {
      try {
        const response = await getReportDetail(numericId);

        if (!active) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "제보 상세 조회에 실패했습니다.",
          );
        }

        const convertedReport = toCampusIssue(
          response.data,
        );

        setReport(convertedReport);
      } catch (caughtError: unknown) {
        if (!active) return;

        const apiMessage = axios.isAxiosError(caughtError)
          ? caughtError.response?.data?.message
          : undefined;

        setError(
          typeof apiMessage === "string" &&
            apiMessage.trim()
            ? apiMessage
            : caughtError instanceof Error
              ? caughtError.message
              : "제보 상세 정보를 불러오지 못했습니다.",
        );

        setReport(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchReportDetail();

    return () => {
      active = false;
    };
  }, [currentId]);

  // 제보 변경 시 저장된 댓글 및 공감 정보 불러오기
  useEffect(() => {
    if (!report) return;

    const stored = getIssueEngagement(
      String(report.id),
      report.comments,
    );

    setComments(stored.comments);
    setMyCommentIds(stored.myCommentIds);
    setIsLiked(stored.isLiked);
  }, [report]);

  // 댓글 등록
  const handleAddComment = (content: string) => {
    if (!report) return;

    const issueId = String(report.id);

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

    saveIssueEngagement(issueId, {
      comments: nextComments,
      myCommentIds: nextMyCommentIds,
      isLiked,
    });
  };

  // 본인 댓글 삭제
  const handleDeleteComment = (
    commentId: number,
  ) => {
    if (
      !report ||
      !myCommentIds.includes(commentId)
    ) {
      return;
    }

    const issueId = String(report.id);

    const nextComments = comments.filter(
      (comment) => comment.id !== commentId,
    );

    const nextMyCommentIds = myCommentIds.filter(
      (id) => id !== commentId,
    );

    setComments(nextComments);
    setMyCommentIds(nextMyCommentIds);

    saveIssueEngagement(issueId, {
      comments: nextComments,
      myCommentIds: nextMyCommentIds,
      isLiked,
    });
  };

  // 공감 클릭 및 취소
  const handleToggleLike = () => {
    if (!report) return;

    const issueId = String(report.id);

    const nextIsLiked = !isLiked;

    setIsLiked(nextIsLiked);

    saveIssueEngagement(issueId, {
      comments,
      myCommentIds,
      isLiked: nextIsLiked,
    });
  };

  // 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F9F8]">
        <CommonHeader
          img={backButton}
          title="문제 현황"
        />

        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <p className="text-sm text-[#555555]">
            제보 상세 정보를 불러오는 중입니다.
          </p>
        </div>
      </main>
    );
  }

  // 제보 조회 실패
  if (!report) {
    return (
      <main className="min-h-screen bg-[#F8F9F8]">
        <CommonHeader
          img={backButton}
          title="문제 현황"
        />

        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-base text-[#555555]">
            {error || "제보를 찾을 수 없습니다."}
          </p>

          <Link
            to="/home"
            className="font-semibold text-[#3B8519] underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
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