import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LoginResponseData } from "../types/auth";

type AuthUser = Pick<LoginResponseData, "id" | "name" | "role">;

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: LoginResponseData) => void;
  logout: () => void;
}

// 로그인 상태 관리
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // 로그인 성공 시 사용자 정보 저장
      login: ({ id, name, role, accessToken }) =>
        set({
          user: { id, name, role },
          accessToken,
          isAuthenticated: true,
        }),

      // 로그아웃 시 사용자 정보 초기화
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "catch-u-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);