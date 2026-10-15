import type { IssueAnalysis } from "../../types/adminDashboard";

interface SymptomCardProps {
  symptoms: IssueAnalysis["symptoms"];
}

const SymptomCard = ({ symptoms }: SymptomCardProps) => {
  return (
    <section className="w-full rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-5 sm:px-6">
      <h2 className="mb-4 text-[18px] font-bold text-[#13213C] sm:text-[20px]">
        주요 증상
      </h2>

      {symptoms.length === 0 ? (
        <p className="text-[14px] text-[#737373]">
          분석된 주요 증상이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {symptoms.map((symptom, index) => (
            <li
              key={`${symptom.label}-${index}`}
              className="flex items-start gap-2 text-[14px] text-[#333333] sm:text-[15px]"
            >
              <span
                aria-hidden="true"
                className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#A50000]"
              />

              <span className="min-w-0 flex-1 break-keep">
                {symptom.label}
              </span>

              {typeof symptom.count === "number" && (
                <span className="shrink-0 text-[13px] text-[#737373]">
                  {symptom.count}건
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SymptomCard;