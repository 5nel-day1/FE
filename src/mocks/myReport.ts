import type { Report } from "../types/report";

export const myReports: Report[] = [
  {
    id: 1,
    building: "유담관",
    floor: "4층",
    space: "화장실",
    description: "세면대 물이 너무 천천히 내려가요.",
    status: "접수",
    createdAt: "2026-10-10T08:55:00",
  },
  {
    id: 2,
    building: "본관",
    floor: "2층",
    space: "201호 강의실",
    description: "냉방이 너무 약합니다.",
    status: "확인 중",
    createdAt: "2026-10-10T11:02:00",
  },
  {
    id: 3,
    building: "문예관",
    floor: "1층",
    space: "복도",
    description: "복도 불이 계속 깜빡거려요.",
    status: "해결 완료",
    createdAt: "2026-10-10T18:30:00",
  },
  {
    id: 4,
    building: "청운관",
    floor: "1층",
    space: "화장실",
    description: "휴지가 부족합니다.",
    status: "처리 중",
    createdAt: "2026-10-10T11:02:00",
  },
];
