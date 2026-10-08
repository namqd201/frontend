"use client";

import React from "react";
import { AutomationWorkflowRunLogItem } from "@/types/automation";

interface AutomationRunsLogTableProps {
  logs: AutomationWorkflowRunLogItem[];
  onRefresh: () => void;
  onViewDetails: (log: AutomationWorkflowRunLogItem) => void;
}

export const AutomationRunsLogTable: React.FC<AutomationRunsLogTableProps> = ({
  logs,
  onRefresh,
  onViewDetails,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-on-surface font-headline-sm">
            Nhật ký thực thi gần nhất (Automation Runs Log)
          </h2>
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="h-8 px-3 rounded-xl bg-surface-container-lowest text-on-surface-variant text-xs hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-xs border border-outline-variant/30 font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-xs overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low h-10 text-xs uppercase tracking-wider text-outline font-semibold">
                <th className="px-5">ID Lượt chạy</th>
                <th className="px-5">Tên quy trình</th>
                <th className="px-5">Thời gian bắt đầu (UTC+7)</th>
                <th className="px-5">Thời gian hoàn tất</th>
                <th className="px-5">Bài sinh ra (Post ID)</th>
                <th className="px-5">Trạng thái</th>
                <th className="px-5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs text-on-surface">
              {logs.map((log) => {
                const isRunning = log.status === "RUNNING";
                const isSuccess = log.status === "SUCCESS";
                const isFailed = log.status === "FAILED";

                return (
                  <tr
                    key={log.runId}
                    className={`hover:bg-surface-container-low/50 transition-colors h-14 ${
                      isFailed ? "bg-error-container/10" : ""
                    }`}
                  >
                    <td className="px-5 font-mono font-semibold">{log.runId}</td>
                    <td className="px-5 font-semibold text-on-surface">{log.workflowName}</td>
                    <td className="px-5 font-mono text-on-surface-variant">{log.startTime}</td>
                    <td className="px-5 font-mono">
                      {isRunning ? (
                        <span className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                          {log.durationOrEndTime}
                        </span>
                      ) : (
                        <span className={isFailed ? "text-error" : "text-on-surface-variant"}>
                          {log.durationOrEndTime}
                        </span>
                      )}
                    </td>
                    <td className="px-5 font-mono">
                      {log.generatedPostIds && log.generatedPostIds.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {log.generatedPostIds.map((pid) => (
                            <span
                              key={pid}
                              className="bg-surface-container-low text-primary px-1.5 py-0.5 rounded font-medium"
                            >
                              {pid}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-outline">{isFailed ? "—" : "Chờ payload..."}</span>
                      )}
                    </td>
                    <td className="px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isSuccess
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : isFailed
                            ? "bg-error-container text-on-error-container"
                            : "bg-primary-fixed text-on-primary-fixed"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSuccess
                              ? "bg-tertiary-container"
                              : isFailed
                              ? "bg-error"
                              : "bg-primary animate-pulse"
                          }`}
                        />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 text-right">
                      {isFailed ? (
                        <button
                          onClick={() => onViewDetails(log)}
                          className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors text-[11px] font-semibold flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          <span>Xem lỗi</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onViewDetails(log)}
                          className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isRunning ? "terminal" : "visibility"}
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
