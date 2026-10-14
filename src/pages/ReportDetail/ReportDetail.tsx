import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReportDetailCard from "../../components/reportDetail/ReportDetailCard";
import ReportCommentList from "../../components/reportDetail/ReportCommentList";
import ReportCommentInput from "../../components/reportDetail/ReportCommentInput";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

import { campusIssues } from "../../mocks/campusIssues";
import type { CampusIssueComment } from "../../types/campusIssue";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();

  const report = campusIssues.find((issue) => String(issue.id) === id);

  const [comments, setComments] = useState<CampusIssueComment[]>(
    report?.comments ?? [],
  );

  // 본인이 작성한 댓글 ID
  const [myCommentIds, setMyCommentIds] = useState<number[]>([]);

  // 공감 여부
  const [isLiked, setIsLiked] = useState(false);

  // 다른 제보로 이동하면 초기화
  useEffect(() => {
    setComments(report?.comments ?? []);
    setMyCommentIds([]);
    setIsLiked(false);
  }, [report]);

  // 댓글 등록
  const handleAddComment = (content: string) => {
    const nextAnonymousNumber =
      comments.reduce((max, comment) => {
        const match = /^익명\s*(\d+)$/.exec(comment.author);

        return match ? Math.max(max, Number(match[1])) : max;
      }, 0) + 1;

    const newComment: CampusIssueComment = {
      id: Date.now(),
      author: `익명 ${nextAnonymousNumber}`,
      createdAt: new Date().toLocaleString("ko-KR"),
      content,
    };

    setComments((prev) => [...prev, newComment]);
    setMyCommentIds((prev) => [...prev, newComment.id]);
  };

  // 본인 댓글 삭제
  const handleDeleteComment = (commentId: number) => {
    if (!myCommentIds.includes(commentId)) return;

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    setMyCommentIds((prev) => prev.filter((id) => id !== commentId));
  };

  if (!report) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-base text-[#555555]">제보를 찾을 수 없습니다.</p>

        <Link to="/home" className="font-semibold text-[#3B8519] underline">
          홈으로 돌아가기
        </Link>
      </main>
    );
  }

  const currentReport = {
    ...report,
    comments,
    likes: report.likes + (isLiked ? 1 : 0),
  };

  return (
    <main className="min-h-screen bg-[#F8F9F8]">
      <CommonHeader img={backButton} title="문제 현황" />

      <div className="flex w-full flex-col gap-5 px-4 pb-8 pt-8 sm:px-6">
        {/* 제보 상세 카드 */}
        <ReportDetailCard
          report={currentReport}
          isLiked={isLiked}
          onToggleLike={() => setIsLiked((prev) => !prev)}
        />

        {/* 댓글 목록 */}
        <ReportCommentList
          comments={comments}
          myCommentIds={myCommentIds}
          onDeleteComment={handleDeleteComment}
        />
      </div>

      {/* 댓글 입력창 */}
      <ReportCommentInput onSubmit={handleAddComment} />
    </main>
  );
}
