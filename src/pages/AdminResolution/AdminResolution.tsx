import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { campusIssues } from "../../mocks/campusIssues";
import { useIssueStore } from "../../stores/useIssueStore";
import { useReportStore } from "../../stores/useReportStore";
import { getReportsByIssueId } from "../../mocks/reports";
import { toast } from "../../utils/toast";
import Button from "../../components/common/button/Button";

import backButton from "../../assets/images/back_button.png";
import CommonHeader from "../../components/common/CommonHeader/CommonHeader";

const resolutionTemplates = [
  {
    label: "점검 및 청소",
    content: "배수구 점검 및 청소를 완료했습니다.",
  },
  {
    label: "부품 교체",
    content: "부품 교체를 완료했습니다.",
  },
  {
    label: "외부 업체에 수리 요청",
    content: "외부 업체에 수리를 요청했습니다.",
  },
];

const AdminResolution = () => {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const issueId = Number(problemId);

  // 기존 목업 문제
  const issue = campusIssues.find(
    (item) => item.id === issueId,
  );

  // 새로 접수된 제보
  const submittedReport = useReportStore((state) =>
    state.reports.find(
      (report) =>
        report.id === issueId ||
        report.issueId === issueId,
    ),
  );

  // 기존 문제 또는 신규 제보
  const currentIssue = issue ?? submittedReport;

  // 해결 완료 처리 함수
  const completeIssue = useIssueStore(
    (state) => state.completeIssue,
  );

  const [resolution, setResolution] = useState("");

  // 관련 제보 수
  const reportCount = issue
    ? getReportsByIssueId(issueId).length
    : submittedReport
      ? 1
      : 0;

  const isValid = resolution.trim().length > 0;

  // 추천 문구 선택
  const handleTemplateClick = (content: string) => {
    setResolution(content);
  };

  // 처리 결과 등록
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || !currentIssue) return;

    const success = completeIssue(issueId, resolution);

    if (!success) {
      toast.error("처리 결과 등록에 실패했습니다.");
      return;
    }

    toast.success(
      "처리 결과가 등록되었습니다. 제보자에게 표시됩니다.",
    );

    // 기존 문제와 신규 제보의 상세 페이지 구분
    navigate(
      issue
        ? `/admin/problems/${issueId}`
        : `/admin/problems/submitted/${submittedReport?.id ?? issueId}`,
      {
        replace: true,
      },
    );
  };

  // 존재하지 않는 문제
  if (!currentIssue) {
    return (
      <main className="flex min-h-0 w-full flex-1 items-center justify-center bg-[#F7F8F6]">
        <div className="text-center">
          <p className="text-[15px] text-[#737373]">
            존재하지 않는 문제입니다.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4 rounded-xl bg-[#3B8519] px-5 py-3 text-white"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-[#F7F8F6]">
      <CommonHeader
        img={backButton}
        title="처리 결과 등록"
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-1 flex-col px-5 pb-7 pt-8 sm:px-7"
      >
        {/* 문제 정보 */}
        <div>
          <h2 className="text-[20px] font-bold text-black">
            {currentIssue.building}{" "}
            {currentIssue.floor}{" "}
            {currentIssue.space}
          </h2>

          <p className="mt-1 text-[14px] text-[#737373]">
            {issue?.category ?? "분석 대기"}
          </p>
        </div>

        {/* 처리 결과 입력 */}
        <div className="mt-7">
          <label
            htmlFor="resolution"
            className="mb-3 block text-[15px] font-semibold text-black"
          >
            처리 결과{" "}
            <span className="text-[#A50000]">*</span>
          </label>

          <textarea
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="예: 배수구 점검 및 청소를 완료했습니다."
            className="h-[180px] w-full resize-none rounded-[18px] border border-[#D9D9D9] bg-white px-4 py-4 text-[14px] leading-6 text-black outline-none placeholder:text-[#C4C4C4] focus:border-[#3B8519]"
          />
        </div>

        {/* 추천 문구 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {resolutionTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() =>
                handleTemplateClick(template.content)
              }
              className="rounded-full border border-[#D9D9D9] bg-white px-3 py-2 text-[12px] font-medium text-black transition-colors hover:border-[#3B8519] hover:text-[#3B8519]"
            >
              {template.label}
            </button>
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="mt-5 rounded-xl border border-[#D9D9D9] bg-white/70 px-4 py-3">
          <p className="break-keep text-[12px] leading-5 text-[#4B5563]">
            등록하면 상태가 '해결 완료'로 변경되고,
            관련 제보자 {reportCount}명에게 처리 결과가
            표시되며, 학생 홈에 해결 완료 현황이 공개됩니다.
          </p>
        </div>

        {/* 하단 등록 버튼 */}
        <div className="mt-auto w-full pt-40">
          <Button title="등록하고 해결 완료 처리" />
        </div>
      </form>
    </main>
  );
};

export default AdminResolution;