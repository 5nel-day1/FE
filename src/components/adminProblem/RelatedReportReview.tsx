import { useNavigate } from "react-router-dom";
import { getReportsByIssueId } from "../../mocks/reports";

interface RelatedReportReviewProps {
  issueId: number;
  reportContents?: string[];
}

const RelatedReportReview = ({
  issueId,
  reportContents,
}: RelatedReportReviewProps) => {
  const navigate = useNavigate();

  // API 데이터가 있으면 우선 사용하고,
  // 없으면 기존 목업 데이터를 사용
  const mockReports = [...getReportsByIssueId(issueId)].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime(),
  );

  const reports =
    reportContents ??
    mockReports.map((report) => report.description);

  // 관련 제보 최대 3건 미리보기
  const previewReports = reports.slice(0, 3);

  // 4건 이상이면 전체 보기 버튼 표시
  const hasMoreReports = reports.length > 3;

  return (
    <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
      {/* 제목 */}
      <h2 className="mb-4 text-[18px] font-bold text-[#13213C] sm:text-[20px]">
        관련 제보
      </h2>

      {/* 관련 제보 목록 */}
      {previewReports.length === 0 ? (
        <p className="py-5 text-center text-[14px] text-[#737373]">
          관련 제보가 없습니다.
        </p>
      ) : (
        <ol className="space-y-3">
          {previewReports.map((content, index) => (
            <li
              key={`${index}-${content}`}
              className="break-keep text-[14px] leading-6 text-[#13213C] sm:text-[15px]"
            >
              {index + 1}. {content}
            </li>
          ))}
        </ol>
      )}

      {/* 관련 제보 전체 보기 */}
      {hasMoreReports && (
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/problems/${issueId}/reports`)
          }
          className="mt-4 w-full cursor-pointer rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-[14px] font-semibold text-[#13213C] transition hover:bg-[#F8FAF8]"
        >
          관련 제보 전체 보기 ({reports.length})
        </button>
      )}
    </section>
  );
};

export default RelatedReportReview;