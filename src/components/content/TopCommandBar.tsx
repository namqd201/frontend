"use client";

interface TopCommandBarProps {
  title: string;
  setTitle: (val: string) => void;
  onSaveDraft: () => void;
  onSubmitApproval: () => void;
  onSchedule: () => void;
  onPublishNow: () => void;
  loading: boolean;
}

export function TopCommandBar({
  title,
  setTitle,
  onSaveDraft,
  onSubmitApproval,
  onSchedule,
  onPublishNow,
  loading,
}: TopCommandBarProps) {
  return (
    <div className="sticky top-16 z-30 bg-[#ffffff]/95 backdrop-blur-md px-6 py-3 shadow-xs flex flex-col gap-2 border-b border-[#c3c6d7]/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb & Title Cluster */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#434655]">
            <span className="hover:text-[#004ac6] cursor-pointer transition-colors">
              Thư viện bài viết
            </span>
            <span>/</span>
            <span className="text-[#0b1c30]">Tạo bài viết mới</span>
            <span className="mx-1 text-[#c3c6d7]">·</span>
            <span className="bg-[#dce9ff] text-[#434655] px-2 py-0.5 rounded-full font-['JetBrains_Mono']">
              UTC+7 · Asia/Ho_Chi_Minh
            </span>
            <span className="bg-[#e9ddff] text-[#23005c] px-2 py-0.5 rounded-full uppercase tracking-wide">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#0b1c30] font-bold bg-transparent outline-none hover:bg-[#eff4ff] focus:bg-[#eff4ff] px-1 py-0.5 rounded-lg transition-all w-full max-w-2xl"
              id="campaign-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="text-[#737686] hover:text-[#004ac6] transition-colors p-1"
              title="Đổi tiêu đề"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSaveDraft}
            disabled={loading}
            className="h-9 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Lưu bản nháp</span>
          </button>

          <button
            onClick={onSubmitApproval}
            disabled={loading}
            className="h-9 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Gửi duyệt</span>
          </button>

          <button
            onClick={onSchedule}
            disabled={loading}
            className="h-9 px-4 rounded-xl bg-[#6b38d4] hover:bg-[#8455ef] text-white text-[13px] font-semibold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">schedule_send</span>
            <span>Lên lịch</span>
          </button>

          <button
            onClick={onPublishNow}
            disabled={loading}
            className="h-9 px-5 rounded-xl bg-[#004ac6] hover:bg-[#2563eb] text-white text-[13px] font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>Xuất bản ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
