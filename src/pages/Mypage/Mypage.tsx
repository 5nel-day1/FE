import { useState } from "react";
import ProfileCard from "../../components/myPage/ProfileCard";
import ReportStatsCard from "../../components/myPage/ReportStatsCard";
import NotificationToggle from "../../components/myPage/NotificationToggle";
import AccountMenu from "../../components/myPage/AccountMenu";
import { userProfile, notificationSettings } from "../../mocks/myPage";
import Footer from "../../components/footer/Footer";

export default function MyPage() {
  const [settings, setSettings] = useState(notificationSettings);

  return (
    <main className="min-h-screen bg-[#F8F9F7] pb-[73px] px-5 py-5">
      <div className="w-full pb-5">
        {/* 페이지 제목 */}
        <h1 className="mb-7 text-2xl font-bold text-[#13213C]">마이페이지</h1>

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
          <h2 className="mb-4 text-lg font-bold text-[#13213C]">알림 설정</h2>

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
          <h2 className="mb-4 text-lg font-bold text-[#13213C]">계정 관리</h2>

          <AccountMenu
            onLogout={() =>
              window.alert("로그아웃 기능은 추후 연동 예정입니다.")
            }
            onWithdraw={() =>
              window.alert("회원 탈퇴 기능은 추후 연동 예정입니다.")
            }
          />
        </section>
      </div>
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Footer />
      </div>
    </main>
  );
}
