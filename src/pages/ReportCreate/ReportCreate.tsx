import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import BuildingSelector from "../../components/reportCreate/BuildingSelector";
import FloorSelector from "../../components/reportCreate/FloorSelector";
import ReportLocationInput from "../../components/reportCreate/ReportLocationInput";
import ReportContentInput from "../../components/reportCreate/ReportContentInput";
import ReportImageUpload from "../../components/reportCreate/ReportImageUpload";

import type {
  ReportCreateForm,
  ReportSubmission,
} from "../../types/reportCreate";

const initialForm: ReportCreateForm = {
  building: "",
  floor: "",
  space: "",
  content: "",
  image: null,
};

export default function ReportCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ReportCreateForm>(initialForm);
  const [error, setError] = useState("");

  // 입력값 변경
  const updateForm = <K extends keyof ReportCreateForm>(
    key: K,
    value: ReportCreateForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError("");
  };

  // 접수번호 생성
  const generateReceiptNumber = () => {
    const lastNumber = Number(localStorage.getItem("lastReportNumber") ?? "0");

    const nextNumber = lastNumber + 1;

    const receiptNumber = `SKU${String(nextNumber).padStart(4, "0")}`;

    localStorage.setItem("lastReportNumber", String(nextNumber));

    return receiptNumber;
  };

  // 제보 제출
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 건물 선택 검사
    if (!form.building) {
      setError("건물을 선택해 주세요.");
      return;
    }

    // 층 선택 검사
    if (!form.floor) {
      setError("층을 선택해 주세요.");
      return;
    }

    // 세부 공간 입력 검사
    if (!form.space.trim()) {
      setError("세부 공간을 입력해 주세요.");
      return;
    }

    // 문제 내용 입력 검사
    if (!form.content.trim()) {
      setError("문제 내용을 입력해 주세요.");
      return;
    }

    // 접수번호 생성
    const receiptNumber = generateReceiptNumber();

    // 제보 접수 정보
    const submission: ReportSubmission = {
      receiptNumber,
      building: form.building,
      floor: form.floor,
      space: form.space.trim(),
      content: form.content.trim(),
    };

    // 제보 완료 페이지로 이동
    navigate("/reports/complete", {
      state: { submission },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7]">
      {/* 헤더 */}
      <header className="relative flex h-[68px] w-full items-center justify-center border-b border-[#E5E7EB] bg-white px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 cursor-pointer text-sm font-semibold text-[#3B8519]"
        >
          취소
        </button>

        <h1 className="text-lg font-bold text-[#111827]">제보하기</h1>
      </header>

      {/* 메인 */}
      <main className="mx-auto w-full max-w-[720px] px-5 py-8 sm:px-8 sm:py-10">
        <form onSubmit={handleSubmit} noValidate>
          {/* 장소 */}
          <section aria-labelledby="report-place-title" className="space-y-7">
            <h2
              id="report-place-title"
              className="text-lg font-bold text-[#111827]"
            >
              장소 <span className="text-[#3B8519]">*</span>
            </h2>

            {/* 건물 선택 */}
            <BuildingSelector
              value={form.building}
              onChange={(value) => updateForm("building", value)}
            />

            {/* 층 선택 */}
            <FloorSelector
              value={form.floor}
              onChange={(value) => updateForm("floor", value)}
            />

            {/* 세부 공간 입력 */}
            <ReportLocationInput
              value={form.space}
              onChange={(value) => updateForm("space", value)}
            />
          </section>

          {/* 문제 내용 */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[#111827]">
              문제 내용 <span className="text-[#3B8519]">*</span>
            </h2>

            <ReportContentInput
              value={form.content}
              onChange={(value) => updateForm("content", value)}
            />
          </section>

          {/* 사진 첨부 */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[#111827]">
              사진{" "}
              <span className="text-sm font-normal text-[#9CA3AF]">(선택)</span>
            </h2>

            <ReportImageUpload
              value={form.image}
              onChange={(value) => updateForm("image", value)}
            />

            <p className="mt-3 text-xs text-[#9CA3AF]">
              참고용으로 1장까지 첨부할 수 있습니다.
            </p>
          </section>

          {/* 오류 메시지 */}
          {error && (
            <p role="alert" className="mt-6 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="mt-10 flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#3B8519] text-base font-bold text-white transition-colors hover:bg-[#306D15]"
          >
            제출하기
          </button>
        </form>
      </main>
    </div>
  );
}
