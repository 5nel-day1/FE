import { useState } from "react";
import type { CampusIssue } from "../../types/campusIssue";

interface ReportDetailCardProps {
  report: CampusIssue;
  isLiked: boolean;
  onToggleLike: () => void;
}

export default function ReportDetailCard({
  report,
  isLiked,
  onToggleLike,
}: ReportDetailCardProps) {
  const isResolved = report.status === "해결 완료";

  // 이미지 로딩 실패 여부
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const imageUrl = report.imageUrl?.trim() ?? "";

  // 이미지가 없는 경우와 로딩에 실패한 경우 구분
  const imageUnavailable = !imageUrl;
  const imageFailed = Boolean(imageUrl) && failedImageUrl === imageUrl;

  const showImage = Boolean(imageUrl) && !imageFailed;

  const location = [
    report.building,
    report.floor,
    report.space,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="w-full min-w-0 rounded-[20px] border border-[#DADADA] bg-white px-5 py-6 sm:px-6">
      {/* 상태 및 장소 */}
      <div className="flex flex-col items-start gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            isResolved
              ? "bg-[#EAF4E6] text-[#3B8519]"
              : report.status === "접수"
                ? "bg-[#6B7280]/[0.13] text-[#6B7280]"
                : report.status === "확인 중"
                  ? "bg-[#A16207]/[0.13] text-[#A16207]"
                  : "bg-[#2458C6]/[0.13] text-[#2458C6]"
          }`}
        >
          {report.status}
        </span>

        <h2 className="text-[20px] font-bold leading-snug text-black">
          {location}
        </h2>
      </div>

      {/* 문제 유형 및 제보 정보 */}
      <p className="mt-1 text-xs leading-relaxed text-[#777777]">
        {report.category} · 관련 제보 {report.relatedReports}건 ·{" "}
        {isResolved
          ? `${report.resolvedAt ?? report.dateLabel} 해결`
          : `최근 제보 ${report.dateLabel}`}
      </p>

      <div className="my-3 border-t border-[#DEDEDE]" />

      {/* 문제 내용 */}
      <p className="text-xs text-[#777777]">
        문제 내용
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-base font-semibold leading-[1.8] text-black">
        {report.description}
      </p>

      {/* 처리 상태별 UI */}
      {isResolved ? (
        <section className="mt-5 rounded-xl border border-[#3B8519] bg-[#F7FBF5] p-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-sm font-bold text-[#3B8519]">
              처리 결과
            </h3>

            {report.resolvedAt && (
              <span className="text-xs text-[#999999]">
                {report.resolvedAt} 처리
              </span>
            )}
          </div>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#333333]">
            {report.resolution ??
              "처리 결과가 등록되지 않았습니다."}
          </p>
        </section>
      ) : (
        <section className="mt-5">
          <p className="mb-2 text-xs text-[#777777]">
            제보 사진
          </p>

          {showImage ? (
            <img
              src={imageUrl}
              alt={`${location} 제보 사진`}
              className="h-32 w-52 max-w-full rounded-[18px] object-cover"
              onError={(event) => {
                console.error("제보 이미지 로딩 실패:", {
                  imageUrl,
                  currentSrc: event.currentTarget.currentSrc,
                });

                setFailedImageUrl(imageUrl);
              }}
            />
          ) : (
            <div className="flex h-32 w-52 max-w-full items-center justify-center rounded-[18px] bg-[#F5F5F5] px-3 text-center text-xs text-[#777777]">
              {imageUnavailable
                ? "등록된 이미지가 없습니다."
                : imageFailed
                  ? "이미지를 불러오지 못했습니다."
                  : "등록된 이미지가 없습니다."}
            </div>
          )}
        </section>
      )}

      {/* 공감 및 댓글 */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={isLiked}
          className={`min-h-12 rounded-xl border text-sm font-semibold transition-colors ${
            isLiked
              ? "border-[#3B8519] bg-[#3B8519] text-white"
              : "border-[#DADADA] bg-white text-black"
          }`}
        >
          {isLiked ? "공감함" : "공감"} {report.likes}
        </button>

        <button
          type="button"
          className="min-h-12 rounded-xl border border-[#DADADA] bg-white text-sm font-semibold text-black"
          aria-label={`댓글 ${report.comments.length}개`}
        >
          댓글 {report.comments.length}
        </button>
      </div>
    </article>
  );
}