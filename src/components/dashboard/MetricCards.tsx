"use client";

import { MetricsSummary } from "@/types/dashboard";

interface MetricCardsProps {
  metrics: MetricsSummary;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Hạn mức AI Tháng */}
      <div className="bg-[#ffffff] p-4 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Hạn mức AI tháng
          </span>
          <span className="material-symbols-outlined text-[#6b38d4] text-[22px]">
            auto_awesome
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1">
            <span className="font-['Plus_Jakarta_Sans'] text-[36px] font-bold text-[#0b1c30] leading-none">
              {metrics.aiQuotaUsedPosts}
            </span>
            <span className="text-[18px] text-[#434655] font-normal">
              / {metrics.aiQuotaTotalPosts} bài
            </span>
          </div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#6b38d4] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.aiQuotaPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold bg-[#e9ddff] text-[#23005c] px-2 py-0.5 rounded-full">
            {metrics.aiPlanTier}
          </span>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#434655]">
            Reset sau {metrics.aiResetDays} ngày
          </span>
        </div>
      </div>

      {/* Card 2: Hàng đợi xuất bản & Phê duyệt */}
      <div className="bg-[#ffffff] p-4 rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Hàng đợi xuất bản
          </span>
          <span className="material-symbols-outlined text-[#004ac6] text-[22px]">
            schedule_send
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[36px] font-bold text-[#0b1c30] leading-none">
              {metrics.scheduledPostsCount}
            </span>
            <span className="text-[15px] font-medium text-[#434655]">đã lên lịch</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6b38d4]" />
            <span className="text-[12px] text-[#434655] font-medium">
              {metrics.pendingApprovalCount} bài chờ phê duyệt
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#006242]">
          <span className="material-symbols-outlined text-[16px]">trending_up</span>
          <span>{metrics.scheduledTrendLabel}</span>
        </div>
      </div>

      {/* Card 3: Độ tin cậy vận hành */}
      <div className="bg-[#ffffff] p-4 rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Độ tin cậy vận hành
          </span>
          <span className="material-symbols-outlined text-[#006242] text-[22px]">
            verified
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1">
            <span className="font-['Plus_Jakarta_Sans'] text-[36px] font-bold text-[#006242] leading-none">
              {metrics.reliabilityRate}%
            </span>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#6ffbbe] text-[#002113] px-2 py-0.5 rounded-full mt-1.5">
            <span className="material-symbols-outlined text-[14px]">format_image_left</span>
            <span>Zero Duplicate Guarantee</span>
          </div>
        </div>

        <div className="font-['JetBrains_Mono'] text-[12px] text-[#434655]">
          Độ trễ TB: <span className="text-[#006242] font-semibold">{metrics.avgLatencySeconds}s</span> &lt; 5s target
        </div>
      </div>

      {/* Card 4: Tiếp cận & Tương tác */}
      <div className="bg-[#ffffff] p-4 rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Tiếp cận & Tương tác
          </span>
          <span className="material-symbols-outlined text-[#2563eb] text-[22px]">
            insights
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1">
            <span className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] leading-none">
              {metrics.totalImpressions.toLocaleString()}
            </span>
          </div>
          <p className="text-[12px] text-[#434655] mt-1">Impressions (30 ngày)</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-[11px] font-semibold text-[#006242] bg-[#6ffbbe]/60 px-1.5 py-0.5 rounded">
            +{metrics.impressionsTrendMoM}% MoM
          </span>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#0b1c30] font-medium">
            {(metrics.totalEngagements / 1000).toFixed(1)}k Engagements
          </span>
        </div>
      </div>
    </div>
  );
}
