"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostItem } from "@/types/post";
import api from "@/lib/api";
import { PostDrawer } from "@/components/posts/PostDrawer";
import {
  Search,
  Filter,
  Calendar,
  Send,
  Trash2,
  SkipForward,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckSquare,
  Square,
  RefreshCw,
  X,
} from "lucide-react";

import { useRealtimeSync } from "@/hooks/useRealtimeSync";

function PostsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialId = searchParams.get("id");

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  const initialOpenedRef = useRef(false);
  const selectedPostRef = useRef<PostItem | null>(null);
  selectedPostRef.current = selectedPost;

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchPosts = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (platformFilter !== "ALL") params.append("platform", platformFilter);

      const res = await api.get<{ data: PostItem[] }>(`/api/v1/posts?${params.toString()}`);
      if (res.data) {
        setPosts(res.data);
        // Tự động mở drawer nếu URL có ?id= lần đầu tiên
        if (initialId && !initialOpenedRef.current) {
          const match = res.data.find((p) => p.id === initialId);
          if (match) {
            setSelectedPost(match);
            initialOpenedRef.current = true;
          }
        } else if (selectedPostRef.current) {
          // Cập nhật realtime dữ liệu cho post đang mở
          const match = res.data.find((p) => p.id === selectedPostRef.current?.id);
          if (match) {
            setSelectedPost((prev) => {
              if (!prev) return match;
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
        }
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleOpenPost = (post: PostItem) => {
    setSelectedPost(post);
    initialOpenedRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", post.id);
    router.replace(`/posts?${params.toString()}`, { scroll: false });
  };

  const handleCloseDrawer = () => {
    setSelectedPost(null);
    initialOpenedRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const query = params.toString();
    router.replace(query ? `/posts?${query}` : "/posts", { scroll: false });
  };

  useEffect(() => {
    fetchPosts(false);
  }, [statusFilter, platformFilter]);

  // Tự động đồng bộ realtime khi có CRUD hoặc theo chu kỳ 4s
  useRealtimeSync(() => fetchPosts(true), { interval: 4000 });

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(Boolean);

    // 1. Khớp toàn bộ chuỗi
    const fullMatch =
      (p.content && p.content.toLowerCase().includes(query)) ||
      (p.hashtags && p.hashtags.toLowerCase().includes(query)) ||
      (p.channelName && p.channelName.toLowerCase().includes(query)) ||
      (p.planName && p.planName.toLowerCase().includes(query)) ||
      (p.angle && p.angle.toLowerCase().includes(query));

    if (fullMatch) return true;

    // 2. Khớp linh hoạt theo từ khóa
    if (queryWords.length > 1) {
      const targetText = `${p.content || ""} ${p.hashtags || ""} ${p.channelName || ""} ${p.planName || ""} ${p.angle || ""}`.toLowerCase();
      const matchCount = queryWords.filter((w) => targetText.includes(w)).length;
      if (matchCount >= Math.min(2, queryWords.length)) {
        return true;
      }
    }

    return false;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: "SKIP" | "DELETE") => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      await api.post("/api/v1/posts/bulk", {
        action,
        ids: selectedIds,
      });

      setSelectedIds([]);
      fetchPosts();
    } catch (err) {
      console.error("Error running bulk action:", err);
    } finally {
      setBulkLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">Đã đăng</span>;
      case "READY":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">Sẵn sàng</span>;
      case "PLANNED":
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">Đã lên lịch</span>;
      case "PUBLISHING":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium animate-pulse">Đang đăng...</span>;
      case "FAILED":
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">Thất bại</span>;
      case "NEEDS_REVIEW":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-medium">Cần xem lại</span>;
      case "MISSED":
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded text-[11px] font-medium">Bỏ lỡ</span>;
      case "SKIPPED":
        return <span className="bg-slate-50 text-slate-400 border border-slate-200 px-2 py-0.5 rounded text-[11px]">Đã bỏ qua</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh sách Bài đăng</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem, chỉnh sửa nội dung, đính kèm ảnh và theo dõi tiến độ đăng bài tự động trên từng kênh.
          </p>
        </div>
        <button
          onClick={() => fetchPosts(false)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung, hashtag, tên kênh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  const q = params.toString();
                  router.replace(q ? `/posts?${q}` : "/posts", { scroll: false });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
                title="Xóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option value="ALL">Mọi nền tảng</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="THREADS">Threads</option>
            <option value="X">X (Twitter)</option>
            <option value="LINKEDIN">LinkedIn</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="PLANNED">Đã lên lịch (PLANNED)</option>
            <option value="READY">Sẵn sàng (READY)</option>
            <option value="PUBLISHING">Đang đăng (PUBLISHING)</option>
            <option value="PUBLISHED">Đã đăng (PUBLISHED)</option>
            <option value="NEEDS_REVIEW">Cần xem lại (NEEDS_REVIEW)</option>
            <option value="FAILED">Thất bại (FAILED)</option>
            <option value="MISSED">Bỏ lỡ (MISSED)</option>
            <option value="SKIPPED">Đã bỏ qua (SKIPPED)</option>
          </select>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 animate-in fade-in">
            <span className="text-xs text-slate-600 font-medium">Đã chọn {selectedIds.length}</span>
            <button
              onClick={() => handleBulkAction("SKIP")}
              disabled={bulkLoading}
              className="px-2 py-1 text-xs text-slate-700 hover:bg-slate-200 rounded flex items-center gap-1 transition"
            >
              <SkipForward className="h-3.5 w-3.5" /> Bỏ qua
            </button>
            <button
              onClick={() => handleBulkAction("DELETE")}
              disabled={bulkLoading}
              className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1 transition"
            >
              <Trash2 className="h-3.5 w-3.5" /> Xóa
            </button>
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Đang tải danh sách bài đăng...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-xs text-slate-500">Không tìm thấy bài đăng nào phù hợp.</p>
            {searchQuery || statusFilter !== "ALL" || platformFilter !== "ALL" ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setPlatformFilter("ALL");
                    router.replace("/posts", { scroll: false });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Xóa bộ lọc tìm kiếm</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Hãy tạo Kế hoạch (Plan) mới trên trang Thiết lập để sinh bài đăng tự động.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                      {selectedIds.length === filteredPosts.length ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 w-28">Nền tảng</th>
                  <th className="py-3 px-4">Nội dung bài viết</th>
                  <th className="py-3 px-4 w-40">Giờ hẹn đăng</th>
                  <th className="py-3 px-4 w-32">Trạng thái</th>
                  <th className="py-3 px-4 w-16 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => {
                  const isSelected = selectedIds.includes(post.id);
                  return (
                    <tr
                      key={post.id}
                      onClick={() => handleOpenPost(post)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${
                        isSelected ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelectOne(post.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">{post.platform}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[100px]">
                          {post.channelName || "—"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="line-clamp-2 text-slate-700 font-normal leading-relaxed">
                          {post.content || (
                            <span className="text-slate-400 italic">
                              {post.status === "PLANNED"
                                ? "Chưa đến giờ sinh nội dung AI..."
                                : "Nội dung chưa thiết lập"}
                            </span>
                          )}
                        </p>
                        {post.hashtags && (
                          <span className="text-[11px] text-blue-600 block mt-0.5 truncate">
                            {post.hashtags}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(post.scheduledAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {post.scheduledTimezone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(post.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedPost && (
        <PostDrawer
          post={selectedPost}
          onClose={handleCloseDrawer}
          onRefresh={() => {
            fetchPosts(true);
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

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Đang tải...</p>
        </div>
      }
    >
      <PostsPageContent />
    </Suspense>
  );
}
