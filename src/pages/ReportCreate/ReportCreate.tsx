import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import BuildingSelector from "../../components/reportCreate/BuildingSelector";
import FloorSelector from "../../components/reportCreate/FloorSelector";
import ReportLocationInput from "../../components/reportCreate/ReportLocationInput";
import ReportContentInput from "../../components/reportCreate/ReportContentInput";
import ReportImageUpload from "../../components/reportCreate/ReportImageUpload";

import { useReportStore } from "../../stores/useReportStore";

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

// 이미지 파일을 저장 가능한 문자열로 변환
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("이미지 변환에 실패했습니다."));
      }
    };

    reader.onerror = () => {
      reject(new Error("이미지를 읽을 수 없습니다."));
    };

    reader.readAsDataURL(file);
  });
};

export default function ReportCreate() {
  const navigate = useNavigate();

  const addReport = useReportStore((state) => state.addReport);

  const [form, setForm] = useState<ReportCreateForm>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

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

    setIsSubmitting(true);
    setError("");

    try {
      // 첨부한 사진을 Data URL로 변환
      const imageUrl = form.image
        ? await fileToDataUrl(form.image)
        : undefined;

      // 이미지까지 포함하여 제보 저장
      const createdReport = addReport({
        userId: 1,
        building: form.building,
        floor: form.floor,
        space: form.space.trim(),
        description: form.content.trim(),
        issueId: null,
        imageUrl,
      });

      const submission: ReportSubmission = {
        receiptNumber: createdReport.receiptNumber,
        building: createdReport.building,
        floor: createdReport.floor,
        space: createdReport.space,
        content: createdReport.description,
      };

      navigate("/reports/complete", {
        state: { submission },
      });
    } catch {
      setError(
        "사진을 저장하지 못했습니다. 이미지 크기를 줄이거나 다시 첨부해 주세요.",
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

        <h1 className="text-lg font-bold text-[#111827]">
          제보하기
        </h1>
      </header>

      {/* 메인 */}
      <main className="mx-auto w-full max-w-[720px] px-5 py-8 sm:px-8 sm:py-10">
        <form onSubmit={handleSubmit} noValidate>
          {/* 장소 */}
          <section
            aria-labelledby="report-place-title"
            className="space-y-7"
          >
            <h2
              id="report-place-title"
              className="text-lg font-bold text-[#111827]"
            >
              장소 <span className="text-[#3B8519]">*</span>
            </h2>

            <BuildingSelector
              value={form.building}
              onChange={(value) =>
                updateForm("building", value)
              }
            />

            <FloorSelector
              value={form.floor}
              onChange={(value) =>
                updateForm("floor", value)
              }
            />

            <ReportLocationInput
              value={form.space}
              onChange={(value) =>
                updateForm("space", value)
              }
            />
          </section>

          {/* 문제 내용 */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[#111827]">
              문제 내용 <span className="text-[#3B8519]">*</span>
            </h2>

            <ReportContentInput
              value={form.content}
              onChange={(value) =>
                updateForm("content", value)
              }
            />
          </section>

          {/* 사진 첨부 */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[#111827]">
              사진{" "}
              <span className="text-sm font-normal text-[#9CA3AF]">
                (선택)
              </span>
            </h2>

            <ReportImageUpload
              value={form.image}
              onChange={(value) =>
                updateForm("image", value)
              }
            />

            <p className="mt-3 text-xs text-[#9CA3AF]">
              참고용으로 1장까지 첨부할 수 있습니다.
            </p>
          </section>

          {/* 오류 메시지 */}
          {error && (
            <p
              role="alert"
              className="mt-6 text-sm font-medium text-red-600"
            >
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