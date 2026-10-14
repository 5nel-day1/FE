import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CommonHeader from "../../components/common/CommonHeader/CommonHeader";
import backButton from "../../assets/images/back_button.png";
import Button from "../../components/common/button/Button";

type UserRole = "학생" | "관리자";

type OptionProps = {
  role: UserRole;
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
      <p
        className={`text-base font-bold ${
          selected ? "text-[#3B8519]" : "text-black"
        }`}
      >
        {role}
      </p>

      <p className="text-xs text-[#727070] font-medium">
        {text}
      </p>
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  // 가입 유형
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // 입력값
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 이용약관
  const [agreed, setAgreed] = useState(false);

  // 토스트
  const [toastMessage, setToastMessage] = useState("");

  const isAdmin = selectedRole === "관리자";

  // 가입 유형 변경
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);

    // 유형별 입력값 초기화
    setIdentifier("");
    setDepartment("");
    setContact("");

    setToastMessage("");
  };

  // 회원가입
  const handleSignup = () => {
    // 가입 유형 확인
    if (!selectedRole) {
      setToastMessage("가입 유형을 선택해 주세요.");
      return;
    }

    // 필수 입력값 확인
    if (
      !name.trim() ||
      !identifier.trim() ||
      !department.trim() ||
      !contact.trim() ||
      !password ||
      !passwordConfirm
    ) {
      setToastMessage("모든 필수 항목을 입력해 주세요.");
      return;
    }

    // 학생 이메일 형식 확인
    if (
      selectedRole === "학생" &&
      !/^[^\s@]+$/.test(contact.trim())
    ) {
      setToastMessage("학교 이메일 아이디를 올바르게 입력해 주세요.");
      return;
    }

    // 관리자 전화번호 형식 확인
    if (
      selectedRole === "관리자" &&
      !/^01\d{8,9}$/.test(contact.replace(/-/g, ""))
    ) {
      setToastMessage("전화번호를 올바르게 입력해 주세요.");
      return;
    }

    // 비밀번호 조건 확인
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setToastMessage(
        "비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다."
      );
      return;
    }

    // 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      setToastMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이용약관 동의 확인
    if (!agreed) {
      setToastMessage("필수 이용약관에 동의해 주세요.");
      return;
    }

    // 회원가입 완료
    setToastMessage(
      "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
    );
  };

  // 토스트 메시지
  useEffect(() => {
    if (!toastMessage) return;

    const isSuccess = toastMessage.startsWith(
      "회원가입이 완료되었습니다."
    );

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
          <p className="text-black text-sm font-bold">
            가입 유형
          </p>

          <div className="flex w-full gap-[19px]">
            <Option
              role="학생"
              text="시설 불편을 제보하고 처리 결과를 확인합니다."
              selected={selectedRole === "학생"}
              onSelect={() => handleRoleSelect("학생")}
            />

            <Option
              role="관리자"
              text="제보와 이상징후를 확인하고 처리합니다."
              selected={selectedRole === "관리자"}
              onSelect={() => handleRoleSelect("관리자")}
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="w-full flex flex-col gap-[5px] mt-[19px]">
          <p className="text-[#727070] text-sm font-semibold">
            이름
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="홍길동"
          />
        </div>

        {/* 학번 / 관리자 코드 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">
            {isAdmin ? "관리자 코드" : "학번"}
          </p>

          <input
            key={`${selectedRole}-identifier`}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder={
              isAdmin ? "예: 0000" : "예: 2023123456"
            }
          />
        </div>

        {/* 학과 / 소속 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">
            {isAdmin ? "소속" : "학과"}
          </p>

          <input
            key={`${selectedRole}-department`}
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder={
              isAdmin
                ? "예: 시설미화관리담당"
                : "예: 컴퓨터공학과"
            }
          />
        </div>

        {/* 학교 이메일 / 전화번호 */}
        <div className="w-full flex flex-col gap-[5px] mt-[5px]">
          <p className="text-[#727070] text-sm font-semibold">
            {isAdmin ? "전화번호" : "학교 이메일"}
          </p>

          <div className="flex w-full gap-[9px]">
            <div className="flex min-w-0 flex-1 h-[50px] items-center bg-white rounded-[10px] outline-1 outline-[#D9D9D9] px-[11px]">

              {!isAdmin ? (
                <>
                  {/* 학생 이메일 */}
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="min-w-0 flex-1 outline-none bg-transparent"
                    placeholder="아이디"
                  />

                  <span className="shrink-0 text-[#727070] text-sm">
                    @skuniv.ac.kr
                  </span>
                </>
              ) : (
                <>
                  {/* 관리자 전화번호 */}
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="min-w-0 flex-1 outline-none bg-transparent"
                    placeholder="010-"
                  />
                </>
              )}
            </div>

            {/* 인증 요청 버튼 */}
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
          <p className="text-[#727070] text-sm font-semibold">
            비밀번호
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-[50px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] pl-[11px]"
            placeholder="8자 이상, 영문 및 숫자 포함"
          />

          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
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

      {/* 토스트 메시지 */}
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