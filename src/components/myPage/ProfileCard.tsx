interface ProfileCardProps {
  profile: {
    name: string;
    role: string;
    department: string;
    studentId: string;
    email: string;
  };
}

export default function ProfileCard({
  profile,
}: ProfileCardProps) {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-[#D9D9D9] bg-white p-5 sm:p-6">
      {/* 프로필 이미지 */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5F0DF] sm:h-20 sm:w-20">
        <span className="text-2xl font-bold text-[#3B8519]">
          {profile.name.charAt(0)}
        </span>
      </div>

      {/* 사용자 정보 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
            {profile.name}
          </h2>

          <span className="rounded-md bg-[#E5F0DF] px-2 py-1 text-xs font-semibold text-[#3B8519]">
            {profile.role}
          </span>
        </div>

        <p className="mt-1 break-words text-sm text-[#737373] sm:text-base">
          {profile.department} · {profile.studentId}
        </p>

        <p className="mt-1 break-all text-sm text-[#737373] sm:text-base">
          {profile.email}
        </p>
      </div>
    </div>
  );
}