"use client";

import React from "react";
import { PlatformPerformanceItem, TopPerformingPostItem } from "@/types/analytics";

interface PlatformAndTopPostsSectionProps {
  platforms: PlatformPerformanceItem[];
  topPosts: TopPerformingPostItem[];
  onViewAllLibrary: () => void;
}

export const PlatformAndTopPostsSection: React.FC<PlatformAndTopPostsSectionProps> = ({
  platforms,
  topPosts,
  onViewAllLibrary,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Platform Performance Breakdown Table */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <h3 className="text-base font-bold text-on-surface font-headline-sm">
              Phân tích Chi tiết Theo Nền Tảng
            </h3>
            <p className="text-xs text-on-surface-variant">
              So sánh độ phủ, phản hồi khán giả và tỷ lệ nhấp chuột (CTR) giữa 4 kênh trọng tâm
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-on-surface-variant">Tần suất làm mới:</span>
            <span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded font-semibold text-primary">
              Thời gian thực (Live)
            </span>
          </div>
        </div>

        {/* High-Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider h-10">
                <th className="px-4 rounded-l-lg">Kênh Mạng Xã Hội</th>
                <th className="px-4 text-right">Số bài đăng</th>
                <th className="px-4 text-right">Tổng Lượt Tiếp Cận (Reach)</th>
                <th className="px-4 text-right">Tương tác</th>
                <th className="px-4 text-right">CTR</th>
                <th className="px-4 text-right">Tăng trưởng Followers</th>
                <th className="px-4 rounded-r-lg text-center">Hiệu Suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface text-xs">
              {platforms.map((p) => {
                let iconText = "in";
                let iconBg = "text-primary";
                if (p.platform === "FACEBOOK") {
                  iconText = "fb";
                  iconBg = "text-blue-600";
                } else if (p.platform === "X") {
                  iconText = "𝕏";
                  iconBg = "text-on-surface";
                } else if (p.platform === "THREADS") {
                  iconText = "@";
                  iconBg = "text-pink-600";
                }

                return (
                  <tr key={p.platform} className="hover:bg-surface-container-low/50 transition-colors h-14">
                    <td className="px-4 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold font-mono ${iconBg}`}>
                          {iconText}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-on-surface font-semibold">{p.displayName}</span>
                            {p.tagBadge && (
                              <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 rounded font-semibold">
                                {p.tagBadge}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-on-surface-variant">{p.handle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 text-right font-mono font-semibold tabular-nums">{p.postCount}</td>
                    <td className="px-4 text-right font-bold text-on-surface tabular-nums">
                      {p.reach.toLocaleString()}
                    </td>
                    <td className="px-4 text-right font-mono tabular-nums text-on-surface-variant">
                      {p.engagementText}
                    </td>
                    <td className="px-4 text-right font-bold text-primary tabular-nums">{p.ctr}%</td>
                    <td className="px-4 text-right text-tertiary font-semibold tabular-nums">
                      {p.followerGrowth}
                    </td>
                    <td className="px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          p.ratingStatus === "EXCELLENT"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : p.ratingStatus === "POTENTIAL"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-surface-container-high text-on-surface"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.ratingStatus === "EXCELLENT"
                              ? "bg-tertiary-container"
                              : p.ratingStatus === "POTENTIAL"
                              ? "bg-secondary"
                              : "bg-primary"
                          }`}
                        ></span>
                        {p.ratingLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Top Performing Viral Posts */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-on-surface font-headline-sm">
              Top Bài Viết Viral Nhất (Top Performing Posts)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Các nội dung mang lại lượng truy cập và chỉ số chuyển đổi bứt phá nhất
            </p>
          </div>
          <button
            onClick={onViewAllLibrary}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Xem tất cả bài đăng trong thư viện <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Posts Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-all space-y-3 flex flex-col justify-between group border border-outline-variant/20"
            >
              <div className="flex items-start gap-3">
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 shadow-xs"
                  />
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-semibold">
                      {post.platform}
                    </span>
                    <span className="font-mono text-[11px] text-outline">{post.publishedDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{post.summary}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-on-surface-variant">
                    Reach: <strong className="text-on-surface font-semibold">{post.reach.toLocaleString()}</strong>
                  </span>
                  <span className="text-on-surface-variant">
                    CTR: <strong className="text-primary font-semibold">{post.ctr}%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-tertiary">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>Virality: {post.viralityScore}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
