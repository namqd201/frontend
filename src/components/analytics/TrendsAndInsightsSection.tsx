"use client";

import React, { useState } from "react";
import { AIInsightItem, DailyMetricPoint } from "@/types/analytics";

interface TrendsAndInsightsSectionProps {
  chartPoints: DailyMetricPoint[];
  peakHighlight: string;
  insights: AIInsightItem[];
  onApplyInsights: () => void;
}

export const TrendsAndInsightsSection: React.FC<TrendsAndInsightsSectionProps> = ({
  chartPoints,
  peakHighlight,
  insights,
  onApplyInsights,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      {/* 1. Growth & Engagement Trends Chart (2 Columns wide) */}
      <div className="xl:col-span-2 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-on-surface font-headline-sm">
              Tăng trưởng Lượt tiếp cận & Tương tác
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tần suất tương tác thời gian thực gắn liền cùng các chiến dịch chính
            </p>
          </div>

          {/* Channel Filter Badges */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl text-xs">
            {["ALL", "LINKEDIN", "FACEBOOK", "X", "THREADS"].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedChannel === ch
                    ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {ch === "ALL" ? "Tất cả" : ch === "LINKEDIN" ? "LinkedIn" : ch === "FACEBOOK" ? "Facebook" : ch}
              </button>
            ))}
          </div>
        </div>

        {/* Legend and Milestone Annotation Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-on-surface font-medium">Lượt tiếp cận (Reach)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-on-surface font-medium">Lượt tương tác (Engagements)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-xs">
            <span className="material-symbols-outlined text-primary text-[14px]">flag</span>
            <span>
              Mốc: <strong>Tuần lễ ra mắt v2 (01 - 07 Th10)</strong>
            </span>
          </div>
        </div>

        {/* Visual SVG Chart Graph */}
        <div className="w-full h-72 pt-2 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
            <defs>
              <linearGradient id="reachGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="engGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#6b38d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6b38d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line stroke="#dce9ff" strokeDasharray="3 3" x1="0" x2="700" y1="40" y2="40" />
            <line stroke="#dce9ff" strokeDasharray="3 3" x1="0" x2="700" y1="100" y2="100" />
            <line stroke="#dce9ff" strokeDasharray="3 3" x1="0" x2="700" y1="160" y2="160" />
            <line stroke="#dce9ff" x1="0" x2="700" y1="220" y2="220" />

            {/* Milestone Vertical Highlight (Launch v2) */}
            <rect fill="#2563eb" fillOpacity="0.05" height="200" rx="6" width="80" x="340" y="20" />
            <line stroke="#2563eb" strokeDasharray="4 2" strokeWidth="1.5" x1="380" x2="380" y1="20" y2="220" />

            {/* Area & Line: Reach */}
            <path
              d="M 0 170 Q 100 160 180 140 T 350 70 T 520 110 T 700 35 L 700 220 L 0 220 Z"
              fill="url(#reachGradient)"
            />
            <path
              d="M 0 170 Q 100 160 180 140 T 350 70 T 520 110 T 700 35"
              fill="none"
              stroke="#004ac6"
              strokeLinecap="round"
              strokeWidth="3"
            />

            {/* Area & Line: Engagement */}
            <path
              d="M 0 200 Q 100 195 180 175 T 350 120 T 520 160 T 700 95 L 700 220 L 0 220 Z"
              fill="url(#engGradient)"
            />
            <path
              d="M 0 200 Q 100 195 180 175 T 350 120 T 520 160 T 700 95"
              fill="none"
              stroke="#6b38d4"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Dynamic Data Dots */}
            <circle cx="380" cy="74" fill="#004ac6" r="5" stroke="#ffffff" strokeWidth="2" />
            <circle cx="380" cy="125" fill="#6b38d4" r="4.5" stroke="#ffffff" strokeWidth="2" />
            <circle cx="700" cy="35" fill="#004ac6" r="5" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Timeline X-Axis Labels */}
          <div className="flex justify-between items-center pt-2 font-mono text-[11px] text-outline">
            {chartPoints.map((pt, idx) => (
              <span key={idx} className={pt.isMilestone ? "text-primary font-bold" : ""}>
                {pt.dateLabel} {pt.isMilestone ? "(Peak Launch)" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Peak highlight banner */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            <span className="text-on-surface">{peakHighlight}</span>
          </div>
          <button className="text-primary font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2">
            Chi tiết phiên <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 2. AI Performance Insights & Optimization Suggestions */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </span>
              <h3 className="text-base font-bold text-on-surface font-headline-sm">AI Smart Insights</h3>
            </div>
            <span className="text-[11px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Tối Ưu Hoá
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 mb-4">
            Phân tích hành vi khán giả dựa trên 32 bài đăng và 128 biến thể đa kênh.
          </p>

          <div className="space-y-3">
            {insights.map((item) => {
              let iconColor = "text-primary";
              let badgeColor = "text-primary";
              if (item.impactColor === "secondary") {
                iconColor = "text-secondary";
                badgeColor = "text-secondary";
              } else if (item.impactColor === "tertiary") {
                iconColor = "text-tertiary";
                badgeColor = "text-tertiary";
              }

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-surface-container-low/70 space-y-1 hover:bg-surface-container-low transition-colors border border-outline-variant/20"
                >
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${iconColor}`}>
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <div
                    className="text-xs text-on-surface leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.contentHtml }}
                  />
                  <div className={`flex items-center gap-1.5 text-[11px] pt-1 font-semibold ${badgeColor}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {item.impactColor === "secondary" ? "star" : item.impactColor === "tertiary" ? "arrow_upward" : "chat"}
                    </span>
                    <span>{item.impactBadge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onApplyInsights}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
          <span>Áp dụng gợi ý AI vào Lịch đăng</span>
        </button>
      </div>
    </div>
  );
};
