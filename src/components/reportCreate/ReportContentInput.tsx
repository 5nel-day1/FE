interface ReportContentInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 300;

export default function ReportContentInput({
  value,
  onChange,
}: ReportContentInputProps) {
  return (
    <div className="w-full min-w-0">
      {/* 문제 내용 입력 안내 */}
      <label
        htmlFor="report-content"
        className="mb-3 block text-sm font-medium text-[#9CA3AF]"
      >
        문제 내용
      </label>

      {/* 문제 내용 입력창 */}
      <div className="rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 focus-within:border-[#3B8519] focus-within:ring-1 focus-within:ring-[#3B8519]">
        <textarea
          id="report-content"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={5}
          placeholder="어떤 문제가 발생했나요? 상황을 자세히 적어주세요."
          className="block w-full min-w-0 resize-none bg-transparent text-sm leading-relaxed text-[#111827] outline-none placeholder:text-[#9CA3AF]"
        />

        {/* 글자 수 표시 */}
        <p className="mt-2 text-right text-xs text-[#9CA3AF]">
          {value.length}/{MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}