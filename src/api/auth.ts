import { api } from "./api";

import type {
  AdminSignupRequest,
  SignupResponse,
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
