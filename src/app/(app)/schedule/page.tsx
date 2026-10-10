"use client";

import { useEffect, useState } from "react";
import { PostItem, ScheduleSummary } from "@/types/post";
import api from "@/lib/api";
import { PostDrawer } from "@/components/posts/PostDrawer";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Loader2,
} from "lucide-react";

import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function SchedulePage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [summary, setSummary] = useState<ScheduleSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const fetchScheduleData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [postsRes, summaryRes] = await Promise.all([
        api.get<{ data: PostItem[] }>("/api/v1/schedule"),
        api.get<{ data: ScheduleSummary }>("/api/v1/schedule/summary"),
      ]);

      if (postsRes.data) {
        setPosts(postsRes.data);
        setSelectedPost((prev) => {
          if (!prev) return null;
          const match = postsRes.data.find((p) => p.id === prev.id);
          if (!match) return prev;
          if (
            prev.status === match.status &&
            prev.content === match.content &&
            JSON.stringify(prev.mediaUrls) === JSON.stringify(match.mediaUrls)
          ) {
            return prev;
          }
          return match;
        });
      }
      if (summaryRes.data) setSummary(summaryRes.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData(false);
  }, []);

  // Tự động đồng bộ realtime khi có CRUD hoặc theo chu kỳ 8s
  useRealtimeSync(() => fetchScheduleData(true), { interval: 8000 });

  // Group posts by date (YYYY-MM-DD)
  const postsByDate: Record<string, PostItem[]> = {};
  posts.forEach((p) => {
    const dateKey = p.scheduledAt.slice(0, 10);
    if (!postsByDate[dateKey]) postsByDate[dateKey] = [];
    postsByDate[dateKey].push(p);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "READY":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PUBLISHING":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "NEEDS_REVIEW":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "MISSED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Generate 7 days starting from start of current week
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  startOfWeek.setDate(diff);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const navigateWeek = (direction: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + direction * 7);
    setCurrentDate(nextDate);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lịch đăng bài</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi phân bổ bài đăng theo ngày và khung giờ trên các kênh mạng xã hội.
          </p>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Đã đăng hôm nay</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {summary ? summary.publishedToday : "—"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Sắp đăng 24h tới</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {summary ? summary.scheduledNext24h : "—"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Cần xử lý</span>
            <span className="text-2xl font-bold text-rose-600 mt-1 block">
              {summary ? summary.needsAttention : "—"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            Hôm nay
          </button>
          <span className="text-xs font-semibold text-slate-800 ml-2">
            Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Week Calendar Grid */}
      {loading ? (
        <div className="py-24 text-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Đang tải lịch phát bài...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((d, index) => {
            const dateStr = d.toISOString().slice(0, 10);
            const dayPosts = postsByDate[dateStr] || [];
            const isToday = new Date().toDateString() === d.toDateString();

            return (
              <div
                key={index}
                className={`bg-white rounded-xl border flex flex-col min-h-[360px] p-3 transition shadow-2xs ${
                  isToday ? "border-blue-400 ring-1 ring-blue-400/20" : "border-slate-200"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                  <span
                    className={`text-xs font-semibold ${
                      isToday ? "text-blue-600 font-bold" : "text-slate-700"
                    }`}
                  >
                    {d.toLocaleDateString("vi-VN", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isToday
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-500 bg-slate-50"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </div>

                {/* Day Posts List */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {dayPosts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-300 italic">
                      Trống
                    </div>
                  ) : (
                    dayPosts.map((post) => {
                      const time = new Date(post.scheduledAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer hover:shadow-xs transition space-y-1.5 ${getStatusColor(
                            post.status
                          )}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[11px]">{post.platform}</span>
                            <span className="font-mono text-[10px] opacity-80">{time}</span>
                          </div>
                          <p className="line-clamp-2 text-[11px] font-normal leading-tight">
                            {post.content || (
                              <span className="italic opacity-70">
                                {post.status === "PLANNED" ? "Chưa sinh..." : "Chưa có nội dung"}
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Drawer */}
      {selectedPost && (
        <PostDrawer
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRefresh={() => {
            fetchScheduleData(true);
            if (selectedPost) {
              api.get<{ data: PostItem }>(`/api/v1/posts/${selectedPost.id}`).then((res) => {
                if (res.data) setSelectedPost(res.data);
              });
            }
          }}
        />
      )}
    </div>
  );
}
