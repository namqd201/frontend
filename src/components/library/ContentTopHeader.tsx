"use client";

import { PostStatusFilter } from "@/types/library";

interface TopHeaderFilterProps {
  selectedCount: number;
  activeStatus: PostStatusFilter;
  onSelectStatus: (status: PostStatusFilter) => void;
  statusCounts: Record<string, number>;
  onCreateNew: () => void;
}

export function ContentTopHeader({
  selectedCount,
  activeStatus,
  onSelectStatus,
  statusCounts,
  onCreateNew,
}: TopHeaderFilterProps) {
  const tabs: { key: PostStatusFilter; label: string; countKey: string; isSpecial?: boolean; isPulse?: boolean; isError?: boolean }[] = [
    { key: "ALL", label: "Tất cả", countKey: "ALL" },
    { key: "DRAFT", label: "Bản nháp - Draft", countKey: "DRAFT" },
    { key: "PENDING_APPROVAL", label: "Chờ duyệt - Pending", countKey: "PENDING_APPROVAL", isPulse: true },
    { key: "APPROVED", label: "Đã duyệt - Approved", countKey: "APPROVED" },
    { key: "SCHEDULED", label: "Đã lên lịch - Scheduled", countKey: "SCHEDULED" },
    { key: "PUBLISHED", label: "Đã xuất bản - Published", countKey: "PUBLISHED" },
    { key: "PARTIALLY_PUBLISHED", label: "Đăng một phần", countKey: "PARTIALLY_PUBLISHED" },
    { key: "FAILED", label: "Thất bại - Failed", countKey: "FAILED", isError: true },
  ];

  return (
    <div className="px-6 py-6 bg-[#ffffff] shadow-xs border-b border-[#c3c6d7]/20">
      {/* Title & Action group */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[24px] lg:text-[28px] text-[#0b1c30] tracking-tight font-semibold">
              Thư viện nội dung (Content Library)
            </span>
            <span className="text-[11px] font-semibold bg-[#dbe1ff] text-[#00174b] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Workspace Pro
            </span>
          </div>
          <p className="text-[13px] text-[#434655] max-w-2xl leading-relaxed">
            Quản lý toàn bộ bài viết, vòng đời phê duyệt và lịch sử xuất bản của Workspace. Tối ưu phân phối đa kênh bằng AI Engine.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Bulk Actions Trigger */}
          <div className="relative inline-block text-left">
            <button
              className="h-9 px-3.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#737686]">checklist</span>
              <span>Bulk Actions (Đã chọn {selectedCount})</span>
              <span className="material-symbols-outlined text-[16px] text-[#737686]">expand_more</span>
            </button>
          </div>

          {/* Secondary Action: Export */}
          <button
            className="h-9 px-3.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#737686]">file_download</span>
            <span>Xuất dữ liệu</span>
          </button>

          {/* Primary Create Post */}
          <button
            onClick={onCreateNew}
            className="h-9 px-4 bg-[#004ac6] hover:bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tạo bài mới</span>
          </button>
        </div>
      </div>

      {/* State Machine Lifecycle Filter Tabs */}
      <div className="mt-6 overflow-x-auto select-none pb-1">
        <div className="flex items-center gap-1 min-w-max p-1 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]/20">
          {tabs.map((t) => {
            const isActive = activeStatus === t.key;
            const count = statusCounts[t.countKey] ?? 0;

            let badgeClass = "bg-[#dce9ff] text-[#0b1c30]";
            if (t.isPulse) badgeClass = "bg-[#e9ddff] text-[#23005c] font-bold";
            if (t.key === "PUBLISHED") badgeClass = "bg-[#6ffbbe] text-[#002113]";
            if (t.isError) badgeClass = "bg-[#ffdad6] text-[#93000a] font-bold";

            return (
              <button
                key={t.key}
                onClick={() => onSelectStatus(t.key)}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-[13px] transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#ffffff] text-[#0b1c30] font-semibold shadow-xs"
                    : t.isError
                    ? "text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                    : "text-[#434655] hover:text-[#0b1c30] hover:bg-[#ffffff]/60"
                }`}
              >
                {t.isPulse && (
                  <span className="w-2 h-2 rounded-full bg-[#8455ef] animate-pulse" />
                )}
                {t.isError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                )}
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] ${badgeClass}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
