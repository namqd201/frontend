"use client";

import React from "react";
import { AiRecentActivity } from "@/types/pipeline";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";

interface RecentAiActivitiesProps {
  activities: AiRecentActivity[];
}

export function RecentAiActivities({ activities }: RecentAiActivitiesProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center">
        <Activity className="h-8 w-8 text-[#94A3B8] mx-auto mb-2" />
        <h4 className="text-sm font-medium text-[#0F172A]">Chưa có lịch sử gọi AI</h4>
        <p className="text-xs text-[#64748B] mt-1">
          Khi AI bắt đầu quét và tạo nội dung cho các bài viết, dữ liệu token và thời gian phản hồi sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#2563EB]" />
          <h3 className="font-semibold text-sm text-[#0F172A]">
            Lịch sử vận hành AI (Logs & Metrics)
          </h3>
        </div>
        <span className="text-xs text-[#64748B]">
          {activities.length} lượt gọi gần nhất
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
              <th className="py-2.5 px-4 font-medium">Thời gian</th>
              <th className="py-2.5 px-4 font-medium">Tính năng / Tác vụ</th>
              <th className="py-2.5 px-4 font-medium">Model</th>
              <th className="py-2.5 px-4 font-medium text-right">Tokens In / Out</th>
              <th className="py-2.5 px-4 font-medium text-right">Độ trễ</th>
              <th className="py-2.5 px-4 font-medium text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {activities.map((act) => {
              const isSuccess = act.status === "SUCCESS";
              const timeFormatted = new Date(act.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              const dateFormatted = new Date(act.createdAt).toLocaleDateString("vi-VN", {
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <tr key={act.id} className="hover:bg-[#F8FAFC]/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#64748B] whitespace-nowrap">
                    {timeFormatted} <span className="text-[10px] text-[#94A3B8]">({dateFormatted})</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                    {act.feature === "BATCH_GENERATION"
                      ? "Sinh bài tự động (Batch)"
                      : act.feature === "PREVIEW_POSTS"
                      ? "Xem trước góc nhìn (Preview)"
                      : act.feature || act.kind || "Tạo nội dung"}
                  </td>
                  <td className="py-3 px-4 text-[#2563EB] font-mono whitespace-nowrap">
                    {act.model || "gemini-3.8-flash"}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#334155] whitespace-nowrap">
                    <span className="text-[#64748B]">{act.promptTokens || 0}</span>
                    <span className="text-[#CBD5E1] mx-1">/</span>
                    <span className="font-semibold text-[#0F172A]">{act.completionTokens || 0}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#64748B] whitespace-nowrap">
                    {act.latencyMs ? `${act.latencyMs} ms` : "-"}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Thành công
                      </span>
                    ) : (
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full"
                        title={act.error || "Gặp lỗi"}
                      >
                        <XCircle className="h-3 w-3" />
                        Thất bại
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
