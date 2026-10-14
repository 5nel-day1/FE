import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Button from "../../components/common/button/Button";
import ReportStatus from "../../components/common/ReportStatus/ReportStatus";
import { myReports } from "../../mocks/myReport";
import { useState } from "react";
import CampusIssueFilter, {
  type IssueFilter,
} from "../../components/campus/CampusIssueFilter";
import { campusIssues } from "../../mocks/campusIssues";
import CampusIssueCard from "../../components/campus/CampusIssueCard";

export default function Home() {
  // 진행 중인 제보 중 최신 2개만 표시
  const recentReports = myReports
    .filter((report) => report.status !== "해결 완료")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 2);

  const [selectedFilter, setSelectedFilter] = useState<IssueFilter>("전체");
  const filteredIssues =
    selectedFilter === "전체"
      ? campusIssues
      : campusIssues.filter((issue) => issue.status === selectedFilter);

  return (
    <div className="min-h-screen pb-[73px] mb-5">
      <Header />

      <main className="w-full px-4 sm:px-6 lg:px-8">
        {/* 안내 문구 + 제보하기 */}
        <section className="mt-[21px] w-full rounded-[20px] border border-[#D9D9D9] bg-white p-4 sm:p-6 lg:p-8 flex flex-col items-start gap-[10px] lg:gap-4">
          <p className="text-black text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
            캠퍼스 시설 · 위생 불편을
            <br />
            제보해 주십시오.
          </p>

          <p className="text-[#727070] text-xs sm:text-sm lg:text-base font-normal leading-relaxed">
            접수된 제보는 AI가 분석하여 같은 문제끼리 묶은 뒤 시설관리팀에
            전달됩니다.
          </p>

          <Button title="제보하기" />
        </section>

        {/* 진행 중인 내 제보 */}
        <section className="mt-5 w-full flex flex-col gap-[9px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-black text-sm font-bold sm:text-base lg:text-xl">
              진행 중인 내 제보
            </p>

            <p className="text-[#3B8519] text-xs font-semibold sm:text-sm lg:text-base">
              전체보기
            </p>
          </div>

          {/* 제보 목록 */}
          <div className="w-full overflow-hidden rounded-[20px] border border-[#D9D9D9] bg-white">
            {recentReports.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#727070]">
                진행 중인 제보가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-[#D9D9D9]">
                {recentReports.map((report) => (
                  <li
                    key={report.id}
                    className="flex min-w-0 items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5"
                  >
                    {/* 제보 장소 + 내용 */}
                    <div className="min-w-0 flex-1 gap-1">
                      <p className="text-sm font-semibold text-black sm:text-base lg:text-lg">
                        {report.building} {report.floor} {report.space}
                      </p>

                      <p className="text-xs font-medium text-[#B0B0B0] sm:text-sm lg:text-base">
                        {report.description}
                      </p>
                    </div>

                    {/* 제보 처리 상태 */}
                    <ReportStatus status={report.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 캠퍼스 문제 현황 */}
        <section className="mt-[31px] w-full">
          <h2 className="text-sm font-bold text-black sm:text-base lg:text-xl">
            캠퍼스 문제 현황
          </h2>

          {/* 상태별 필터 */}
          <div className="mt-3">
            <CampusIssueFilter
              issues={campusIssues}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* 문제 현황 카드 목록 */}
          <div className="mt-3 flex flex-col gap-[10px]">
            {filteredIssues.map((issue) => (
              <CampusIssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
        <p className="mt-3 w-full text-xs leading-relaxed text-[#727070] sm:text-sm lg:text-base">
          개별 제보 내용과 제보자 정보는 공개되지 않으며, 같은 문제로 묶인
          현황만 표시됩니다.
        </p>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Footer />
      </div>
    </div>
  );
}
