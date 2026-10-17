import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BuildingSelector from "../../components/reportCreate/BuildingSelector";
import FloorSelector from "../../components/reportCreate/FloorSelector";
import ReportLocationInput from "../../components/reportCreate/ReportLocationInput";
import ReportContentInput from "../../components/reportCreate/ReportContentInput";
import ReportImageUpload from "../../components/reportCreate/ReportImageUpload";

import { createReport } from "../../api/reports";

import type {
  ReportCreateForm,
  ReportSubmission,
} from "../../types/reportCreate";

// 초기 입력값
const initialForm: ReportCreateForm = {
  building: "",
  floor: "",
  space: "",
  content: "",
  image: null,
};

// 건물명 → 백엔드 Enum 코드
const BUILDING_CODES: Record<string, string> = {
  유담관: "YUDAM",
  본관: "MAIN",
  문예관: "MOONAE",
  청운관: "CHEONGUN",
  혜인관: "HEEIN",
  북악관: "BUKGWAK",
  은주1관: "EUNJU1",
  한림관: "HANLIM",
  수인관: "SUIN",
  기타: "ETC",
};

// 층 → 백엔드 Enum 코드
const FLOOR_CODES: Record<string, string> = {
  B1층: "B1",
  "지하 1층": "B1",
  "1층": "F1",
  "2층": "F2",
  "3층": "F3",
  "4층": "F4",
  "5층": "F5",
  "6층": "F6",
  "7층": "F7",
  "8층": "F8",
  기타: "ETC",
};

export default function ReportCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ReportCreateForm>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 업데이트
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

  // 제보 등록
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    // 필수 입력값 검증
    if (!form.building) {
      setError("건물을 선택해 주세요.");
      return;
    }

    if (!form.floor) {
      setError("층을 선택해 주세요.");
      return;
    }

    if (!form.space.trim()) {
      setError("세부 공간을 입력해 주세요.");
      return;
    }

    if (!form.content.trim()) {
      setError("문제 내용을 입력해 주세요.");
      return;
    }

    // 백엔드 Enum 코드 변환
    const buildingCode = BUILDING_CODES[form.building];
    const floorCode = FLOOR_CODES[form.floor];

    if (!buildingCode || !floorCode) {
      setError("건물 또는 층 선택값이 올바르지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 이미지 업로드 API가 아직 없어 사진 첨부 시 등록 제한
      if (form.image) {
        setError(
          "현재 이미지 업로드 API가 없어 사진을 등록할 수 없습니다. 사진을 제거하고 제보해 주세요.",
        );
        return;
      }

      // 제보 등록 API 호출
      const response = await createReport({
        building: buildingCode,
        floor: floorCode,
        spaceDetail: form.space.trim(),
        content: form.content.trim(),
        photoUrl: "",
      });

      // 등록 실패
      if (!response.success || !response.data) {
        setError(response.message || "제보 등록에 실패했습니다.");
        return;
      }

      // 서버에서 반환한 접수번호 사용
      const submission: ReportSubmission = {
        receiptNumber: response.data.receiptNumber,
        building: form.building,
        floor: form.floor,
        space: form.space.trim(),
        content: form.content.trim(),
      };

      // 제보 완료 페이지 이동
      navigate("/reports/complete", {
        state: { submission },
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError(
        typeof message === "string" && message.trim()
          ? message
          : "제보 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

            <BuildingSelector
              value={form.building}
              onChange={(value) => updateForm("building", value)}
            />

            <FloorSelector
              value={form.floor}
              onChange={(value) => updateForm("floor", value)}
            />

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
            disabled={isSubmitting}
            className="mt-10 flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#3B8519] text-base font-bold text-white transition-colors hover:bg-[#306D15] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </button>
        </form>
      </main>
    </div>
  );
}
