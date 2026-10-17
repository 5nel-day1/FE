import { api } from "./api";

import type {
  AdminLoginRequest,
  AdminSignupRequest,
  LoginResponse,
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