import { api } from "./api";

import type {
  AdminLoginRequest,
  AdminSignupRequest,
  LoginResponse,
  LogoutResponse,
  SignupResponse,
  StudentLoginRequest,
  StudentSignupRequest,
} from "../types/auth";

// 학생 회원가입
export const signupStudent = async (
  data: StudentSignupRequest,
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(
    "/api/auth/signup/student",
    data,
  );
  return response.data;
};

// 관리자 회원가입
export const signupAdmin = async (
  data: AdminSignupRequest,
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(
    "/api/auth/signup/admin",
    data,
  );
  return response.data;
};

// 학생 로그인
export const loginStudent = async (
  data: StudentLoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login/student",
    data,
  );
  return response.data;
};

// 관리자 로그인
export const loginAdmin = async (
  data: AdminLoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login/admin",
    data,
  );
  return response.data;
};

// 로그아웃 (학생 및 관리자 공통)
export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/api/auth/logout");
  return response.data;
};