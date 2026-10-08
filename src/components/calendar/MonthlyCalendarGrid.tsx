"use client";

import React, { useState } from "react";
import { CalendarPostItem, SocialChannel } from "@/types/calendar";

interface MonthlyCalendarGridProps {
  posts: CalendarPostItem[];
  onPostClick: (post: CalendarPostItem) => void;
  onPostMove: (postId: string, newDay: number) => void;
  onAddPostToDay: (day: number) => void;
}

const DAYS_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

// Helper to render platform badge
const renderPlatformIcon = (platform: SocialChannel) => {
  switch (platform) {
    case "FB":
      return (
        <span
          key={platform}
          title="Facebook"
          className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold"
        >
          f
        </span>
      );
    case "X":
      return (
        <span
          key={platform}
          title="X / Twitter"
          className="w-3.5 h-3.5 rounded bg-neutral-900 text-white flex items-center justify-center text-[8px] font-bold"
        >
          𝕏
        </span>
      );
    case "TH":
      return (
        <span
          key={platform}
          title="Threads"
          className="w-3.5 h-3.5 rounded bg-pink-600 text-white flex items-center justify-center text-[8px] font-bold"
        >
          @
        </span>
      );
    case "IN":
      return (
        <span
          key={platform}
          title="LinkedIn"
          className="w-3.5 h-3.5 rounded bg-blue-700 text-white flex items-center justify-center text-[8px] font-bold"
        >
          in
        </span>
      );
  }
};

export const MonthlyCalendarGrid: React.FC<MonthlyCalendarGridProps> = ({
  posts,
  onPostClick,
  onPostMove,
  onAddPostToDay,
}) => {
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // October 2026: Day 1 is Thursday.
  // In Monday-first index: Mon(0), Tue(1), Wed(2), Thu(3), Fri(4), Sat(5), Sun(6).
  // Days 1..31.
  // Leading empty cells before Day 1: 3 days (Mon 28/09, Tue 29/09, Wed 30/09).
  const leadingDays = [
    { day: 28, isPrevMonth: true, isCurrentMonth: false, isNextMonth: false },
    { day: 29, isPrevMonth: true, isCurrentMonth: false, isNextMonth: false },
    { day: 30, isPrevMonth: true, isCurrentMonth: false, isNextMonth: false },
  ];

  const currentMonthDays = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    isPrevMonth: false,
    isCurrentMonth: true,
    isNextMonth: false,
  }));

  // Trailing empty cells after Day 31 (Sat): 1 day (Sun 1/11)
  const trailingDays = [{ day: 1, isPrevMonth: false, isCurrentMonth: false, isNextMonth: true }];

  const allCalendarCells = [...leadingDays, ...currentMonthDays, ...trailingDays];

  // Group posts by day number (1..31)
  const postsByDay: Record<number, CalendarPostItem[]> = {};
  posts.forEach((post) => {
    try {
      const parts = post.date.split("-");
      const dayNum = parseInt(parts[2], 10);
      if (!postsByDay[dayNum]) postsByDay[dayNum] = [];
      postsByDay[dayNum].push(post);
    } catch {
      // fallback
    }
  });

  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.setData("text/plain", postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    const postId = draggedPostId || e.dataTransfer.getData("text/plain");
    if (postId && targetDay) {
      onPostMove(postId, targetDay);
    }
    setDraggedPostId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest overflow-hidden">
      {/* Drag & Drop Hint Banner */}
      <div className="bg-surface-container-low/60 border-b border-outline-variant/20 px-6 py-2.5 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">drag_indicator</span>
          <span>
            Kéo thả card bài viết để dời lịch xuất bản tự động đồng bộ sang hàng đợi.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> Đã xuất bản
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Đã lên lịch
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Chờ duyệt
          </span>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-outline-variant/30 text-center text-xs font-semibold text-on-surface-variant/80 py-2.5 bg-surface-container-low/40">
        {DAYS_OF_WEEK.map((dayName, idx) => (
          <div key={idx} className={idx === 5 || idx === 6 ? "text-primary/70" : ""}>
            {dayName}
          </div>
        ))}
      </div>

      {/* 7x5 Days Matrix */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-px bg-outline-variant/30 overflow-y-auto">
        {allCalendarCells.map((cell, idx) => {
          const isToday = cell.isCurrentMonth && cell.day === 15;
          const dayPosts = cell.isCurrentMonth ? postsByDay[cell.day] || [] : [];

          return (
            <div
              key={idx}
              onDragOver={cell.isCurrentMonth ? handleDragOver : undefined}
              onDrop={cell.isCurrentMonth ? (e) => handleDrop(e, cell.day) : undefined}
              className={`bg-surface-container-lowest p-2 min-h-[110px] flex flex-col justify-between transition-colors group relative ${
                cell.isPrevMonth || cell.isNextMonth
                  ? "bg-surface-container-low/20 text-on-surface-variant/40"
                  : "hover:bg-surface-container-low/30"
              } ${isToday ? "border-t-2 border-primary bg-primary/5" : ""}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-medium ${
                    isToday
                      ? "w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[11px]"
                      : cell.isPrevMonth || cell.isNextMonth
                      ? "text-on-surface-variant/40"
                      : "text-on-surface"
                  }`}
                >
                  {cell.day}
                </span>

                {/* Quick Add Button */}
                {cell.isCurrentMonth && (
                  <button
                    onClick={() => onAddPostToDay(cell.day)}
                    title={`Thêm bài cho ngày ${cell.day}`}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-surface-container-high rounded text-on-surface-variant transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">add</span>
                  </button>
                )}
              </div>

              {/* Day Posts List */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[140px] pr-0.5">
                {dayPosts.map((post) => {
                  const isScheduled = post.status === "SCHEDULED";
                  const isPublished = post.status === "PUBLISHED";
                  const isPending = post.status === "PENDING_APPROVAL";

                  let cardBorderClass = "border-outline-variant/40 bg-surface-container-low/60";
                  let statusBadgeClass = "bg-surface-container text-on-surface-variant";

                  if (isPublished) {
                    cardBorderClass = "border-tertiary/20 bg-tertiary/5 text-on-surface";
                    statusBadgeClass = "bg-tertiary/10 text-tertiary";
                  } else if (isScheduled) {
                    cardBorderClass = "border-primary/30 bg-primary/5 text-on-surface shadow-xs";
                    statusBadgeClass = "bg-primary/10 text-primary";
                  } else if (isPending) {
                    cardBorderClass = "border-amber-500/30 bg-amber-500/5 text-on-surface";
                    statusBadgeClass = "bg-amber-500/10 text-amber-600";
                  }

                  return (
                    <div
                      key={post.id}
                      draggable={post.draggable}
                      onDragStart={(e) => handleDragStart(e, post.id)}
                      onClick={() => onPostClick(post)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:shadow-sm ${cardBorderClass} ${
                        post.draggable ? "cursor-grab active:cursor-grabbing" : ""
                      }`}
                    >
                      {/* Top row: Time + Channel Icons */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-medium text-on-surface-variant">
                          {post.timeText}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {post.platforms.map((p) => renderPlatformIcon(p))}
                        </div>
                      </div>

                      {/* Title */}
                      <p className="text-xs font-semibold text-on-surface line-clamp-1 leading-snug">
                        {post.title}
                      </p>

                      {/* Reach or Status Label */}
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-outline-variant/20">
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusBadgeClass}`}>
                          {post.statusLabel}
                        </span>
                        {post.reachMetric && (
                          <span className="text-[9px] font-mono text-tertiary font-semibold">
                            {post.reachMetric}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Highlight footer for Today */}
              {isToday && (
                <div className="text-[9px] text-primary font-semibold text-right mt-1 pt-1 border-t border-primary/20">
                  Hôm nay
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
