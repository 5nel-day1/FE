// 학생 회원가입 요청
export interface StudentSignupRequest {
  name: string;
  studentId: string;
  department: string;
  email: string;
  password: string;
  passwordConfirm: string;
  termsAgreed: boolean;
}

// 관리자 회원가입 요청
export interface AdminSignupRequest {
  name: string;
  adminCode: string;
  department: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  termsAgreed: boolean;
}

// 회원가입 응답 데이터
export interface SignupData {
  id: number;
  name: string;
  role: "STUDENT" | "ADMIN";
  accessToken: string;
}

// 회원가입 API 응답
export interface SignupResponse {
  success: boolean;
  code: number;
  message: string;
  data: SignupData;
}