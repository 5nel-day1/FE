import { useNavigate } from "react-router-dom";

interface AccountMenuItem {
  label: string;
  path?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface AccountMenuProps {
  onLogout?: () => void;
  onWithdraw?: () => void;
}

export default function AccountMenu({
  onLogout,
  onWithdraw,
}: AccountMenuProps) {
  const navigate = useNavigate();

  const menuItems: AccountMenuItem[] = [
    {
      label: "비밀번호 변경",
      path: "/student/change-password",
    },
    {
      label: "이용약관",
      path: "/terms",
    },
    {
      label: "개인정보 처리방침",
      path: "/privacy",
    },
    {
      label: "로그아웃",
      onClick: onLogout,
    },
    {
      label: "회원 탈퇴",
      onClick: onWithdraw,
      danger: true,
    },
  ];

  const handleMenuClick = (item: AccountMenuItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white">
      {menuItems.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => handleMenuClick(item)}
          className={`flex w-full cursor-pointer items-center justify-between px-5 py-5 text-left transition-colors hover:bg-[#F8F9F7] sm:px-6 ${
            index !== menuItems.length - 1
              ? "border-b border-[#E5E7EB]"
              : ""
          }`}
        >
          <span
            className={`text-sm font-medium sm:text-base ${
              item.danger ? "text-[#DC2626]" : "text-[#374151]"
            }`}
          >
            {item.label}
          </span>

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke={item.danger ? "#DC2626" : "#9CA3AF"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </section>
  );
}