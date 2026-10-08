"use client";

interface BottomSchedulingBarProps {
  scheduledAt: string;
  setScheduledAt: (val: string) => void;
  requiresApproval: boolean;
  setRequiresApproval: (val: boolean) => void;
  platformCount: number;
}

export function BottomSchedulingBar({
  scheduledAt,
  setScheduledAt,
  requiresApproval,
  setRequiresApproval,
  platformCount,
}: BottomSchedulingBarProps) {
  // ISO conversion display
  const isoUtcString = scheduledAt
    ? new Date(scheduledAt).toISOString()
    : "2026-10-15T07:30:00Z";

  return (
    <div className="sticky bottom-0 z-30 bg-[#ffffff]/95 backdrop-blur-md px-6 py-3 shadow-lg flex flex-wrap items-center justify-between gap-4 border-t border-[#c3c6d7]/20">
      {/* Time Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#004ac6]">
            <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#737686] uppercase">
              Thời điểm đăng
            </span>
            <div className="flex items-center gap-1">
              <input
                className="text-[14px] text-[#0b1c30] font-bold bg-transparent outline-none cursor-pointer"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* UTC Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eff4ff] border border-[#c3c6d7]/20">
          <span className="material-symbols-outlined text-[#737686] text-[16px]">
            globe_asia
          </span>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#434655]">
            Quy đổi: {isoUtcString}
          </span>
        </div>

        {/* Approval Required Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
            className="w-4 h-4 rounded text-[#6b38d4] focus:ring-0 cursor-pointer"
          />
          <span className="text-[13px] text-[#0b1c30] font-medium">
            Yêu cầu Admin phê duyệt trước khi đăng (Approval Required)
          </span>
        </label>
      </div>

      {/* Confirmation Badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#002113] bg-[#6ffbbe] px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#006242] animate-ping" />
          <span>Sẵn sàng lập lịch cho {platformCount} kênh</span>
        </div>
      </div>
    </div>
  );
}
