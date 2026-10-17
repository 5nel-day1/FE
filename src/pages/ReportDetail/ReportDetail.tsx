import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import ReportDetailCard from "../../components/reportDetail/ReportDetailCard";
import ReportCommentList from "../../components/reportDetail/ReportCommentList";
import ReportCommentInput from "../../components/reportDetail/ReportCommentInput";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";

import backButton from "../../assets/images/back_button.png";

import { getReportDetail } from "../../api/reports";
import {
  createComment,
  deleteComment,
  getComments,
} from "../../api/comments";
import { toggleReportLike } from "../../api/likes";

import type {
  ReportApiStatus,
  ReportListItem,
} from "../../types/report";

import type {
  CampusIssue,
  CampusIssueComment,
} from "../../types/campusIssue";

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

// 이미지 URL 변환
// 상대 경로로 전달된 이미지는 백엔드 서버 주소를 붙여 사용
const getImageUrl = (photoUrl: string | null): string => {
  if (!photoUrl) return "";

  // 이미 완전한 URL이라면 그대로 사용
  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl;
  }

  // 상대 경로라면 백엔드 서버 주소 추가
  const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.juhee03.shop";

  return new URL(photoUrl, baseURL).toString();
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

    // 이미지 URL 변환 적용
    imageUrl: getImageUrl(data.photoUrl),

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
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // 댓글 작성 중 여부
  const [isSubmittingComment, setIsSubmittingComment] =
    useState(false);

  // 댓글 목록 재조회용
  const [commentRefreshKey, setCommentRefreshKey] =
    useState(0);

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

  // 제보 변경 시 댓글과 공감 상태 초기화
  useEffect(() => {
    if (!report) return;

    setComments([]);
    setMyCommentIds([]);
    setIsLiked(false);
  }, [report?.id]);

  // 댓글 목록 조회 API
  useEffect(() => {
    if (!report) return;

    let active = true;

    const fetchComments = async () => {
      try {
        const response = await getComments(
          Number(report.id),
        );

        if (!active) return;

        if (!response.success) {
          throw new Error(
            response.message ||
              "댓글 목록 조회에 실패했습니다.",
          );
        }

        // 서버 댓글을 기존 UI 타입으로 변환
        const serverComments: CampusIssueComment[] =
          response.data.map((comment) => ({
            id: comment.commentId,
            author: comment.anonymousName,
            content: comment.content,
            createdAt: comment.createdAt,
          }));

        // 댓글 목록 갱신
        setComments(serverComments);

        // 본인이 작성한 댓글만 삭제 버튼 표시
        setMyCommentIds(
          response.data
            .filter((comment) => comment.myComment)
            .map((comment) => comment.commentId),
        );
      } catch (caughtError) {
        if (!active) return;

        console.error(
          "댓글 목록 조회 실패:",
          caughtError,
        );

        setComments([]);
        setMyCommentIds([]);
      }
    };

    void fetchComments();

    return () => {
      active = false;
    };
  }, [report, commentRefreshKey]);

  // 댓글 작성 API
  const handleAddComment = async (content: string) => {
    if (!report || isSubmittingComment) return;

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      window.alert("댓글 내용을 입력해 주세요.");
      return;
    }

    setIsSubmittingComment(true);

    try {
      await createComment(
        Number(report.id),
        trimmedContent,
      );

      // 등록 성공 후 댓글 목록 다시 조회
      setCommentRefreshKey(
        (previous) => previous + 1,
      );
    } catch (caughtError) {
      console.error(
        "댓글 작성 실패:",
        caughtError,
      );

      window.alert(
        "댓글 등록에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 본인 댓글 삭제 API
  const handleDeleteComment = async (
    commentId: number,
  ) => {
    if (
      !report ||
      !myCommentIds.includes(commentId)
    ) {
      return;
    }

    try {
      await deleteComment(
        Number(report.id),
        commentId,
      );

      // 삭제 성공 후 댓글 목록 다시 조회
      setCommentRefreshKey(
        (previous) => previous + 1,
      );
    } catch (caughtError) {
      console.error(
        "댓글 삭제 실패:",
        caughtError,
      );

      window.alert(
        "댓글 삭제에 실패했습니다. 다시 시도해 주세요.",
      );
    }
  };

  // 공감 등록 및 취소 API
  const handleToggleLike = async () => {
    if (!report || isTogglingLike) return;

    setIsTogglingLike(true);

    try {
      const response = await toggleReportLike(
        Number(report.id),
      );

      if (!response.success) {
        throw new Error(
          response.message || "공감 처리에 실패했습니다.",
        );
      }

      // 서버에서 반환한 공감 여부 반영
      setIsLiked(response.data.liked);

      // 서버에서 반환한 실제 공감 개수 반영
      setReport((previous) =>
        previous && previous.id === report.id
          ? {
              ...previous,
              likes: response.data.likeCount,
            }
          : previous,
      );
    } catch (caughtError) {
      console.error(
        "공감 처리 실패:",
        caughtError,
      );

      window.alert(
        "공감 처리에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsTogglingLike(false);
    }
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
    likes: report.likes,
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