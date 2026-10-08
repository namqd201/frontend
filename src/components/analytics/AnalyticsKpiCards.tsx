"use client";

import React from "react";
import { AnalyticsOverviewData } from "@/types/analytics";

interface AnalyticsKpiCardsProps {
  data: AnalyticsOverviewData;
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Reach */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Tổng Lượt Tiếp Cận
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-on-surface tracking-tight font-headline-lg">
            {data.totalReach.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-tertiary">
          <span className="material-symbols-outlined text-[16px]">trending_up</span>
          <span className="font-semibold">+{data.reachGrowthPercent}%</span>
          <span className="text-on-surface-variant font-normal">so với tháng trước</span>
        </div>
        {/* Sparkline svg */}
        <div className="mt-3">
          <svg className="w-full h-8 text-primary overflow-visible" fill="none" viewBox="0 0 100 24">
            <path
              d="M0 20 Q 25 15 50 18 T 100 4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M0 20 Q 25 15 50 18 T 100 4 L 100 24 L 0 24 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Engagements */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Lượt Tương Tác
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[20px]">thumb_up</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-on-surface tracking-tight font-headline-lg">
            {data.totalEngagements.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface">
          <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold text-[11px]">
            {data.engagementRateCtr}% CTR
          </span>
          <span className="text-on-surface-variant font-normal">tỷ lệ tương tác TB</span>
        </div>
        <div className="mt-3">
          <svg className="w-full h-8 text-secondary overflow-visible" fill="none" viewBox="0 0 100 24">
            <path
              d="M0 18 Q 20 8 45 14 T 100 6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M0 18 Q 20 8 45 14 T 100 6 L 100 24 L 0 24 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: Publishing Reliability */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Độ Ổn Định Lịch Đăng
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary-container group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-on-surface tracking-tight font-headline-lg">
            {data.publishingReliability}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-tertiary">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          <span className="font-semibold">Zero Duplicate Guarantee</span>
          <span className="text-on-surface-variant font-normal">· Trễ {data.queueLatency}</span>
        </div>
        <div className="mt-4">
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: `${data.publishingReliability}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] font-mono text-on-surface-variant">
            <span>Uptime 100%</span>
            <span>0 Lỗi hàng đợi</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Published */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Tổng Bài Đã Đăng
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-on-surface tracking-tight font-headline-lg">
            {data.totalPublishedPosts}
          </span>
          <span className="text-sm text-on-surface-variant font-normal">bài</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
          <span className="font-semibold text-on-surface">{data.totalVariants}</span>
          <span>biến thể nội dung đa kênh</span>
        </div>
        <div className="mt-4 flex items-center gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[11px] font-semibold text-primary">
            FB 32
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[11px] font-semibold text-on-surface">
            IN 32
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[11px] font-semibold text-secondary">
            X 32
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[11px] font-semibold text-tertiary">
            TH 32
          </span>
        </div>
      </div>
    </div>
  );
};
