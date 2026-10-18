import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getIssueGroupDetail } from "../../api/issueGroups";
import type { IssueGroupDetail } from "../../types/issueGroup";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";

const AdminRelatedReports = () => {
  const navigate = useNavigate();

  const { problemId } = useParams<{ problemId: string }>();

  const issueId = Number(problemId);

  // 문제 그룹 상세 데이터
  const [groupDetail, setGroupDetail] =
    useState<IssueGroupDetail | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // 실제 문제 그룹 상세 API 조회
  useEffect(() => {
    if (
      !problemId ||
      !/^\d+$/.test(problemId) ||
      !Number.isSafeInteger(issueId) ||
      issueId <= 0
    ) {
      setGroupDetail(null);
      setError("존재하지 않는 문제입니다.");
      setLoading(false);
      return;
    }

    let active = true;

    setGroupDetail(null);
    setLoading(true);
    setError("");

    const fetchRelatedReports = async () => {
      try {
        const response = await getIssueGroupDetail(issueId);

        if (!active) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "관련 제보 조회에 실패했습니다.",
          );
        }

        setGroupDetail(response.data);
      } catch (error) {
        if (!active) return;

        console.error("관련 제보 조회 실패:", error);

        setError("관련 제보를 불러오지 못했습니다.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchRelatedReports();

    return () => {
      active = false;
    };
  }, [problemId, issueId]);

  // 로딩 및 오류 처리
  if (loading || error || !groupDetail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F6]">
        <div className="text-center">
          <p className="text-[16px] text-[#737373]">
            {loading
              ? "관련 제보를 불러오는 중입니다."
              : error || "존재하지 않는 문제입니다."}
          </p>

          {!loading && (
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="mt-5 rounded-xl bg-[#3B8519] px-5 py-3 text-white"
            >
              대시보드로 돌아가기
            </button>
          )}
        </div>
      </main>
    );
  }

  // 해당 문제 그룹에 연결된 전체 제보
  const reports = groupDetail.reportContents ?? [];

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-[#F7F8F6]">
      <CommonHeader img={backButton} title="관련 제보" />

      {/* 본문 */}
      <div className="mx-auto w-full max-w-[900px] px-5 pb-12 pt-7 sm:px-7">
        {/* 문제 정보 */}
        <p className="mb-4 text-[14px] text-[#737373]">
          {groupDetail.building} {groupDetail.floor}{" "}
          {groupDetail.facility}
          {" · "}
          {groupDetail.problemType}
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
            {reports.map((description, index) => (
              <div
                key={`${index}-${description}`}
                className={`px-4 py-4 sm:px-5 ${
                  index !== reports.length - 1
                    ? "border-b border-[#D9D9D9]"
                    : ""
                }`}
              >
                {/* 제보 내용 */}
                <p className="break-keep text-[14px] font-semibold leading-6 text-black sm:text-[15px]">
                  {index + 1}. {description}
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