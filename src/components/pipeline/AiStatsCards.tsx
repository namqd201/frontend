"use client";

import React from "react";
import { Sparkles, Clock, CheckCircle2, AlertTriangle, Zap, Bot } from "lucide-react";

interface AiStatsCardsProps {
  totalPlanned: number;
  totalGenerating: number;
  totalReady: number;
  totalFailed: number;
}

export function AiStatsCards({
  totalPlanned,
  totalGenerating,
  totalReady,
  totalFailed,
}: AiStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      {/* Đang tạo */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B]">Đang viết bài</span>
          <div className="h-7 w-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Sparkles className="h-4 w-4 animate-spin text-[#2563EB]" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0F172A]">{totalGenerating}</span>
          <span className="text-xs text-[#2563EB] font-medium">real-time</span>
        </div>
        <div className="mt-2 text-[11px] text-[#64748B]">
          AI đang gọi Gemini tạo bài
        </div>
      </div>

      {/* Trong hàng đợi */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B]">Trong hàng đợi</span>
          <div className="h-7 w-7 rounded-lg bg-[#F8FAFC] text-[#64748B] flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0F172A]">{totalPlanned}</span>
          <span className="text-xs text-[#64748B]">bài chờ</span>
        </div>
        <div className="mt-2 text-[11px] text-[#64748B]">
          Đang xếp lịch tự động sinh
        </div>
      </div>

      {/* Sẵn sàng đăng */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B]">Đã xong & Sẵn sàng</span>
          <div className="h-7 w-7 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0F172A]">{totalReady}</span>
          <span className="text-xs text-[#16A34A] font-medium">bài đã sinh</span>
        </div>
        <div className="mt-2 text-[11px] text-[#64748B]">
          Đã kiểm duyệt & lên lịch
        </div>
      </div>

      {/* Gặp lỗi */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#64748B]">Cần chú ý / Lỗi</span>
          <div className="h-7 w-7 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0F172A]">{totalFailed}</span>
          <span className="text-xs text-[#DC2626]">bài lỗi</span>
        </div>
        <div className="mt-2 text-[11px] text-[#64748B]">
          Tự động retry tiếp theo
        </div>
      </div>

      {/* Card Model AI */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-sm col-span-2 md:col-span-4 lg:col-span-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-100">Model AI Chủ lực</span>
          <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-base font-bold text-white truncate">Gemini 3.8 Flash Pro</div>
        <div className="mt-2 text-[11px] text-blue-100 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
          <span>Unlimited · Pro Unlocked</span>
        </div>
      </div>
    </div>
  );
}
