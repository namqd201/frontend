"use client";

import { SocialPlatform } from "@/types/content";

interface MultiPlatformPreviewProps {
  activePlatform: SocialPlatform;
  setActivePlatform: (p: SocialPlatform) => void;
  previewContent: string;
}

export function MultiPlatformPreview({
  activePlatform,
  setActivePlatform,
  previewContent,
}: MultiPlatformPreviewProps) {
  return (
    <div className="flex flex-col gap-4 w-full sticky top-36">
      {/* Platform Switcher Tabs */}
      <div className="flex items-center justify-between bg-[#ffffff] p-1.5 rounded-xl shadow-xs border border-[#c3c6d7]/30">
        <div className="flex items-center gap-1 w-full" id="platform-tabs">
          <button
            onClick={() => setActivePlatform("FACEBOOK")}
            className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "FACEBOOK"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "hover:bg-[#dce9ff] text-[#434655]"
            }`}
            type="button"
          >
            <span className="font-bold text-xs">f</span>
            <span>Facebook</span>
          </button>

          <button
            onClick={() => setActivePlatform("X")}
            className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "X"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "hover:bg-[#dce9ff] text-[#434655]"
            }`}
            type="button"
          >
            <span className="font-bold text-xs">𝕏</span>
            <span>X ({previewContent.length}/280)</span>
          </button>

          <button
            onClick={() => setActivePlatform("LINKEDIN")}
            className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "LINKEDIN"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "hover:bg-[#dce9ff] text-[#434655]"
            }`}
            type="button"
          >
            <span className="font-bold text-xs">in</span>
            <span>LinkedIn</span>
          </button>

          <button
            onClick={() => setActivePlatform("THREADS")}
            className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "THREADS"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "hover:bg-[#dce9ff] text-[#434655]"
            }`}
            type="button"
          >
            <span className="font-bold text-xs">@</span>
            <span>Threads</span>
          </button>
        </div>
      </div>

      {/* Live Mockup Card */}
      <div className="rounded-xl bg-[#ffffff] p-4 lg:p-6 shadow-md flex flex-col gap-4 border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between pb-1 border-b border-[#c3c6d7]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006242] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#737686] uppercase">
              Mô phỏng hiển thị Feed {activePlatform}
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#434655]">
            Device: Desktop & Mobile 100% Native
          </span>
        </div>

        {/* Post Mockup Frame */}
        <div className="bg-[#ffffff] rounded-xl p-3 shadow-xs flex flex-col gap-3 border border-[#c3c6d7]/20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-xs"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZPbL3z_j-oIDMyBn30ND7Gn3yl2irRrFOB5vsIU6es_9SpgvPmPAh9qAvO0uhhX_7IeswJ_lRJ1PFPB2kdnPpfFg2NghJ2Xpwv5YJD3V-f7su3SJf6T-h2kYN4p1J_kW1xV8cXjtIPZsMml1LKgmOGo9Y4oCiAWlYp2An9_p-_ruN0lZQ99fDn-B8f4vZVzIF9e99Mz4h3YoIKKRleOa_CHdvIxp9pK2VrVasutI1"
                  alt="Acme Tech Logo"
                />
                <span
                  className="material-symbols-outlined absolute -bottom-1 -right-1 text-[#004ac6] text-[14px] bg-[#ffffff] rounded-full"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] text-[#0b1c30] font-bold leading-tight">
                    Acme Tech
                  </span>
                  <span
                    className="material-symbols-outlined text-[#004ac6] text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#737686] leading-tight">
                  <span>Vừa xong</span>
                  <span>·</span>
                  <span className="material-symbols-outlined text-[13px]">public</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#737686]">
              <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-[#0b1c30]">
                more_horiz
              </span>
            </div>
          </div>

          {/* Post Copy */}
          <div
            className="text-[13px] text-[#0b1c30] whitespace-pre-line leading-relaxed"
            id="preview-text-box"
          >
            {previewContent}
          </div>

          {/* Image Attachment (16:9) */}
          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#dce9ff] shadow-xs">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtbGN-eYmojou4omdCMTKVdXei_sjHXO4BFLET-zkQxFXzubGFwf7JHzXjmVTrEJY_GfOLkFL1aTe4-Y9kQ57J4WlR1kl0rgrDeK_KbonMUIjH8b87P-arLmMkJ0TyMpWQUzNCJ-DPJw4_vkxW7liUyEV0lbcJeTUqTdaHe_B6LIOLWrVNCQ7MxwtUzUtVXky0CHR3sFZ_HsCogoQW1HbKx62wJFuGBAYMmPH1Qor3"
              alt="Preview Attachment"
            />
          </div>

          {/* Open Graph Bar */}
          <div className="p-2 bg-[#eff4ff] rounded-lg flex flex-col gap-0.5 cursor-pointer hover:bg-[#dce9ff] transition-colors border border-[#c3c6d7]/20">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#737686] uppercase">
              nqdsmtool.ai/launch/v2
            </span>
            <span className="text-[12px] text-[#0b1c30] font-semibold">
              NQDSMTool v2.0 AI Automation | Nền tảng phân phối mạng xã hội tự động
            </span>
          </div>

          {/* Reactions bar */}
          <div className="flex items-center justify-between text-[#737686] py-1 text-[12px] border-b border-[#c3c6d7]/20">
            <div className="flex items-center gap-1">
              <div className="flex items-center -space-x-1">
                <span className="w-4 h-4 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-[9px] font-bold">
                  👍
                </span>
                <span className="w-4 h-4 rounded-full bg-[#6b38d4] text-white flex items-center justify-center text-[9px] font-bold">
                  💡
                </span>
                <span className="w-4 h-4 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-[9px] font-bold">
                  ❤️
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] ml-1 text-[#434655] font-medium">
                128 lượt thích
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#737686]">
              <span>32 bình luận</span>
              <span>·</span>
              <span>18 chia sẻ</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="grid grid-cols-4 gap-1 pt-1 bg-[#eff4ff]/50 rounded-xl p-1">
            <button
              className="py-1.5 flex items-center justify-center gap-1 text-[12px] text-[#434655] hover:bg-[#dce9ff] rounded-lg transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>Thích</span>
            </button>
            <button
              className="py-1.5 flex items-center justify-center gap-1 text-[12px] text-[#434655] hover:bg-[#dce9ff] rounded-lg transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">mode_comment</span>
              <span>Bình luận</span>
            </button>
            <button
              className="py-1.5 flex items-center justify-center gap-1 text-[12px] text-[#434655] hover:bg-[#dce9ff] rounded-lg transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Chia sẻ</span>
            </button>
            <button
              className="py-1.5 flex items-center justify-center gap-1 text-[12px] text-[#434655] hover:bg-[#dce9ff] rounded-lg transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Gửi</span>
            </button>
          </div>
        </div>

        {/* Platform Specific Advice */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]/20">
          <div className="flex flex-col">
            <span className="text-[13px] text-[#0b1c30] font-semibold">
              Quy định định dạng: {activePlatform} Page
            </span>
            <span className="text-[12px] text-[#434655]">
              {previewContent.length} ký tự (Đạt chuẩn tối ưu &lt; 500 ký tự cho độ dài tương tác cao nhất).
            </span>
          </div>
          <button
            className="px-3 py-1.5 rounded-xl bg-[#ffffff] hover:bg-[#dce9ff] text-[#004ac6] text-[12px] font-semibold transition-all shadow-xs flex items-center gap-1 border border-[#c3c6d7]/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Tùy biến riêng cho {activePlatform}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
