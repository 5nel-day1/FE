import { useState, type FormEvent } from "react";

interface ReportCommentInputProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
}

export default function ReportCommentInput({
  onSubmit,
  disabled = false,
}: ReportCommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || disabled) return;

    onSubmit(trimmedContent);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 border-t border-[#E5E5E5] px-4 py-4 sm:px-6"
    >
      {/* 댓글 입력창 */}
      <label htmlFor="report-comment" className="sr-only">
        댓글 입력
      </label>

      <input
        id="report-comment"
        type="text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="댓글을 입력해주세요."
        disabled={disabled}
        maxLength={500}
        className="min-w-0 flex-1 rounded-xl border border-[#DADADA] bg-white px-4 py-3 text-sm text-[#222222] outline-none placeholder:text-[#999999] focus:border-[#3B8519] disabled:bg-[#F5F5F5]"
      />

      {/* 등록 버튼 */}
      <button
        type="submit"
        disabled={disabled || !content.trim()}
        className="shrink-0 rounded-xl bg-[#3B8519] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#306C15] disabled:cursor-not-allowed disabled:opacity-50"
      >
        등록
      </button>
    </form>
  );
}   