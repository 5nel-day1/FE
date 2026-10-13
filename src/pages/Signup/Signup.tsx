import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";
import Button from "../../components/common/button/Button";

type OptionProps = {
  role: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
};

function Option({ role, text, selected, onSelect }: OptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex-1 min-w-0 min-h-[83px] px-2.5 py-3.5 rounded-2xl outline-1 flex flex-col items-start justify-center gap-[5px] cursor-pointer text-left transition-colors duration-200 ${
        selected
          ? "bg-[#3B8519]/[0.18] outline-[#3B8519]"
          : "bg-white outline-[#D9D9D9] hover:outline-[#3B8519]"
      }`}
    >
      <p className="text-black text-base font-bold">{role}</p>
      <p className="text-xs text-[#727070] font-medium">{text}</p>
    </button>
  );
}

export default function Signup() {
  const [agreed, setAgreed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    if (!agreed) {
      setToastMessage("필수 이용약관에 동의해 주세요.");
      return;
    }

    setToastMessage("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
  };

  useEffect(() => {
    if (!toastMessage) return;

    const isSuccess = toastMessage.startsWith("회원가입이 완료되었습니다.");

    const timer = window.setTimeout(() => {
      if (isSuccess) {
        navigate("/login");
      } else {
        setToastMessage("");
      }
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toastMessage, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6F3]">
      <CommonHeader img={backButton} title="회원가입" />

      <div className="flex w-full flex-col px-[21px] pb-10">
        {/* 가입 유형 */}
        <div className="w-full flex flex-col mt-[30px] gap-3">
          <p className="text-black text-sm font-bold">가입 유형</p>

          <div className="flex w-full gap-[19px]">
            <Option
              role="학생"
              text="시설 불편을 제보하고 처리 결과를 확인합니다."
              selected={selectedRole === "학생"}
              onSelect={() => setSelectedRole("학생")}
            />

            <Option
              role="관리자"
              text="제보와 이상징후를 확인하고 처리합니다."
              selected={selectedRole === "관리자"}
              onSelect={() => setSelectedRole("관리자")}
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="w-full flex flex-col gap-[5px] mt-[19px]">
          <p className="text-[#727070] text-sm font-semibold">이름</p>

          <input
            type="text"
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="홍길동"
          />
        </div>

        {/* 학번 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">학번</p>

          <input
            type="text"
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="예: 2023123456"
          />
        </div>

        {/* 학과 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">학과</p>

          <input
            type="text"
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="예: 컴퓨터공학과"
          />
        </div>

        {/* 학교 이메일 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">학교 이메일</p>

          <div className="flex w-full gap-[9px]">
            <div className="flex min-w-0 flex-1 h-[50px] items-center bg-white rounded-[10px] outline-1 outline-[#D9D9D9] px-[11px]">
              <input
                type="text"
                className="min-w-0 flex-1 outline-none bg-transparent"
                placeholder="아이디"
              />

              <span className="shrink-0 text-[#727070] text-sm">
                @skuniv.ac.kr
              </span>
            </div>

            <button
              type="button"
              className="cursor-pointer w-[113px] shrink-0 h-[50px] rounded-[10px] outline-1 outline-[#3B8519] text-[#3B8519]"
            >
              인증 요청
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">비밀번호</p>

          <input
            type="password"
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="8자 이상, 영문 및 숫자 포함"
          />

          <input
            type="password"
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="비밀번호 확인"
          />
        </div>

        {/* 필수 이용약관 동의 */}
        <label className="w-full flex items-center gap-[5px] cursor-pointer mt-7 mb-5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="w-[15px] h-[15px] shrink-0 accent-black cursor-pointer"
          />

          <span className="text-[10px] text-black font-medium">
            [필수] 서비스 이용약관 및 개인정보 수집·이용에 동의합니다.
          </span>
        </label>

        {/* 가입하기 버튼 */}
        <div
          onClick={handleSignup}
          className="flex w-full justify-center mx-auto"
        >
          <Button title="가입하기" />
        </div>
      </div>
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-10 left-1/2 z-50 w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-xl bg-[#13213C] px-5 py-3 text-center text-sm font-medium text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
