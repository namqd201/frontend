"use client";

import React from "react";
import { AutomationWorkflowItem } from "@/types/automation";

interface AutomationWorkflowsListProps {
  workflows: AutomationWorkflowItem[];
  onToggleActive: (id: string, active: boolean) => void;
  onTriggerNow: (id: string) => void;
  onEdit: (id: string) => void;
}

export const AutomationWorkflowsList: React.FC<AutomationWorkflowsListProps> = ({
  workflows,
  onToggleActive,
  onTriggerNow,
  onEdit,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-on-surface font-headline-sm">Quy trình tự động hoạt động</h2>
          <span className="text-xs bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full font-medium">
            {workflows.length} Cấu hình
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {workflows.map((wf) => {
          return (
            <div
              key={wf.id}
              className={`bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-4 group ${
                !wf.active ? "opacity-80" : ""
              }`}
            >
              {/* Top Row: Title, Mode, Cron, Switch & Trigger */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      wf.mode === "GENERATE_AND_SCHEDULE"
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : wf.mode === "REQUIRE_APPROVAL"
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : wf.mode === "GENERATE_ONLY"
                        ? "bg-surface-container text-primary"
                        : "bg-surface-container-high text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{wf.iconName}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface">{wf.name}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold ${
                          wf.active
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-surface-container-high text-outline"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {wf.mode === "GENERATE_AND_SCHEDULE"
                            ? "bolt"
                            : wf.mode === "REQUIRE_APPROVAL"
                            ? "gavel"
                            : wf.mode === "GENERATE_ONLY"
                            ? "draft"
                            : "link"}
                        </span>
                        {wf.mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                      <div className="flex items-center gap-1 font-mono bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[13px] text-outline">terminal</span>
                        <span className="text-on-surface font-semibold">{wf.cronExpression}</span>
                      </div>
                      <span>{wf.scheduleDescription}</span>
                    </div>
                  </div>
                </div>

                {/* Switch & Action Buttons */}
                <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface font-medium">
                      {wf.active ? "Đang kích hoạt" : "Tạm dừng"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={wf.active}
                      onClick={() => onToggleActive(wf.id, !wf.active)}
                      className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors focus:outline-none ${
                        wf.active ? "bg-primary" : "bg-surface-container-highest"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
                          wf.active
                            ? "bg-on-primary translate-x-5"
                            : "bg-on-surface-variant translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="h-5 w-px bg-surface-container-high hidden sm:block" />

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTriggerNow(wf.id)}
                      className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Chạy ngay lập tức"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </button>
                    <button
                      onClick={() => onEdit(wf.id)}
                      className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Chỉnh sửa cấu hình"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Prompt Instruction & Target Channels */}
              <div className="bg-surface-container-low/70 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-outline-variant/20">
                <div className="flex items-start gap-2 max-w-2xl text-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                    psychology
                  </span>
                  <p className="text-on-surface italic">{wf.promptInstruction}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="text-outline uppercase tracking-wider text-[11px] font-semibold">Phân phối:</span>
                  <div className="flex items-center gap-1">
                    {wf.targetPlatforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2 py-0.5 rounded bg-surface-container-lowest font-mono text-[10px] font-bold text-on-surface shadow-xs border border-outline-variant/20"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meta Footers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  <span>Lần chạy trước:</span>
                  <span className="font-mono text-on-surface font-semibold">{wf.lastRunText}</span>
                  <span className="text-tertiary font-medium">{wf.lastRunStatusText}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-outline">update</span>
                  <span>Lần chạy kế tiếp:</span>
                  <span className="font-mono text-secondary font-bold">{wf.nextRunText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
