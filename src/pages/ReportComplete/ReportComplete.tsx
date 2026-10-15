import { useLocation, useNavigate } from "react-router-dom";
import type { ReportSubmission } from "../../types/reportCreate";
import checkIcon from "../../assets/icons/checkIcon.png";

interface ReportCompleteLocationState {
  submission?: ReportSubmission;
}

export default function ReportComplete() {
  const navigate = useNavigate();
  const location = useLocation();

  const { submission } = (location.state ?? {}) as ReportCompleteLocationState;

  // 접수 정보 없이 접근한 경우
  if (!submission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F8F9F7] px-5 text-center">
        <p className="text-base font-medium text-[#374151]">
          접수 정보를 찾을 수 없습니다.
        </p>

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="cursor-pointer rounded-xl bg-[#3B8519] px-8 py-3 font-semibold text-white"
        >
          홈으로
        </button>
      </div>
    );
  }

  const place = [submission.building, submission.floor, submission.space]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-[#F8F9F7]">
      <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col justify-center px-5 py-12 sm:px-8">
        {/* 접수 완료 안내 */}
        <div className="flex flex-col items-center text-center">
          <img src={checkIcon} />

          <h1 className="mt-7 text-2xl font-bold text-black sm:text-[28px]">
            제보가 접수되었습니다
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6B7280] sm:text-base">
            처리 상태는 &apos;내 제보&apos;에서 확인하실 수 있습니다.
            <br />
            진행 상황은 제보자 본인과 관리자만 볼 수 있습니다.
          </p>
        </div>

        {/* 접수 정보 카드 */}
        <section
          aria-label="접수된 제보 정보"
          className="mt-10 w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7"
        >
          <dl className="space-y-5">
            {/* 접수번호 */}
            <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 sm:grid-cols-[100px_minmax(0,1fr)]">
              <dt className="text-sm font-medium text-[#9CA3AF]">접수번호</dt>

              <dd className="break-words text-sm font-semibold text-[#3B8519]">
                {submission.receiptNumber}
              </dd>
            </div>

            {/* 장소 */}
            <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 sm:grid-cols-[100px_minmax(0,1fr)]">
              <dt className="text-sm font-medium text-[#9CA3AF]">장소</dt>

              <dd className="break-words text-sm font-medium text-[#111827]">
                {place}
              </dd>
            </div>

            {/* 문제 내용 */}
            <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 sm:grid-cols-[100px_minmax(0,1fr)]">
              <dt className="text-sm font-medium text-[#9CA3AF]">내용</dt>

              <dd className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-[#111827]">
                {submission.content}
              </dd>
            </div>
          </dl>
        </section>

        {/* 하단 버튼 */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/my-report")}
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#3B8519] text-base font-bold text-white transition-colors hover:bg-[#306D15]"
          >
            내 제보 확인
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border border-[#D9D9D9] bg-white text-base font-bold text-[#374151] transition-colors hover:bg-[#F3F4F6]"
          >
            홈으로
          </button>
        </div>
      </main>
    </div>
  );
}
