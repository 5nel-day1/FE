import { FLOORS } from "../../mocks/reportCreate";

interface FloorSelectorProps {
  value: string;
  onChange: (floor: string) => void;
}

export default function FloorSelector({
  value,
  onChange,
}: FloorSelectorProps) {
  return (
    <div className="w-full min-w-0">
      {/* 층 선택 안내 */}
      <p className="mb-3 text-sm font-medium text-[#9CA3AF]">
        층
      </p>

      {/* 층 선택 버튼 목록 */}
      <div className="flex flex-wrap gap-2.5">
        {FLOORS.map((floor) => {
          const isSelected = value === floor;

          return (
            <button
              key={floor}
              type="button"
              onClick={() => onChange(floor)}
              aria-pressed={isSelected}
              className={`cursor-pointer rounded-full border px-4 py-2 text-base font-semibold transition-colors ${
                isSelected
                  ? "border-[#3B8519] bg-[#3B8519] text-white"
                  : "border-[#D9D9D9] bg-white text-black hover:border-[#3B8519]"
              }`}
            >
              {floor}
            </button>
          );
        })}
      </div>
    </div>
  );
}