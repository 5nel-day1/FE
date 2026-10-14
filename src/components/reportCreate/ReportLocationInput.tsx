interface ReportLocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReportLocationInput({
  value,
  onChange,
}: ReportLocationInputProps) {
  return (
    <div className="w-full min-w-0">
      {/* 세부 공간 입력 안내 */}
      <label
        htmlFor="report-location"
        className="mb-3 block text-sm font-medium text-[#9CA3AF]"
      >
        세부 공간
      </label>

      {/* 세부 공간 입력창 */}
      <input
        id="report-location"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 4층 여자 화장실, 201호 강의실"
        className="w-full min-w-0 rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#3B8519] focus:ring-1 focus:ring-[#3B8519]"
      />
    </div>
  );
}