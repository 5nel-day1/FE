// 알림 설정
export interface NotificationSettings {
  statusAlarm: boolean;
  commentAlarm: boolean;
  solvedAlarm: boolean;
}

// 알림 설정 변경 API 응답
export interface UpdateNotificationResponse {
  success: boolean;
  code: number;
  message: string;
  data: NotificationSettings | null;
}

export interface MyPageUser {
  commentAlarm: boolean;
  department: string;
  email: string;
  name: string;
  role: string;
  solvedAlarm: boolean;
  solvedReports: number;
  statusAlarm: boolean;
  studentId: string;
  totalReports: number;
}

export interface MyPageResponse {
  success: boolean;
  code: number;
  message: string;
  data: MyPageUser;
}