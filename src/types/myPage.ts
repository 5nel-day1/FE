// 사용자 프로필
export interface UserProfile {
  name: string;
  department: string;
  studentId: string;
  email: string;
  role: "학생" | "관리자";
}

// 알림 설정
export interface NotificationSettings {
  statusChange: boolean;
  comment: boolean;
  resolution: boolean;
}