"use client";

import { SocialAccountHealthItem } from "@/types/dashboard";

interface SocialHealthBarProps {
  accounts: SocialAccountHealthItem[];
}

export function SocialAccountsHealthBar({ accounts }: SocialHealthBarProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "FACEBOOK":
        return { icon: "thumb_up", bg: "bg-[#1877F2]/10", text: "text-[#1877F2]" };
      case "X":
        return { icon: "tag", bg: "bg-[#0b1c30]/10", text: "text-[#0b1c30]" };
      case "LINKEDIN":
        return { icon: "business_center", bg: "bg-[#0A66C2]/10", text: "text-[#0A66C2]" };
      case "THREADS":
        return { icon: "forum", bg: "bg-[#6b38d4]/10", text: "text-[#6b38d4]" };
      default:
        return { icon: "share", bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  return (
    <div className="bg-[#ffffff] p-3 rounded-xl shadow-xs flex flex-col gap-2 border border-[#c3c6d7]/30">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
            Kênh kết nối trực tiếp (Live Health Status)
          </span>
          <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse" />
        </div>
        <button
          className="text-[11px] text-[#004ac6] hover:underline font-semibold flex items-center gap-1"
          type="button"
        >
          <span>Quản lý kênh</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {accounts.map((acc) => {
          const config = getPlatformIcon(acc.platform);
          return (
            <div
              key={acc.id}
              className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center ${config.text}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{config.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#0b1c30] font-semibold leading-tight">
                    {acc.accountName}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#434655]">
                    {acc.accountHandle}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-[#6ffbbe] text-[#002113] px-2 py-0.5 rounded-full font-bold">
                {acc.healthStatus}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
