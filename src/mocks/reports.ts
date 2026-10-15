import type { Report } from "../types/report";

// 학생·관리자 공통 제보 타입
export interface CampusReport extends Report {
  userId: number;
  issueId: number;
  aiSummary: string;
}

// 학교 전체 학생 제보 목업 데이터
export const reports: CampusReport[] = [
  // 유담관 4층 화장실 - 배수 관련 (8건)
  {
    id: 1,
    userId: 1,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 물이 너무 천천히 내려가요.",
    aiSummary: "세면대 배수 속도가 느림",
    status: "접수",
    createdAt: "2026-10-10T08:55:00",
  },
  {
    id: 5,
    userId: 2,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대에 물이 고여 있어요.",
    aiSummary: "세면대 물 고임 현상",
    status: "처리 중",
    createdAt: "2026-10-10T15:05:00",
  },
  {
    id: 6,
    userId: 3,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "물이 잘 내려가지 않아요.",
    aiSummary: "배수구 배수 불량",
    status: "처리 중",
    createdAt: "2026-10-10T13:48:00",
  },
  {
    id: 7,
    userId: 4,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 물이 계속 차올라요.",
    aiSummary: "세면대 물 역류 우려",
    status: "처리 중",
    createdAt: "2026-10-10T12:30:00",
  },
  {
    id: 8,
    userId: 5,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 배수가 막힌 것 같아요.",
    aiSummary: "세면대 배수 막힘 의심",
    status: "처리 중",
    createdAt: "2026-10-10T10:12:00",
  },
  {
    id: 9,
    userId: 6,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "물이 빠지는 데 시간이 오래 걸려요.",
    aiSummary: "배수 지연 반복",
    status: "처리 중",
    createdAt: "2026-10-09T17:45:00",
  },
  {
    id: 10,
    userId: 7,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 사용 후 물이 남아 있어요.",
    aiSummary: "세면대 잔수 발생",
    status: "처리 중",
    createdAt: "2026-10-09T15:30:00",
  },
  {
    id: 11,
    userId: 8,
    issueId: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 물이 거의 안 빠집니다.",
    aiSummary: "세면대 배수 장애",
    status: "처리 중",
    createdAt: "2026-10-08T14:20:00",
  },

  // 본관 2층 201호 강의실 - 냉난방 (5건)
  {
    id: 2,
    userId: 1,
    issueId: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "냉방이 너무 약합니다.",
    aiSummary: "강의실 냉방 성능 저하",
    status: "확인 중",
    createdAt: "2026-10-10T11:02:00",
  },
  {
    id: 12,
    userId: 2,
    issueId: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "에어컨 바람이 약해요.",
    aiSummary: "에어컨 풍량 부족",
    status: "확인 중",
    createdAt: "2026-10-10T14:20:00",
  },
  {
    id: 13,
    userId: 3,
    issueId: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "강의실이 너무 더워요.",
    aiSummary: "강의실 냉방 부족",
    status: "확인 중",
    createdAt: "2026-10-10T09:30:00",
  },
  {
    id: 14,
    userId: 4,
    issueId: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "에어컨을 켜도 시원하지 않아요.",
    aiSummary: "냉방 효과 저하",
    status: "확인 중",
    createdAt: "2026-10-09T12:10:00",
  },
  {
    id: 15,
    userId: 5,
    issueId: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "냉방 온도가 잘 내려가지 않아요.",
    aiSummary: "실내 온도 조절 불량",
    status: "확인 중",
    createdAt: "2026-10-08T11:00:00",
  },

  // 청운관 B1 열람실 - 조명 고장 (3건)
  {
    id: 16,
    userId: 2,
    issueId: 3,
    building: "청운관",
    floor: "B1",
    space: "열람실",
    description: "열람실 조명이 켜지지 않아요.",
    aiSummary: "열람실 조명 점등 불량",
    status: "접수",
    createdAt: "2026-10-10T08:20:00",
  },
  {
    id: 17,
    userId: 3,
    issueId: 3,
    building: "청운관",
    floor: "B1",
    space: "열람실",
    description: "조명이 자꾸 꺼져요.",
    aiSummary: "열람실 조명 반복 소등",
    status: "접수",
    createdAt: "2026-10-09T16:10:00",
  },
  {
    id: 18,
    userId: 4,
    issueId: 3,
    building: "청운관",
    floor: "B1",
    space: "열람실",
    description: "일부 자리 조명이 고장 났어요.",
    aiSummary: "열람실 일부 조명 고장",
    status: "접수",
    createdAt: "2026-10-08T10:40:00",
  },

  // 문예관 1층 복도 - 조명 (3건)
  {
    id: 3,
    userId: 1,
    issueId: 4,
    building: "문예관",
    floor: "1층",
    space: "복도",
    description: "복도 불이 계속 깜빡거려요.",
    aiSummary: "복도 조명 깜빡임 발생",
    status: "해결 완료",
    createdAt: "2026-10-09T13:20:00",
    resolution: "조명 교체 완료",
    resolvedAt: "2026-10-10T09:00:00",
  },
  {
    id: 19,
    userId: 2,
    issueId: 4,
    building: "문예관",
    floor: "1층",
    space: "복도",
    description: "복도 조명이 불규칙하게 깜빡입니다.",
    aiSummary: "복도 조명 점멸 이상",
    status: "해결 완료",
    createdAt: "2026-10-09T10:00:00",
    resolution: "조명 교체 완료",
    resolvedAt: "2026-10-10T09:00:00",
  },
  {
    id: 20,
    userId: 3,
    issueId: 4,
    building: "문예관",
    floor: "1층",
    space: "복도",
    description: "복도 불빛이 자주 꺼집니다.",
    aiSummary: "복도 조명 간헐적 소등",
    status: "해결 완료",
    createdAt: "2026-10-08T16:30:00",
    resolution: "조명 교체 완료",
    resolvedAt: "2026-10-10T09:00:00",
  },

  // 본관 1층 화장실 - 위생 (2건)
  {
    id: 4,
    userId: 1,
    issueId: 5,
    building: "본관",
    floor: "1층",
    space: "화장실",
    description: "화장실 휴지가 부족합니다.",
    aiSummary: "화장실 소모품 보충 필요",
    status: "처리 중",
    createdAt: "2026-10-10T09:10:00",
  },
  {
    id: 21,
    userId: 2,
    issueId: 5,
    building: "본관",
    floor: "1층",
    space: "화장실",
    description: "화장실 휴지가 비어 있어요.",
    aiSummary: "화장실 휴지 보충 필요",
    status: "해결 완료",
    createdAt: "2026-10-09T09:15:00",
    resolution: "소모품 보충 완료",
    resolvedAt: "2026-10-10T10:00:00",
  },

  // 학생회관 2층 휴게실 - 위생 (3건)
  {
    id: 22,
    userId: 2,
    issueId: 6,
    building: "학생회관",
    floor: "2층",
    space: "휴게실",
    description: "휴게실 쓰레기통이 가득 찼어요.",
    aiSummary: "휴게실 쓰레기통 수거 필요",
    status: "해결 완료",
    createdAt: "2026-10-09T14:10:00",
    resolution: "쓰레기 수거 완료",
    resolvedAt: "2026-10-10T10:30:00",
  },
  {
    id: 23,
    userId: 3,
    issueId: 6,
    building: "학생회관",
    floor: "2층",
    space: "휴게실",
    description: "휴게실 바닥이 지저분합니다.",
    aiSummary: "휴게실 바닥 청소 필요",
    status: "해결 완료",
    createdAt: "2026-10-08T13:05:00",
    resolution: "청소 완료",
    resolvedAt: "2026-10-10T10:30:00",
  },
  {
    id: 24,
    userId: 4,
    issueId: 6,
    building: "학생회관",
    floor: "2층",
    space: "휴게실",
    description: "휴게실에 쓰레기가 쌓여 있어요.",
    aiSummary: "휴게실 쓰레기 적치",
    status: "해결 완료",
    createdAt: "2026-10-08T09:50:00",
    resolution: "쓰레기 수거 완료",
    resolvedAt: "2026-10-10T10:30:00",
  },
];

// 최신 제보 6개
export const recentReports = [...reports]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 6);

// 특정 통합 문제와 연결된 전체 제보
export const getReportsByIssueId = (
  issueId: number
): CampusReport[] => {
  return reports
    .filter((report) => report.issueId === issueId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
};