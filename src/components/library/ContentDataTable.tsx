"use client";

import { PostListItem } from "@/types/library";

interface DataTableProps {
  posts: PostListItem[];
  selectedPostId: string | null;
  onSelectPost: (post: PostListItem) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  onToggleSelectAll: () => void;
  onQuickApprove?: (post: PostListItem) => void;
}

export function ContentDataTable({
  posts,
  selectedPostId,
  onSelectPost,
  selectedIds,
  onToggleSelectId,
  onToggleSelectAll,
}: DataTableProps) {
  const isAllSelected = posts.length > 0 && selectedIds.length === posts.length;

  return (
    <div className="bg-[#ffffff] rounded-xl shadow-xs overflow-hidden flex flex-col border border-[#c3c6d7]/30">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] text-[#434655] text-[11px] font-semibold uppercase select-none border-b border-[#c3c6d7]/20">
              <th className="py-3 px-3 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-[#004ac6] cursor-pointer w-4 h-4"
                />
              </th>
              <th className="py-3 px-3 min-w-[280px]">Tiêu đề & Nội dung tóm tắt</th>
              <th className="py-3 px-3 min-w-[130px]">Nền tảng</th>
              <th className="py-3 px-3 min-w-[130px]">Tác giả</th>
              <th className="py-3 px-3 min-w-[140px]">Lịch hẹn (UTC+7)</th>
              <th className="py-3 px-3 min-w-[130px]">Trạng thái</th>
              <th className="py-3 px-3 w-28 text-right pr-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff4ff] text-[12px]">
            {posts.map((post) => {
              const isSelected = selectedPostId === post.id;
              const isChecked = selectedIds.includes(post.id);

              return (
                <tr
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className={`transition-colors group cursor-pointer ${
                    isSelected
                      ? "bg-[#e9ddff]/25 hover:bg-[#e9ddff]/35"
                      : "hover:bg-[#eff4ff]/60"
                  }`}
                >
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectId(post.id)}
                      className="rounded text-[#004ac6] cursor-pointer w-4 h-4"
                    />
                  </td>

                  {/* Title & Summary */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#dce9ff] shadow-xs">
                        {post.mediaThumbnailUrl ? (
                          <img
                            className="w-full h-full object-cover"
                            src={post.mediaThumbnailUrl}
                            alt={post.title}
                          />
                        ) : (
                          <div className="w-full h-full bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
                            <span className="material-symbols-outlined text-[24px]">broken_image</span>
                          </div>
                        )}
                        {post.isAiGenerated && (
                          <span className="absolute bottom-1 right-1 bg-[#0b1c30]/80 text-white font-['JetBrains_Mono'] text-[9px] px-1 rounded">
                            AI
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-['JetBrains_Mono'] text-[12px] font-semibold ${
                              post.status === "FAILED"
                                ? "text-[#ba1a1a]"
                                : post.status === "PENDING_APPROVAL"
                                ? "text-[#6b38d4]"
                                : "text-[#737686]"
                            }`}
                          >
                            {post.postNumber}
                          </span>
                          {post.categoryBadge && (
                            <span
                              className={`text-[10px] px-1.5 rounded font-semibold ${
                                post.categoryBadge === "Cần duyệt gấp"
                                  ? "bg-[#e9ddff] text-[#23005c]"
                                  : post.categoryBadge === "Lỗi API Token"
                                  ? "bg-[#ffdad6] text-[#93000a]"
                                  : post.categoryBadge === "Auto Evergreen"
                                  ? "bg-[#6ffbbe] text-[#002113]"
                                  : "bg-[#e5eeff] text-[#434655]"
                              }`}
                            >
                              {post.categoryBadge}
                            </span>
                          )}
                        </div>

                        <span
                          className={`font-['Plus_Jakarta_Sans'] text-[14px] font-semibold truncate hover:underline ${
                            post.status === "FAILED" ? "text-[#ba1a1a]" : "text-[#0b1c30]"
                          }`}
                        >
                          {post.title}
                        </span>

                        <p
                          className={`line-clamp-1 ${
                            post.status === "FAILED" ? "text-[#ba1a1a]" : "text-[#434655]"
                          }`}
                        >
                          {post.summary}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Platforms */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {post.platforms.map((p, idx) => {
                        let bgClass = "bg-[#e5eeff] text-[#0b1c30]";
                        if (p.iconText === "f" || p.iconText === "✓") bgClass = "bg-[#dbe1ff] text-[#00174b]";
                        if (p.iconText === "!") bgClass = "bg-[#ffdad6] text-[#93000a]";

                        return (
                          <div
                            key={idx}
                            title={p.tooltip}
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold ${bgClass}`}
                          >
                            {p.iconText}
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {post.author.isAi ? (
                        <div className="w-6 h-6 rounded-full bg-[#6b38d4] text-white flex items-center justify-center text-[10px]">
                          <span className="material-symbols-outlined text-[13px]">smart_toy</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-['JetBrains_Mono'] text-[10px] font-bold">
                          {post.author.avatarText || "HN"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#0b1c30] font-medium leading-none">
                          {post.author.name}
                        </span>
                        <span
                          className={`text-[10px] leading-tight ${
                            post.author.isAi ? "text-[#6b38d4] font-semibold" : "text-[#737686]"
                          }`}
                        >
                          {post.author.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Scheduled Time */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col font-['JetBrains_Mono'] text-[12px]">
                      <span
                        className={`font-medium ${
                          post.status === "FAILED" ? "text-[#ba1a1a]" : "text-[#0b1c30]"
                        }`}
                      >
                        {post.scheduledTimeText}
                      </span>
                      <span
                        className={`text-[11px] ${
                          post.status === "PUBLISHED"
                            ? "text-[#006242] font-semibold"
                            : "text-[#737686]"
                        }`}
                      >
                        {post.relativeTimeText}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {post.status === "PENDING_APPROVAL" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#e9ddff] text-[#23005c] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] animate-ping" />
                        {post.statusLabel}
                      </span>
                    )}

                    {post.status === "SCHEDULED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#dce9ff] text-[#004ac6] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
                        {post.statusLabel}
                      </span>
                    )}

                    {post.status === "PUBLISHED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#6ffbbe] text-[#002113] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#007d55]" />
                        {post.statusLabel}
                      </span>
                    )}

                    {post.status === "FAILED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#ffdad6] text-[#93000a] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {post.statusLabel}
                      </span>
                    )}

                    {post.status === "PARTIALLY_PUBLISHED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#e5eeff] text-[#0b1c30] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4]" />
                        {post.statusLabel}
                      </span>
                    )}
                  </td>

                  {/* Row Actions */}
                  <td
                    className="py-3 px-3 text-right pr-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "PENDING_APPROVAL" && (
                        <button
                          onClick={() => onSelectPost(post)}
                          className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#004ac6] transition-colors"
                          title="Xem & Phê duyệt"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[20px]">fact_check</span>
                        </button>
                      )}

                      {post.status === "FAILED" && (
                        <button
                          className="px-2 py-1 rounded-lg bg-[#dce9ff] text-[#004ac6] hover:bg-[#004ac6] hover:text-white text-[11px] font-semibold transition-all"
                          type="button"
                        >
                          Thử lại
                        </button>
                      )}

                      {post.status !== "FAILED" && (
                        <>
                          <button
                            className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#737686] hover:text-[#0b1c30] transition-colors"
                            title="Chỉnh sửa"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#737686] hover:text-[#ba1a1a] transition-colors"
                            title="Xóa"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3 bg-[#eff4ff] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#c3c6d7]/20">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#434655]">
            Hiển thị <strong className="text-[#0b1c30] font-semibold">1-{posts.length}</strong> trên tổng số{" "}
            <strong className="text-[#0b1c30] font-semibold">28</strong> bài viết
          </span>
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#737686]">
            <span>Hiển thị mỗi trang:</span>
            <select className="bg-[#ffffff] text-[#0b1c30] rounded px-2 py-0.5 shadow-xs text-[11px] focus:outline-none cursor-pointer border border-[#c3c6d7]/20">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg bg-[#ffffff] text-[#c3c6d7] cursor-not-allowed"
            disabled
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-[#004ac6] text-white text-[13px] font-semibold shadow-xs flex items-center justify-center"
            type="button"
          >
            1
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-[#ffffff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium flex items-center justify-center transition-colors shadow-xs"
            type="button"
          >
            2
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-[#ffffff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium flex items-center justify-center transition-colors shadow-xs"
            type="button"
          >
            3
          </button>
          <span className="px-1 text-[#737686] font-['JetBrains_Mono'] text-[12px]">...</span>
          <button
            className="w-8 h-8 rounded-lg bg-[#ffffff] hover:bg-[#dce9ff] text-[#0b1c30] text-[13px] font-medium flex items-center justify-center transition-colors shadow-xs"
            type="button"
          >
            6
          </button>
          <button
            className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#dce9ff] text-[#0b1c30] transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
