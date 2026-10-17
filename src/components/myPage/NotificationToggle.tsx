interface NotificationToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function NotificationToggle({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: NotificationToggleProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-5 py-5 sm:px-6">
      {/* 알림 정보 */}
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-[#111827] sm:text-lg">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-[#737373] sm:text-base">
          {description}
        </p>
      </div>

      {/* ON/OFF 토글 */}
      <button
        type="button"
        role="switch"
        aria-label={`${title} 알림`}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-10 w-[72px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? "bg-[#3B8519]" : "bg-[#E5E5E5]"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}