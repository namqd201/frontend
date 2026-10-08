"use client";

import { useState } from "react";
import { QueuePostItem } from "@/types/dashboard";

interface UpcomingQueueProps {
  posts: QueuePostItem[];
  onRefresh?: () => void;
}

export function UpcomingQueueSection({ posts }: UpcomingQueueProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "TODAY" | "WEEK">("ALL");

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "FACEBOOK":
        return <span key={platform} className="p-1 rounded bg-[#ffffff]" title="Facebook"><span className="material-symbols-outlined text-[16px] text-[#004ac6]">thumb_up</span></span>;
      case "X":
        return <span key={platform} className="p-1 rounded bg-[#ffffff]" title="X"><span className="material-symbols-outlined text-[16px] text-[#0b1c30]">tag</span></span>;
      case "LINKEDIN":
        return <span key={platform} className="p-1 rounded bg-[#ffffff]" title="LinkedIn"><span className="material-symbols-outlined text-[16px] text-[#6b38d4]">business_center</span></span>;
      case "THREADS":
        return <span key={platform} className="p-1 rounded bg-[#ffffff]" title="Threads"><span className="material-symbols-outlined text-[16px] text-[#004ac6]">forum</span></span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#ffffff] p-4 lg:p-6 rounded-xl shadow-xs flex flex-col gap-4 border border-[#c3c6d7]/30">
      {/* Queue Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#c3c6d7]/15">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
            queue_play_next
          </span>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-semibold text-[#0b1c30]">
              Hàng đợi xuất bản sắp tới (Next in Queue)
            </h2>
            <p className="text-[12px] text-[#434655]">
              Tự động hoá phân phối bài viết đa luồng
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#e5eeff] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeFilter === "ALL"
                ? "bg-[#ffffff] text-[#0b1c30] shadow-xs"
                : "text-[#434655] hover:text-[#0b1c30]"
            }`}
            type="button"
          >
            Tất cả ({posts.length})
          </button>
          <button
            onClick={() => setActiveFilter("TODAY")}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeFilter === "TODAY"
                ? "bg-[#ffffff] text-[#0b1c30] shadow-xs"
                : "text-[#434655] hover:text-[#0b1c30]"
            }`}
            type="button"
          >
            Hôm nay (2)
          </button>
          <button
            onClick={() => setActiveFilter("WEEK")}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeFilter === "WEEK"
                ? "bg-[#ffffff] text-[#0b1c30] shadow-xs"
                : "text-[#434655] hover:text-[#0b1c30]"
            }`}
            type="button"
          >
            Tuần này (9)
          </button>
        </div>
      </div>

      {/* List Bài Viết */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] transition-all flex flex-col gap-3 group border border-[#c3c6d7]/20"
          >
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 font-['JetBrains_Mono'] text-[12px] font-semibold px-2.5 py-1 rounded-lg ${
                    post.status === "SCHEDULED"
                      ? "bg-[#dbe1ff] text-[#00174b]"
                      : "bg-[#dce9ff] text-[#434655]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">alarm</span>
                  {post.scheduledTimeText}
                </span>

                <div className="flex items-center gap-1 text-[#434655]">
                  {post.platforms.map((p) => getPlatformIcon(p))}
                </div>

                {post.isPollThread && (
                  <span className="text-[11px] bg-[#dce9ff] px-2 py-0.5 rounded text-[#0b1c30] font-semibold">
                    POLL THREAD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {post.status === "SCHEDULED" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#6ffbbe] text-[#002113] px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007d55]" />
                    {post.statusLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#e9ddff] text-[#23005c] px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] animate-pulse" />
                    {post.statusLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Post Card Content */}
            <div className="flex flex-col md:flex-row gap-3">
              {post.mediaThumbnailUrl && (
                <div className="w-full md:w-44 h-24 rounded-lg overflow-hidden shrink-0 bg-[#d3e4fe]">
                  <img
                    className="w-full h-full object-cover"
                    src={post.mediaThumbnailUrl}
                    alt={post.title}
                  />
                </div>
              )}

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <h3 className="text-[15px] text-[#0b1c30] font-semibold truncate hover:text-[#004ac6] cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-[12px] text-[#434655] line-clamp-2 mt-1">
                  {post.contentPreview}
                </p>

                <div className="flex items-center justify-between pt-1 mt-1">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#737686]">
                    {post.authorName
                      ? `Người tạo: ${post.authorName}`
                      : `ID: ${post.postNumber} · ${post.nodeRouteText}`}
                  </span>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    {post.status === "PENDING_APPROVAL" && (
                      <button
                        className="px-2.5 py-1 rounded-lg bg-[#006242] text-white hover:bg-[#007d55] text-[11px] font-semibold transition-colors flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Duyệt nhanh</span>
                      </button>
                    )}

                    <button
                      className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#0053db] hover:text-white text-[#434655] transition-colors"
                      title="Xem trước"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#004ac6] hover:text-white text-[#434655] transition-colors"
                      title="Chỉnh sửa"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#dce9ff] text-[#434655] transition-colors"
                      title="Dời lịch"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom pagination / link */}
      <div className="flex items-center justify-between pt-1 border-t border-[#c3c6d7]/15">
        <span className="text-[12px] text-[#434655]">
          Hiển thị {posts.length} / 14 bài trong hàng đợi
        </span>
        <button
          className="text-[13px] text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
          type="button"
        >
          <span>Xem toàn bộ lịch xuất bản</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
