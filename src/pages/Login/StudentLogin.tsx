import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/icons/sku_logo.png";
import Button from "../../components/common/button/Button";

import { loginStudent } from "../../api/auth";
import { useAuthStore } from "../../stores/useAuthStore";

export default function StudentLogin() {
  const navigate = useNavigate();

  const saveLogin = useAuthStore((state) => state.login);

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 학생 로그인
  const handleLogin = async () => {
    if (isSubmitting) return;

    // 필수 입력값 검증
    if (!studentId.trim()) {
      setToastMessage("학번을 입력해 주세요.");
      return;
    }

    if (!password) {
      setToastMessage("비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setToastMessage("");

    try {
      const response = await loginStudent({
        studentId: studentId.trim(),
        password,
      });

      if (!response.success || response.data?.role !== "STUDENT") {
        setToastMessage(response.message || "학생 로그인에 실패했습니다.");
        return;
      }

      // 로그인 정보 저장
      saveLogin(response.data);

      // 학생 홈으로 이동
      navigate("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setToastMessage(
          error.response?.data?.message ||
            "로그인에 실패했습니다. 다시 시도해 주세요.",
        );
      } else {
        setToastMessage("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-5 py-10">
      {/* 로고 */}
      <img
        src={logo}
        alt="서경대학교 로고"
        className="mt-20 sm:mt-10 max-w-full h-auto"
      />

      {/* 서비스명 + 한 줄 소개 */}
      <div className="text-black text-3xl font-extrabold mt-[13px]">CatchU</div>

      <div className="text-[#727070] text-sm font-medium mt-[9px]">
        서경대학교 캠퍼스 시설 · 위생 제보
      </div>

      {/* 학생 or 관리자 선택 */}
      <div className="relative w-[329px] h-13 bg-[#D9D9D9] rounded-[10px] mt-[17px]">
        {/* 학생 */}
        <div className="w-[151px] h-[38px] bg-white rounded-[10px] absolute left-[12px] top-[7px] flex justify-center items-center">
          <p className="text-black text-base font-bold">학생</p>
        </div>

        {/* 관리자 */}
        <div
          onClick={() => navigate("/admin/login")}
          className="cursor-pointer text-[#4C4949] text-base font-semibold absolute left-[225px] top-[13px]"
        >
          관리자
        </div>
      </div>

      {/* 학번 입력 */}
      <div className="w-full max-w-[339px] h-21 p-1 flex flex-col justify-start items-start gap-2 mt-[27px]">
        <p className="text-[#727070] text-sm font-semibold">학번</p>

        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          autoComplete="username"
          className="w-[331px] h-[50px] pl-[10px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] text-black text-sm font-medium"
          placeholder="예: 2023123456"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="w-full max-w-[339px] h-21 p-1 flex flex-col justify-start items-start gap-2 mt-[18px]">
        <p className="text-[#727070] text-sm font-semibold">비밀번호</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleLogin();
            }
          }}
          autoComplete="current-password"
          className="w-[331px] h-[50px] pl-[10px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] text-black text-sm font-medium"
          placeholder="비밀번호를 입력해주세요."
        />
      </div>

      {/* 회원가입 */}
      <div className="flex gap-[3px] mt-[14px] mb-[118px]">
        <p className="text-[#999292] text-xs font-medium">계정이 없으신가요?</p>

        <a href="/signup" className="text-[#3B8519] text-xs font-semibold">
          회원가입
        </a>
      </div>

      {/* 로그인 버튼 */}
      <div
        className={`w-[339px] ${
          isSubmitting ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <Button
          title={isSubmitting ? "로그인 중..." : "로그인"}
          onClick={() => void handleLogin()}
        />
      </div>

      {/* 오류 토스트 */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#13213C] px-5 py-3 text-sm text-white shadow-lg whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
