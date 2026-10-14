import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface ReportImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function ReportImageUpload({
  value,
  onChange,
}: ReportImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* 사진 첨부 안내 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label
          htmlFor="report-image"
          className="text-sm font-medium text-[#9CA3AF]"
        >
          사진 첨부
        </label>

        <span className="text-xs text-[#9CA3AF]">
          선택 사항 · 최대 1장
        </span>
      </div>

      {/* 실제 파일 입력 */}
      <input
        ref={inputRef}
        id="report-image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      {/* 사진 미리보기 또는 추가 버튼 */}
      {previewUrl ? (
        <div className="relative inline-block max-w-full">
          <img
            src={previewUrl}
            alt="첨부한 제보 사진 미리보기"
            className="h-32 w-40 max-w-full rounded-xl border border-[#D9D9D9] object-cover"
          />

          {/* 사진 삭제 */}
          <button
            type="button"
            onClick={handleRemove}
            aria-label="첨부 사진 삭제"
            className="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#374151] text-lg leading-none text-white"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-40 max-w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D9D9D9] bg-white text-[#9CA3AF] transition-colors hover:border-[#3B8519] hover:text-[#3B8519]"
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            +
          </span>

          <span className="text-xs">
            사진 추가
          </span>
        </button>
      )}
    </div>
  );
}