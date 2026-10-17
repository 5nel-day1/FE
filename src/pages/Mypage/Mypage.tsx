import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileCard from "../../components/myPage/ProfileCard";
import ReportStatsCard from "../../components/myPage/ReportStatsCard";
import NotificationToggle from "../../components/myPage/NotificationToggle";
import AccountMenu from "../../components/myPage/AccountMenu";

import { userProfile, notificationSettings } from "../../mocks/myPage";

import Footer from "../../components/footer/Footer";

import { logoutUser } from "../../api/auth";
import { useAuthStore } from "../../stores/useAuthStore";

export default function MyPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(notificationSettings);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  // 학생 로그아웃
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await logoutUser();

      if (!response.success) {
        console.error("서버 로그아웃 실패:", response.message);
      }
    } catch (error) {
      console.error("서버 로그아웃 요청 실패:", error);
    } finally {
      // 로그인 정보 초기화
      logout();

      // 학생 로그인 페이지로 이동
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9F7] pb-[73px] px-5 py-5">
      <div className="w-full pb-5">
        {/* 페이지 제목 */}
        <h1 className="mb-7 text-2xl font-bold text-[#13213C]">
          마이페이지
        </h1>

        {/* 프로필 정보 */}
        <div className="mb-5">
          <ProfileCard profile={userProfile} />
        </div>

        {/* 내 제보 통계 */}
        <div className="mb-8">
          <ReportStatsCard />
        </div>

        {/* 알림 설정 */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-[#13213C]">
            알림 설정
          </h2>

          <div className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white">
            <NotificationToggle
              title="처리 상태 변경"
              description="내 제보의 상태가 바뀌면 알립니다."
              checked={settings.statusChange}
              onChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  statusChange: checked,
                }))
              }
            />

            <div className="border-t border-[#E5E7EB]" />

            <NotificationToggle
              title="댓글"
              description="내가 공감하고 제보한 문제에 댓글이 달리면 알립니다."
              checked={settings.comment}
              onChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  comment: checked,
                }))
              }
            />

            <div className="border-t border-[#E5E7EB]" />

            <NotificationToggle
              title="해결 소식"
              description="캠퍼스 문제가 해결되면 알립니다."
              checked={settings.resolution}
              onChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  resolution: checked,
                }))
              }
            />
          </div>
        </section>

        {/* 계정 관리 */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-[#13213C]">
            계정 관리
          </h2>

          <AccountMenu
            onLogout={() => void handleLogout()}
            isLoggingOut={isLoggingOut}
            onWithdraw={() =>
              window.alert("회원 탈퇴 기능은 추후 연동 예정입니다.")
            }
          />
        </section>
      </div>

      {/* 하단 푸터 */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Footer />
      </div>
    </main>
  );
}