"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { ScheduleSummary } from "@/types/post";

export function AttentionBanner() {
  const [summary, setSummary] = useState<ScheduleSummary | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get<{ data: ScheduleSummary }>("/api/v1/schedule/summary");
        if (res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        // Silently ignore if unauthorized or loading
      }
    }

    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || !summary || summary.needsAttention === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 max-w-4xl">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          <strong>Cần xử lý:</strong> Có <strong>{summary.needsAttention}</strong> bài đăng gặp lỗi hoặc cần bạn xem lại trước khi tiếp tục.
        </span>
        <Link
          href="/posts?status=NEEDS_REVIEW"
          className="inline-flex items-center gap-1 font-medium text-amber-700 hover:text-amber-900 underline ml-2"
        >
          Xem chi tiết <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-100 rounded text-amber-700 transition"
        title="Đóng thông báo"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
