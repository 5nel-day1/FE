import type { CampusIssueComment } from "../../types/campusIssue";

interface ReportCommentListProps {
  comments: CampusIssueComment[];
  myCommentIds: number[];
  onDeleteComment: (commentId: number) => void;
}

export default function ReportCommentList({
  comments,
  myCommentIds,
  onDeleteComment,
}: ReportCommentListProps) {
  return (
    <section className="w-full rounded-[20px] border border-[#DADADA] bg-white px-4 py-5 sm:px-5">
      <h3 className="border-b border-[#DEDEDE] pb-3 text-sm font-bold text-black">
        댓글 {comments.length}
      </h3>

      {comments.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center text-sm text-[#777777]">
          첫 댓글을 남겨주세요.
        </div>
      ) : (
        <ul className="divide-y divide-[#DEDEDE]">
          {comments.map((comment) => (
            <li key={comment.id} className="py-3 first:pt-3 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                {/* 작성자 및 시간 */}
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="text-sm font-semibold text-black">
                    {comment.author}
                  </span>

                  <time className="text-xs text-[#888888]">
                    {comment.createdAt.replace("T", " ")}
                  </time>
                </div>

                {/* 본인 댓글 삭제 버튼 : 본인이 쓴 댓글일 때만 삭제 버튼이 생김 */}
                {myCommentIds.includes(comment.id) && (
                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment.id)}
                    className="shrink-0 text-xs text-[#888888] hover:text-[#333333]"
                  >
                    삭제
                  </button>
                )}
              </div>

              {/* 댓글 내용 */}
              <p className="mt-1 whitespace-pre-wrap break-keep text-sm leading-relaxed text-[#333333]">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
