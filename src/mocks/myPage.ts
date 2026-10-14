import type {
  UserProfile,
  NotificationSettings,
} from "../types/myPage";

// 사용자 프로필 목데이터
export const userProfile: UserProfile = {
  name: "김서경",
  department: "소프트웨어학과",
  studentId: "2023123456",
  email: "sk2023@skuniv.ac.kr",
  role: "학생",
};

// 알림 설정 목데이터
export const notificationSettings: NotificationSettings = {
  statusChange: true,
  comment: true,
  resolution: false,
};