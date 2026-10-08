"use client";

import { AiInsightItem, AuditLogItem } from "@/types/dashboard";

interface RightWidgetsProps {
  insights: AiInsightItem[];
  auditLogs: AuditLogItem[];
}

export function RightDashboardWidgets({ insights, auditLogs }: RightWidgetsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Card Khuyến nghị từ AI Engine & Insights */}
      <div className="bg-[#ffffff] p-4 lg:p-6 rounded-xl shadow-xs flex flex-col gap-3 relative overflow-hidden border border-[#c3c6d7]/30">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#e9ddff]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#6b38d4] text-[22px]">
              psychology
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-semibold text-[#0b1c30]">
              AI Insights & Gợi ý
            </h2>
          </div>
          <span className="text-[10px] bg-[#6b38d4] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Algorithmic
          </span>
        </div>

        <div className="flex flex-col gap-2 relative z-10">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#eff4ff] flex flex-col gap-1 border border-[#c3c6d7]/20"
            >
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  item.type === "OPTIMAL_WINDOW" ? "text-[#004ac6]" : "text-[#6b38d4]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.type === "OPTIMAL_WINDOW" ? "query_builder" : "trending_up"}
                </span>
                <span className="text-[11px]">{item.title}</span>
              </div>

              <p className="text-[12px] text-[#0b1c30] leading-relaxed">
                {item.content}
              </p>

              {item.metricGainText && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#006242]">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>{item.metricGainText}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full py-2.5 px-4 rounded-xl bg-[#6b38d4] text-white hover:bg-[#8455ef] transition-all text-[13px] font-medium flex items-center justify-center gap-2 shadow-xs relative z-10 mt-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
          <span>Tạo bài viết với gợi ý này</span>
        </button>
      </div>

      {/* 2. Card Hoạt động gần nhất & Nhật ký kiểm toán (Audit Logs) */}
      <div className="bg-[#ffffff] p-4 lg:p-6 rounded-xl shadow-xs flex flex-col gap-3 border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#737686] text-[20px]">
              history_toggle_off
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-semibold text-[#0b1c30]">
              Nhật ký kiểm toán
            </h2>
          </div>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#006242] font-semibold">
            Real-time
          </span>
        </div>

        <div className="flex flex-col gap-4 relative pl-4 my-1">
          {/* Timeline vertical line */}
          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[#d3e4fe]" />

          {auditLogs.map((log) => {
            const dotColor =
              log.levelColor === "tertiary"
                ? "bg-[#007d55]"
                : log.levelColor === "secondary"
                ? "bg-[#6b38d4]"
                : "bg-[#004ac6]";

            return (
              <div key={log.id} className="flex items-start gap-2 relative">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${dotColor} ring-4 ring-[#ffffff] shrink-0 mt-0.5`}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#0b1c30]">
                      {log.timeText}
                    </span>
                    <span className="text-[11px] bg-[#e5eeff] px-1.5 rounded text-[#434655]">
                      {log.tag}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#434655] mt-0.5">
                    {log.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-1 border-t border-[#c3c6d7]/15">
          <button
            className="w-full py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#434655] text-[11px] font-medium transition-colors text-center"
            type="button"
          >
            Xem toàn bộ nhật ký (Audit Trail)
          </button>
        </div>
      </div>
    </div>
  );
}
