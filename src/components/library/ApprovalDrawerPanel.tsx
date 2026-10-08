"use client";

import { useState } from "react";
import { PostListItem } from "@/types/library";

interface ApprovalDrawerProps {
  post: PostListItem | null;
  onApprove: (post: PostListItem) => void;
  onReject: (post: PostListItem, reason: string) => void;
  loading: boolean;
}

export function ApprovalDrawerPanel({
  post,
  onApprove,
  onReject,
  loading,
}: ApprovalDrawerProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [activePreview, setActivePreview] = useState<"LINKEDIN" | "FACEBOOK">("LINKEDIN");

  if (!post) {
    return (
      <div className="bg-[#ffffff] rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center gap-3 border border-[#c3c6d7]/30 min-h-[400px]">
        <span className="material-symbols-outlined text-[36px] text-[#737686]">
          touch_app
        </span>
        <p className="text-[14px] text-[#434655] font-medium">
          Chọn một bài viết ở bảng bên trái để xem chi tiết và phê duyệt.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] rounded-xl shadow-md p-4 lg:p-6 flex flex-col gap-4 sticky top-20 border border-[#c3c6d7]/30">
      {/* Drawer Header with Workflow Meta */}
      <div className="flex items-start justify-between pb-3 border-b border-[#eff4ff]">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#6b38d4]">approval</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#0b1c30] font-bold">
              Phê duyệt bài viết
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#6b38d4] font-semibold">
            Mã kiểm duyệt: {post.postNumber}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-[#e9ddff] text-[#23005c] font-bold uppercase tracking-wider">
          {post.statusLabel}
        </span>
      </div>

      {/* Creator Submission Card */}
      <div className="p-3 rounded-xl bg-[#eff4ff] flex flex-col gap-1 border border-[#c3c6d7]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-['JetBrains_Mono'] text-[12px] font-bold shadow-xs">
              {post.author.avatarText || "HN"}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] text-[#0b1c30] font-semibold leading-tight">
                {post.author.name}
              </span>
              <span className="text-[11px] text-[#737686]">
                Content Creator • Marketing Team
              </span>
            </div>
          </div>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#434655] bg-[#ffffff] px-2 py-0.5 rounded shadow-xs">
            09:30 UTC+7
          </span>
        </div>

        {post.submissionNote && (
          <div className="mt-1 text-[#434655] text-[12px] italic bg-[#ffffff]/80 p-2 rounded-lg">
            {post.submissionNote}
          </div>
        )}
      </div>

      {/* Multi-channel Target & Schedule Context */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#c3c6d7]/20">
          <span className="text-[11px] text-[#737686] uppercase font-semibold">
            Nền tảng phát sóng
          </span>
          <div className="flex items-center gap-1.5 text-[12px] text-[#0b1c30] font-semibold">
            <span className="w-5 h-5 rounded bg-[#dbe1ff] text-[#00174b] flex items-center justify-center font-['JetBrains_Mono'] text-[10px]">
              f
            </span>
            <span>Facebook</span>
            <span className="text-[#c3c6d7]">•</span>
            <span className="w-5 h-5 rounded bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center font-['JetBrains_Mono'] text-[10px]">
              in
            </span>
            <span>LinkedIn</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#c3c6d7]/20">
          <span className="text-[11px] text-[#737686] uppercase font-semibold">Khung giờ hẹn</span>
          <div className="flex items-center gap-1 text-[12px] text-[#0b1c30] font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#006242]">schedule</span>
            <span>{post.scheduledTimeText}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Post Preview Screen */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#737686] uppercase font-semibold">
            Bản xem trước (Feed Simulator)
          </span>
          <div className="flex gap-1 text-[11px]">
            <span
              onClick={() => setActivePreview("LINKEDIN")}
              className={`cursor-pointer ${
                activePreview === "LINKEDIN"
                  ? "text-[#004ac6] font-semibold underline"
                  : "text-[#737686] hover:text-[#0b1c30]"
              }`}
            >
              LinkedIn View
            </span>
            <span className="text-[#737686]">|</span>
            <span
              onClick={() => setActivePreview("FACEBOOK")}
              className={`cursor-pointer ${
                activePreview === "FACEBOOK"
                  ? "text-[#004ac6] font-semibold underline"
                  : "text-[#737686] hover:text-[#0b1c30]"
              }`}
            >
              Facebook View
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#ffffff] shadow-xs flex flex-col gap-3 border border-[#c3c6d7]/20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#004ac6] flex items-center justify-center text-white font-bold text-[14px]">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] text-[#0b1c30] font-bold">Acme Growth Studio</span>
              <span className="text-[11px] text-[#737686]">Được tài trợ • {post.scheduledTimeText}</span>
            </div>
          </div>

          <div className="text-[13px] text-[#0b1c30] leading-relaxed whitespace-pre-line">
            {post.baseContent}
          </div>

          {/* Featured Media Asset */}
          {post.mediaThumbnailUrl && (
            <div className="w-full h-44 rounded-lg overflow-hidden relative shadow-xs bg-[#dce9ff]">
              <img
                className="w-full h-full object-cover"
                src={post.mediaThumbnailUrl}
                alt="Media Preview"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#213145]/80 text-[#eaf1ff] font-['JetBrains_Mono'] text-[10px] backdrop-blur-xs">
                Visual Asset: 1920x1080 (HD PNG) • AI Gen
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Decision Controls (Admin / Approver) */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#eff4ff]">
        {/* Rejection Reason Input */}
        <div className="flex flex-col gap-1">
          <label
            className="text-[11px] text-[#434655] font-medium"
            htmlFor="rejectionReason"
          >
            Lý do từ chối (Gửi phản hồi nếu yêu cầu sửa lại):
          </label>
          <input
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full h-9 px-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[12px] placeholder:text-[#737686] focus:outline-none focus:ring-1 focus:ring-[#ba1a1a] border border-[#c3c6d7]/20"
            placeholder="VD: Cần chỉnh lại hashtag, cập nhật thêm CTA vào website..."
            type="text"
          />
        </div>

        {/* Approval Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => onReject(post, rejectionReason)}
            disabled={loading}
            className="h-10 px-3 rounded-xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>✕ Từ chối (Reject)</span>
          </button>

          <button
            onClick={() => onApprove(post)}
            disabled={loading}
            className="h-10 px-3 rounded-xl bg-[#007d55] text-white hover:bg-[#006242] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>✓ Phê duyệt (Approve)</span>
          </button>
        </div>

        <p className="text-center font-['JetBrains_Mono'] text-[11px] text-[#737686]">
          Hệ thống sẽ lập tức gửi thông báo qua Slack & In-app cho Creator.
        </p>
      </div>
    </div>
  );
}
