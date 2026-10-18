import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../api/api";
import {
  getIssueGroups,
  getIssueGroupDetail,
} from "../../api/issueGroups";

import ReportStatus from "../common/ReportStatus/ReportStatus";

type ReportStatusCode =
  | "RECEIVED"
  | "CHECKING"
  | "IN_PROGRESS"
  | "RESOLVED";

interface RecentReport {
  id: number;
  issueGroupId?: number | null;
  title: string;
  content: string;
  createdAt: string;
  status: ReportStatusCode;
  receiptNumber: string;
}

interface ReportsResponse {
  success: boolean;
  code: number;
  message: string;
  data: RecentReport[];
}

interface GroupMatch {
  id: number;
  status: ReportStatusCode;
  title: string;
  reportContents: string[];
}

const STATUS_LABELS: Record<
  ReportStatusCode,
  "접수" | "확인 중" | "처리 중" | "해결 완료"
> = {
  RECEIVED: "접수",
  CHECKING: "확인 중",
  IN_PROGRESS: "처리 중",
  RESOLVED: "해결 완료",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString.replace("T", " ");
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day} ${hours}:${minutes}`;
};

const normalizeText = (value: string) => {
  return value.replace(/\s+/g, "").toLowerCase();
};

// 개별 제보가 속한 문제 그룹 찾기
const findMatchedGroup = (
  report: RecentReport,
  groups: GroupMatch[],
): GroupMatch | null => {
  // 1. issueGroupId가 있다면 ID로 연결
  if (
    typeof report.issueGroupId === "number" &&
    report.issueGroupId > 0
  ) {
    return (
      groups.find((group) => group.id === report.issueGroupId) ??
      null
    );
  }

  // 2. issueGroupId가 없다면 제보 제목과 내용으로 연결
  const normalizedContent = normalizeText(report.content);
  const normalizedTitle = normalizeText(report.title);

  const matches = groups.filter((group) => {
    const isSameTitle =
      normalizeText(group.title) === normalizedTitle;

    const isSameContent = group.reportContents.some(
      (content) =>
        normalizeText(content) === normalizedContent,
    );

    return isSameTitle && isSameContent;
  });

  // 정확히 하나의 그룹과 연결되는 경우에만 사용
  return matches.length === 1 ? matches[0] : null;
};

const RecentReportList = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<RecentReport[]>([]);
  const [groups, setGroups] = useState<GroupMatch[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 최근 제보 및 문제 그룹 조회
  useEffect(() => {
    let active = true;

    const fetchReports = async () => {
      try {
        // 개별 제보 목록 + 전체 문제 그룹 목록 조회
        const [reportsResponse, groupsResponse] =
          await Promise.all([
            api.get<ReportsResponse>("/api/reports"),
            getIssueGroups(),
          ]);

        if (!active) return;

        if (
          !reportsResponse.data.success ||
          !Array.isArray(reportsResponse.data.data)
        ) {
          throw new Error(
            reportsResponse.data.message ||
              "최근 제보를 불러오지 못했습니다.",
          );
        }

        if (
          !groupsResponse.success ||
          !Array.isArray(groupsResponse.data)
        ) {
          throw new Error(
            groupsResponse.message ||
              "문제 그룹 목록을 불러오지 못했습니다.",
          );
        }

        // 각 문제 그룹의 상세 정보 조회
        const details = await Promise.all(
          groupsResponse.data.map(async (group) => {
            try {
              const response = await getIssueGroupDetail(
                group.id,
              );

              if (
                !response.success ||
                !response.data
              ) {
                return null;
              }

              return {
                id: group.id,
                title: response.data.title,
                status: response.data.status,
                reportContents:
                  response.data.reportContents ?? [],
              } as GroupMatch;
            } catch (detailError) {
              console.error(
                "문제 그룹 상세 조회 실패:",
                detailError,
              );

              return null;
            }
          }),
        );

        if (!active) return;

        const validGroups = details.filter(
          (group): group is GroupMatch =>
            group !== null,
        );

        setReports(reportsResponse.data.data);
        setGroups(validGroups);
        setError("");
      } catch (fetchError) {
        if (!active) return;

        console.error(
          "최근 제보 조회 실패:",
          fetchError,
        );

        setError(
          "최근 제보를 불러오지 못했습니다.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchReports();

    return () => {
      active = false;
    };
  }, []);

  // 최근 제보 클릭 시 연결된 문제 그룹 상세로 이동
  const handleReportClick = (report: RecentReport) => {
    const matchedGroup = findMatchedGroup(
      report,
      groups,
    );

    if (matchedGroup) {
      navigate(
        `/admin/problems/${matchedGroup.id}`,
      );
      return;
    }

    window.alert(
      "해당 제보와 정확히 연결되는 문제 그룹을 찾지 못했습니다.",
    );
  };

  // 문제 그룹의 상태를 기준으로 해결 완료 제보 제외
  const activeReports = reports
    .filter((report) => {
      const matchedGroup = findMatchedGroup(
        report,
        groups,
      );

      const currentStatus =
        matchedGroup?.status ?? report.status;

      return currentStatus !== "RESOLVED";
    })
    .sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
    .slice(0, 6);

  return (
    <section
      className="w-full"
      aria-labelledby="recent-reports-heading"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="recent-reports-heading"
          className="text-[20px] font-bold text-[#13213C]"
        >
          최근 제보
        </h2>

        <span className="text-[12px] text-[#6B7280]">
          최신 {activeReports.length}건
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
          최근 제보를 불러오는 중입니다.
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-red-600"
        >
          {error}
        </div>
      ) : activeReports.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
          현재 확인할 제보가 없습니다.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          {activeReports.map((report, index) => {
            // 해당 제보와 연결된 문제 그룹
            const matchedGroup = findMatchedGroup(
              report,
              groups,
            );

            // 문제 그룹 상태 우선 사용
            const displayStatus =
              matchedGroup?.status ?? report.status;

            return (
              <button
                key={report.id}
                type="button"
                onClick={() => {
                  handleReportClick(report);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F8FAFC] sm:px-5 ${
                  index !== activeReports.length - 1
                    ? "border-b border-[#EEF0F2]"
                    : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#13213C] sm:text-[16px]">
                    {report.title} / {report.content}
                  </p>

                  <time
                    dateTime={report.createdAt}
                    className="mt-1 block text-[13px] text-[#737373] sm:text-[14px]"
                  >
                    {formatDate(report.createdAt)}
                  </time>
                </div>

                <div className="ml-auto shrink-0">
                  <ReportStatus
                    status={STATUS_LABELS[displayStatus]}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentReportList;