"use client";

import { SocialPlatform } from "@/types/content";

interface ChannelsSelectorProps {
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
}

export function ChannelsSelector({
  selectedPlatforms,
  onTogglePlatform,
}: ChannelsSelectorProps) {
  const isSelected = (p: SocialPlatform) => selectedPlatforms.includes(p);

  return (
    <div className="rounded-xl bg-[#ffffff] p-4 lg:p-6 shadow-xs flex flex-col gap-4 border border-[#c3c6d7]/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">hub</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#0b1c30] font-semibold">
            Kênh phân phối bài viết
          </span>
        </div>
        <span className="text-[11px] text-[#737686]">
          Đã chọn {selectedPlatforms.length}/4 tài khoản
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Facebook */}
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer select-none border border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              f
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#0b1c30] font-semibold">Acme Tech</span>
              <span className="text-[12px] text-[#737686]">Facebook Fanpage</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected("FACEBOOK")}
            onChange={() => onTogglePlatform("FACEBOOK")}
            className="w-4 h-4 rounded text-[#004ac6] focus:ring-0 cursor-pointer"
          />
        </label>

        {/* X */}
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer select-none border border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#213145] text-[#eaf1ff] flex items-center justify-center font-bold text-xs shadow-xs">
              𝕏
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#0b1c30] font-semibold">@acmegrowth</span>
              <span className="text-[12px] text-[#737686]">X Network</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected("X")}
            onChange={() => onTogglePlatform("X")}
            className="w-4 h-4 rounded text-[#004ac6] focus:ring-0 cursor-pointer"
          />
        </label>

        {/* LinkedIn */}
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer select-none border border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              in
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#0b1c30] font-semibold">Acme Corp</span>
              <span className="text-[12px] text-[#737686]">LinkedIn Organization</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected("LINKEDIN")}
            onChange={() => onTogglePlatform("LINKEDIN")}
            className="w-4 h-4 rounded text-[#004ac6] focus:ring-0 cursor-pointer"
          />
        </label>

        {/* Threads */}
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer select-none border border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#213145] text-[#eaf1ff] flex items-center justify-center font-bold text-xs shadow-xs">
              @
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#0b1c30] font-semibold">@acmegrowth</span>
              <span className="text-[12px] text-[#737686]">Threads Page</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected("THREADS")}
            onChange={() => onTogglePlatform("THREADS")}
            className="w-4 h-4 rounded text-[#004ac6] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
