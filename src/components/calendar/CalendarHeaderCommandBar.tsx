"use client";

import React from "react";
import { CalendarViewMode, SocialChannel } from "@/types/calendar";

interface CalendarHeaderCommandBarProps {
  monthLabel: string;
  campaignQuarter: string;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  selectedChannels: Record<SocialChannel, boolean>;
  onToggleChannel: (channel: SocialChannel) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  timezone: string;
  onAutoFill: () => void;
  onCreateSchedule: () => void;
}

export const CalendarHeaderCommandBar: React.FC<CalendarHeaderCommandBarProps> = ({
  monthLabel,
  campaignQuarter,
  viewMode,
  onViewModeChange,
  selectedChannels,
  onToggleChannel,
  selectedStatus,
  onStatusChange,
  timezone,
  onAutoFill,
  onCreateSchedule,
}) => {
  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex flex-col gap-4">
      {/* Top Level: Month Selector & Core Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/30">
            <button
              title="Tháng trước"
              className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">chevron_left</span>
            </button>
            <span className="px-3 font-semibold text-on-surface text-base">{monthLabel}</span>
            <button
              title="Tháng sau"
              className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">chevron_right</span>
            </button>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
            Hôm nay
          </button>
          <span className="text-xs text-on-surface-variant/80 border-l border-outline-variant/40 pl-3 hidden md:inline">
            Chiến dịch: <strong className="text-on-surface font-semibold">{campaignQuarter}</strong>
          </span>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <button
            onClick={() => onViewModeChange("month")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "month"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Tháng
          </button>
          <button
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "week"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "day"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Ngày
          </button>
          <button
            onClick={() => onViewModeChange("queue")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "queue"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Hàng đợi
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAutoFill}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors border border-secondary/20"
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>AI Tự điền lịch</span>
          </button>
          <button
            onClick={onCreateSchedule}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary/95 rounded-xl shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Lên lịch mới</span>
          </button>
        </div>
      </div>

      {/* Second Level: Filter Bar & Timezone Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-outline-variant/20 text-xs">
        {/* Channel & Status Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-on-surface-variant font-medium">Kênh:</span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedChannels.FB}
              onChange={() => onToggleChannel("FB")}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-outline-variant"
            />
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-blue-600 text-white text-[10px] font-bold">
              f
            </span>
            <span className="text-on-surface">Facebook</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedChannels.X}
              onChange={() => onToggleChannel("X")}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-outline-variant"
            />
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-neutral-900 text-white text-[10px] font-bold">
              𝕏
            </span>
            <span className="text-on-surface">X / Twitter</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedChannels.TH}
              onChange={() => onToggleChannel("TH")}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-outline-variant"
            />
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-pink-600 text-white text-[10px] font-bold">
              @
            </span>
            <span className="text-on-surface">Threads</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedChannels.IN}
              onChange={() => onToggleChannel("IN")}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-outline-variant"
            />
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-blue-700 text-white text-[10px] font-bold">
              in
            </span>
            <span className="text-on-surface">LinkedIn</span>
          </label>

          <span className="h-3 w-px bg-outline-variant/40 mx-1"></span>

          <span className="text-on-surface-variant font-medium">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="SCHEDULED">Đã lên lịch</option>
            <option value="PENDING_APPROVAL">Chờ duyệt</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>

        {/* Timezone display */}
        <div className="flex items-center gap-1 text-on-surface-variant/80">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>Múi giờ: {timezone}</span>
        </div>
      </div>
    </div>
  );
};
