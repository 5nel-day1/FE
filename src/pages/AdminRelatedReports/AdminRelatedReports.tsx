import { useNavigate, useParams } from "react-router-dom";

import { campusIssues } from "../../mocks/campusIssues";
import { getReportsByIssueId } from "../../mocks/reports";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

const formatDate = (dateString: string) => {
  const [date, time = ""] = dateString.split("T");

  const [, month, day] = date.split("-");

  return `${month}.${day} ${time.slice(0, 5)}`;
};

const AdminRelatedReports = () => {
  const navigate = useNavigate();

  const { problemId } = useParams<{ problemId: string }>();

  const issueId = Number(problemId);

  // 문제 정보
  const issue = campusIssues.find((item) => item.id === issueId);

  // 해당 문제에 연결된 전체 제보
  const reports = getReportsByIssueId(issueId);

  if (!issue) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F6]">
        <div className="text-center">
          <p className="text-[16px] text-[#737373]">
            존재하지 않는 문제입니다.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="mt-5 rounded-xl bg-[#3B8519] px-5 py-3 text-white"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-[#F7F8F6]">
      
      <CommonHeader img={backButton} title="관련 제보" />

      {/* 본문 */}
      <div className="mx-auto w-full max-w-[900px] px-5 pb-12 pt-7 sm:px-7">
        {/* 문제 정보 */}
        <p className="mb-4 text-[14px] text-[#737373]">
          {issue.building} {issue.floor} {issue.space}
          {" · "}
          {issue.category}
          {" · "}
          {reports.length}건
        </p>

        {/* 제보 목록 */}
        {reports.length === 0 ? (
          <div className="rounded-[20px] border border-[#D9D9D9] bg-white px-5 py-12 text-center">
            <p className="text-[14px] text-[#737373]">
              등록된 관련 제보가 없습니다.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[20px] border border-[#D9D9D9] bg-white">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className={`px-4 py-4 sm:px-5 ${
                  index !== reports.length - 1
                    ? "border-b border-[#D9D9D9]"
                    : ""
                }`}
              >
                {/* 제보 내용 */}
                <p className="break-keep text-[14px] font-semibold leading-6 text-black sm:text-[15px]">
                  {index + 1}. {report.description}
                </p>

                {/* 접수 번호 및 날짜 */}
                <p className="mt-1 text-[13px] text-[#737373]">
                  S-{String(report.id).padStart(4, "0")}
                  {" · "}
                  {formatDate(report.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 안내 문구 */}
        <p className="mt-3 pl-3 text-[12px] text-[#737373]">
          제보자 정보는 표시되지 않습니다.
        </p>
      </div>
    </main>
  );
};

export default AdminRelatedReports;