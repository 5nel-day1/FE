import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileCard from "../../components/myPage/ProfileCard";
import ReportStatsCard from "../../components/myPage/ReportStatsCard";
import NotificationToggle from "../../components/myPage/NotificationToggle";
import AccountMenu from "../../components/myPage/AccountMenu";
import Footer from "../../components/footer/Footer";

import { logoutUser } from "../../api/auth";
import {
  getMyPage,
  updateNotificationSettings,
  withdrawUser,
} from "../../api/users";

import { useAuthStore } from "../../stores/useAuthStore";

import type {
  MyPageUser,
  NotificationSettings,
} from "../../types/user";

type NotificationKey = keyof NotificationSettings;

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [userInfo, setUserInfo] = useState<MyPageUser | null>(null);

  const [settings, setSettings] = useState<NotificationSettings>({
    statusAlarm: false,
    commentAlarm: false,
    solvedAlarm: false,
  });

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState("");

  const [isUpdatingNotifications, setIsUpdatingNotifications] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // 마이페이지 정보 조회
  useEffect(() => {
    let active = true;

    const fetchMyPage = async () => {
      try {
        const response = await getMyPage();

        if (!active) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "마이페이지 조회에 실패했습니다.",
          );
        }

        const data = response.data;

        setUserInfo(data);

        setSettings({
          statusAlarm: data.statusAlarm,
          commentAlarm: data.commentAlarm,
          solvedAlarm: data.solvedAlarm,
        });
      } catch (error) {
        if (!active) return;

        console.error("마이페이지 정보 조회 실패:", error);
        setUserError("마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        if (active) {
          setIsLoadingUser(false);
        }
      }
    };

    void fetchMyPage();

    return () => {
      active = false;
    };
  }, []);

  // 알림 설정 변경
  const handleNotificationChange = async (
    key: NotificationKey,
    checked: boolean,
  ) => {
    if (isUpdatingNotifications || !userInfo) return;

    const nextSettings: NotificationSettings = {
      ...settings,
      [key]: checked,
    };

    setIsUpdatingNotifications(true);

    try {
      const response = await updateNotificationSettings(nextSettings);

      if (!response.success) {
        throw new Error(
          response.message || "알림 설정 변경에 실패했습니다.",
        );
      }

      setSettings(nextSettings);

      setUserInfo((previous) =>
        previous
          ? {
              ...previous,
              ...nextSettings,
            }
          : previous,
      );
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);

      window.alert(
        "알림 설정을 변경하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    if (isLoggingOut || isWithdrawing) return;

    setIsLoggingOut(true);

    try {
      const response = await logoutUser();

      if (!response.success) {
        console.error("서버 로그아웃 실패:", response.message);
      }
    } catch (error) {
      console.error("서버 로그아웃 요청 실패:", error);
    } finally {
      logout();
      navigate("/", { replace: true });
    }
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    if (isWithdrawing || isLoggingOut) return;

    const confirmed = window.confirm(
      "정말 회원 탈퇴하시겠습니까?\n탈퇴 후에는 계정을 복구할 수 없습니다.",
    );

    if (!confirmed) return;

    setIsWithdrawing(true);

    try {
      const response = await withdrawUser();

      if (!response.success) {
        throw new Error(
          response.message || "회원 탈퇴에 실패했습니다.",
        );
      }

      window.alert("회원 탈퇴가 완료되었습니다.");

      // 로그인 정보 삭제
      logout();

      // 로그인 페이지 이동
      navigate("/", { replace: true });
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      window.alert(
        "회원 탈퇴에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const notificationsDisabled =
    isLoadingUser ||
    !userInfo ||
    isUpdatingNotifications ||
    isWithdrawing;

  return (
    <main className="min-h-screen bg-[#F8F9F7] pb-[73px] px-5 py-5">
      <div className="w-full pb-5">
        {/* 페이지 제목 */}
        <h1 className="mb-7 text-2xl font-bold text-[#13213C]">
          마이페이지
        </h1>

        {/* 프로필 정보 */}
        <div className="mb-5">
          {isLoadingUser ? (
            <p className="py-5 text-sm text-[#777777]">
              회원 정보를 불러오는 중입니다.
            </p>
          ) : userInfo ? (
            <ProfileCard
              profile={{
                name: userInfo.name,
                role:
                  userInfo.role === "STUDENT"
                    ? "학생"
                    : userInfo.role === "ADMIN"
                      ? "관리자"
                      : userInfo.role,
                department: userInfo.department,
                studentId: userInfo.studentId,
                email: userInfo.email,
              }}
            />
          ) : (
            <p className="py-5 text-sm text-red-600">
              {userError}
            </p>
          )}
        </div>

        {/* 내 제보 통계 */}
        <div className="mb-8">
          {userInfo ? (
            <ReportStatsCard
              totalReports={userInfo.totalReports}
              solvedReports={userInfo.solvedReports}
            />
          ) : isLoadingUser ? (
            <p className="py-5 text-sm text-[#777777]">
              제보 통계를 불러오는 중입니다.
            </p>
          ) : null}
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
              checked={settings.statusAlarm}
              disabled={notificationsDisabled}
              onChange={(checked) =>
                void handleNotificationChange(
                  "statusAlarm",
                  checked,
                )
              }
            />

            <div className="border-t border-[#E5E7EB]" />

            <NotificationToggle
              title="댓글"
              description="내가 공감하고 제보한 문제에 댓글이 달리면 알립니다."
              checked={settings.commentAlarm}
              disabled={notificationsDisabled}
              onChange={(checked) =>
                void handleNotificationChange(
                  "commentAlarm",
                  checked,
                )
              }
            />

            <div className="border-t border-[#E5E7EB]" />

            <NotificationToggle
              title="해결 소식"
              description="캠퍼스 문제가 해결되면 알립니다."
              checked={settings.solvedAlarm}
              disabled={notificationsDisabled}
              onChange={(checked) =>
                void handleNotificationChange(
                  "solvedAlarm",
                  checked,
                )
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
            isLoggingOut={isLoggingOut || isWithdrawing}
            onWithdraw={() => void handleWithdraw()}
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