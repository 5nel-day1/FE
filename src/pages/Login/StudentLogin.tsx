import logo from "../../assets/icons/sku_logo.png";
import Button from "../../components/common/button/Button";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-5 py-10">
      {/* 로고 */}
      <img src={logo} className="mt-20 sm:mt-10 max-w-full h-auto" />

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
          className="w-[331px] h-[50px] pl-[10px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] text-[#999292] text-sm -font-medium"
          placeholder="예: 2023123456"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="w-full max-w-[339px] h-21 p-1 flex flex-col justify-start items-start gap-2 mt-[18px]">
        <p className="text-[#727070] text-sm font-semibold">비밀번호</p>
        <input
          type="password"
          className="w-[331px] h-[50px] pl-[10px] bg-white rounded-[10px] outline-1 outline-[#D9D9D9] text-[#999292] text-sm -font-medium"
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

      <div className="w-[339px]">
        <Button title="로그인" onClick={() => navigate("/home")} />
      </div>
    </div>
  );
}
