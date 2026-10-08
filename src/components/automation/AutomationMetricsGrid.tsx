"use client";

import React from "react";
import { AutomationDashboardData } from "@/types/automation";

interface AutomationMetricsGridProps {
  data: AutomationDashboardData;
}

export const AutomationMetricsGrid: React.FC<AutomationMetricsGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Active Workflows */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-outline font-semibold">Quy trình chạy</span>
          <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-on-surface font-headline-lg">{data.activeWorkflowsCount}</span>
            <span className="text-xs text-on-surface-variant">/ {data.totalWorkflowsCount} tổng thể</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-mono text-xs text-tertiary font-semibold">Active Workflows</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Auto Published Posts */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-outline font-semibold">Đã tự động xuất bản</span>
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-headline-lg">{data.autoPublishedPostsMonth}</span>
            <span className="text-xs text-tertiary flex items-center font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +{data.growthPercent}%
            </span>
          </div>
          <span className="font-mono text-xs text-on-surface-variant block mt-1">Tháng này (Kỳ 10/2026)</span>
        </div>
      </div>

      {/* Metric 3: Precision Metric */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-outline font-semibold">Độ chính xác lịch biểu</span>
          <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-headline-lg">{data.precisionSla}%</span>
            <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded font-bold">
              SLA
            </span>
          </div>
          <span className="font-mono text-xs text-on-surface-variant block mt-1">
            Độ trễ trung bình {data.avgLatency}
          </span>
        </div>
      </div>

      {/* Metric 4: Next Execution */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-surface-container-high rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-outline font-semibold">Giờ chạy kế tiếp</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-headline-lg">{data.nextRunTime}</span>
            <span className="text-xs text-secondary font-semibold">{data.nextRunDay}</span>
          </div>
          <span className="font-mono text-xs text-on-surface-variant block mt-1">Múi giờ {data.timezone}</span>
        </div>
      </div>
    </div>
  );
};
