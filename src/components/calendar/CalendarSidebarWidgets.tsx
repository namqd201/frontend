"use client";

import React from "react";
import { CampaignMilestoneItem } from "@/types/calendar";

interface CalendarSidebarWidgetsProps {
  completedPosts: number;
  plannedPosts: number;
  progressPercent: number;
  successRate: number;
  nextAutoRunTime: string;
  nextAutoRunTitle: string;
  nextAutoRunMode: string;
  nextAutoRunTarget: string;
  milestones: CampaignMilestoneItem[];
  onQuickScheduleNow: () => void;
}

export const CalendarSidebarWidgets: React.FC<CalendarSidebarWidgetsProps> = ({
  completedPosts,
  plannedPosts,
  progressPercent,
  successRate,
  nextAutoRunTime,
  nextAutoRunTitle,
  nextAutoRunMode,
  nextAutoRunTarget,
  milestones,
  onQuickScheduleNow,
}) => {
  // SVG Donut calculation
  // radius = 32, circumference = 2 * PI * 32 ~= 201.06
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <aside className="w-80 lg:w-96 border-l border-outline-variant/30 bg-surface-container-low/30 p-5 flex flex-col gap-5 overflow-y-auto shrink-0">
      {/* 1. Monthly Output KPI Widget */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-on-surface">Kế hoạch tháng 10</h3>
          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {progressPercent}% Đạt chỉ tiêu
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Donut Chart */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-surface-container-high"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-primary transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-bold text-on-surface block leading-tight">
                {completedPosts}/{plannedPosts}
              </span>
              <span className="text-[9px] text-on-surface-variant block">bài viết</span>
            </div>
          </div>

          {/* Stats Details */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Đã xuất bản</span>
              <strong className="text-on-surface font-semibold">{completedPosts} bài</strong>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Đang lên lịch</span>
              <strong className="text-on-surface font-semibold">{plannedPosts - completedPosts} bài</strong>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Tỷ lệ thành công</span>
              <strong className="text-tertiary font-semibold">{successRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Automation Pipeline Widget */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">smart_toy</span>
            <h3 className="text-sm font-bold text-on-surface">Automation Pipeline</h3>
          </div>
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
        </div>

        <p className="text-xs text-on-surface-variant mb-3">
          Lịch quét và tự động sinh bản nháp từ RSS & Trending Topics.
        </p>

        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 text-xs space-y-1.5 mb-3">
          <div className="flex items-center justify-between font-semibold text-on-surface">
            <span>{nextAutoRunTitle}</span>
            <span className="font-mono text-secondary">{nextAutoRunTime}</span>
          </div>
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">rule</span>
            <span>{nextAutoRunMode}</span>
          </div>
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">share</span>
            <span>{nextAutoRunTarget}</span>
          </div>
        </div>

        <button
          onClick={onQuickScheduleNow}
          className="w-full py-2 text-xs font-semibold text-secondary hover:bg-secondary/10 rounded-xl transition-colors border border-secondary/30 flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">schedule_send</span>
          <span>Kích hoạt chạy ngay</span>
        </button>
      </div>

      {/* 3. Campaign Milestones Widget */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">flag</span>
            <h3 className="text-sm font-bold text-on-surface">Cột mốc chiến dịch Q4</h3>
          </div>
          <button className="text-[11px] font-semibold text-primary hover:underline">
            + Thêm mốc
          </button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 text-xs space-y-1.5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">{milestone.title}</span>
                <span className="text-[10px] font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded">
                  {milestone.dateRange}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {milestone.description}
              </p>
              {milestone.progressLabel && (
                <div className="text-[10px] text-on-surface-variant/80 pt-1 border-t border-outline-variant/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-tertiary">check_circle</span>
                  <span>{milestone.progressLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Upcoming Visual Asset Card */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
            Asset sắp xuất bản
          </span>
          <span className="text-[10px] font-mono text-on-surface-variant">Ngày mai 15:00</span>
        </div>
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface-container relative group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7hfbBJV6yUzXVv1VYaqYCQxL2nh9rweJIhdQfXJf8YXrfEJXThToG_D-eyXZKXhX8hedjuTLMEh1mNjaWFv4WlW5fnlgX4wZsfJqSYGA1YGLlUKkYiMabzAljwRw-R3DeXvUKXI_HTfzOfZbnEX0cQME9q1E5-J1UJyDaa5ief6ogZqKzCGVJqzYC4wB822uIfCRbSZJEFFhBv6OA_-qeOtMiPTZvZFBkx7XN0bYC"
            alt="Product v2 Launch Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
            <span className="text-white text-xs font-medium line-clamp-1">
              Infographic quy trình duyệt bài 2 tầng
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
