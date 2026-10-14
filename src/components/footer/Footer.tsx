import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "홈", path: "/home" },
  { label: "제보하기", path: "/student/report" },
  { label: "내 제보", path: "/my-report" },
  { label: "마이", path: "/mypage" },
];

export default function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <footer className="w-full h-[73px] bg-white flex items-center">
      <nav
        className="w-full grid grid-cols-4 items-center"
        aria-label="하단 메뉴"
      >
        {menuItems.map(({ label, path }) => {
          const isActive = pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap ${
                isActive ? "text-[#3B8519]" : "text-[#727070]"
              }`}
            >
              {/* 선택된 메뉴 활동바 */}
              <span
                className={`h-0.5 w-6 rounded-full ${
                  isActive ? "bg-[#3B8519]" : "bg-transparent"
                }`}
              />

              {/* 메뉴 이름 */}
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
