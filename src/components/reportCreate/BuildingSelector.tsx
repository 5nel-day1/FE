import { BUILDINGS } from "../../mocks/reportCreate";

interface BuildingSelectorProps {
  value: string;
  onChange: (building: string) => void;
}

export default function BuildingSelector({
  value,
  onChange,
}: BuildingSelectorProps) {
  return (
    <div className="w-full min-w-0">
      {/* 건물 선택 안내 */}
      <p className="mb-3 text-sm font-medium text-[#9CA3AF]">
        건물
      </p>

      {/* 건물 선택 버튼 목록 */}
      <div className="flex flex-wrap gap-2.5">
        {BUILDINGS.map((building) => {
          const isSelected = value === building;

          return (
            <button
              key={building}
              type="button"
              onClick={() => onChange(building)}
              aria-pressed={isSelected}
              className={`cursor-pointer rounded-full border px-4 py-2 text-base font-semibold transition-colors ${
                isSelected
                  ? "border-[#3B8519] bg-[#3B8519] text-white"
                  : "border-[#D9D9D9] bg-white text-black hover:border-[#3B8519]"
              }`}
            >
              {building}
            </button>
          );
        })}
      </div>
    </div>
  );
}