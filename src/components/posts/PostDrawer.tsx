"use client";

import { useEffect, useRef, useState } from "react";
import { PostItem, PostAttempt } from "@/types/post";
import api from "@/lib/api";
import {
  X,
  Send,
  RotateCcw,
  SkipForward,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Loader2,
  Check,
  Sparkles,
  Upload,
  Trash2,
} from "lucide-react";
import { AIRewriteDialog } from "./AIRewriteDialog";

interface PostDrawerProps {
  post: PostItem | null;
  onClose: () => void;
  onRefresh: () => void;
}

export function PostDrawer({ post, onClose, onRefresh }: PostDrawerProps) {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [attempts, setAttempts] = useState<PostAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showRewriteDialog, setShowRewriteDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [regeneratingImage, setRegeneratingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [markUrl, setMarkUrl] = useState("");
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRegenerateContent = async (customPrompt?: string, tone?: string) => {
    if (!post) return;
    setRegenerating(true);
    setStatusMessage(null);
    try {
      const res = await api.post<{ data: PostItem }>(`/api/v1/posts/${post.id}/regenerate-content`, {
        customPrompt,
        tone,
      });
      if (res.data) {
        setContent(res.data.content || "");
        setHashtags(res.data.hashtags || "");
        setStatusMessage("✨ AI đã viết xong bài thành công!");
        onRefresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi gọi AI sinh nội dung.";
      setStatusMessage(msg);
    } finally {
      setRegenerating(false);
    }
  };

  const handleUploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !post) return;
    setUploadingImage(true);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/api/v1/posts/${post.id}/image`, formData);
      setStatusMessage("Đã tải ảnh lên thành công!");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải ảnh lên.";
      setStatusMessage(msg);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRegenerateImage = async () => {
    if (!post) return;
    setRegeneratingImage(true);
    setStatusMessage(null);
    try {
      await api.post(`/api/v1/posts/${post.id}/image/regenerate`);
      setStatusMessage("✨ AI đã tạo ảnh minh họa mới thành công!");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi yêu cầu AI tạo ảnh.";
      setStatusMessage(msg);
    } finally {
      setRegeneratingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!post) return;
    setDeletingImage(true);
    setStatusMessage(null);
    try {
      await api.delete(`/api/v1/posts/${post.id}/image`);
      setStatusMessage("Đã xóa ảnh thành công.");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa ảnh.";
      setStatusMessage(msg);
    } finally {
      setDeletingImage(false);
    }
  };

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setHashtags(post.hashtags || "");
      setScheduledAt(post.scheduledAt ? post.scheduledAt.slice(0, 16) : "");
      setStatusMessage(null);
      setShowMarkDialog(false);

      // Fetch attempts
      setLoadingAttempts(true);
      api
        .get<{ data: PostAttempt[] }>(`/api/v1/posts/${post.id}/attempts`)
        .then((res) => {
          if (res.data) setAttempts(res.data);
        })
        .catch(() => setAttempts([]))
        .finally(() => setLoadingAttempts(false));
    }
  }, [post?.id]);

  if (!post) return null;

  const charLimits: Record<string, number> = {
    X: 280,
    THREADS: 500,
    FACEBOOK: 5000,
    LINKEDIN: 3000,
  };

  const limit = charLimits[post.platform] || 5000;
  const currentLen = content.length;
  const isOverLimit = currentLen > limit;

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.patch<{ data: PostItem }>(`/api/v1/posts/${post.id}`, {
        content,
        hashtags,
        scheduledAt: scheduledAt ? scheduledAt + ":00" : undefined,
      });
      if (res && res.data) {
        setContent(res.data.content || "");
        setHashtags(res.data.hashtags || "");
        setScheduledAt(res.data.scheduledAt ? res.data.scheduledAt.slice(0, 16) : "");
      }
      setStatusMessage("Đã lưu thay đổi thành công.");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi lưu bài viết.";
      setStatusMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishNow = async () => {
    setPublishing(true);
    try {
      await api.post(`/api/v1/posts/${post.id}/publish-now`);
      setStatusMessage("Đã yêu cầu Đăng ngay! Hệ thống sẽ xử lý trong giây lát.");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi đăng bài.";
      setStatusMessage(msg);
    } finally {
      setPublishing(false);
    }
  };

  const handleSkip = async () => {
    try {
      await api.post(`/api/v1/posts/${post.id}/skip`);
      onRefresh();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi bỏ qua.";
      setStatusMessage(msg);
    }
  };

  const handleRetry = async () => {
    try {
      await api.post(`/api/v1/posts/${post.id}/retry`);
      setStatusMessage("Đã lập lịch thử lại bài đăng.");
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi thử lại.";
      setStatusMessage(msg);
    }
  };

  const handleMarkPublished = async () => {
    if (!markUrl.trim()) return;
    try {
      await api.post(`/api/v1/posts/${post.id}/mark-published`, { url: markUrl.trim() });
      setShowMarkDialog(false);
      onRefresh();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi đánh dấu đã đăng.";
      setStatusMessage(msg);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium">Đã đăng</span>;
      case "READY":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs font-medium">Sẵn sàng</span>;
      case "PLANNED":
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-medium">Đã lên lịch</span>;
      case "PUBLISHING":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-medium animate-pulse">Đang đăng...</span>;
      case "FAILED":
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-medium">Thất bại</span>;
      case "NEEDS_REVIEW":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs font-medium">Cần xem lại</span>;
      case "MISSED":
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded text-xs font-medium">Bỏ lỡ</span>;
      case "SKIPPED":
        return <span className="bg-slate-50 text-slate-400 border border-slate-200 px-2 py-0.5 rounded text-xs">Đã bỏ qua</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800 text-sm">Chi tiết Bài đăng</span>
            {getStatusBadge(post.status)}
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
              {post.platform}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs">
              {statusMessage}
            </div>
          )}

          {/* Needs Review Alert Banner */}
          {post.status === "NEEDS_REVIEW" && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-semibold text-xs">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                Cần bạn kiểm tra kết quả trên mạng xã hội
              </div>
              <p className="text-xs text-purple-700">
                {post.needsReviewReason || "Hệ thống gặp lỗi timeout khi đăng bài và không thể xác định bài viết đã xuất hiện trên kênh hay chưa."}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowMarkDialog(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition"
                >
                  Đã thấy bài (Đánh dấu đã đăng)
                </button>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1.5 bg-white border border-purple-300 text-purple-800 rounded-lg text-xs font-medium hover:bg-purple-50 transition"
                >
                  Chưa thấy bài (Đăng lại)
                </button>
              </div>
            </div>
          )}

          {/* Mark Published Dialog Input */}
          {showMarkDialog && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="text-xs font-medium text-slate-700 block">
                Nhập URL bài viết trên {post.platform}:
              </label>
              <input
                type="url"
                value={markUrl}
                onChange={(e) => setMarkUrl(e.target.value)}
                placeholder="https://facebook.com/posts/..."
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowMarkDialog(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={handleMarkPublished}
                  className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5">Kênh đích:</span>
              <span className="font-medium text-slate-800">{post.channelName || "Chưa gán"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Kế hoạch (Plan):</span>
              <span className="font-medium text-slate-800">{post.planName || "Đăng thủ công"}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Giờ hẹn đăng:</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={["PUBLISHING", "PUBLISHED"].includes(post.status)}
                  className="bg-transparent border-0 p-0 text-xs font-medium focus:ring-0"
                />
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Link bài đăng:</span>
              {post.platformPostUrl ? (
                <a
                  href={post.platformPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  Mở bài đăng <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Chưa có</span>
              )}
            </div>
          </div>

          {/* Post Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Nội dung bài viết</label>
              <div className="flex items-center gap-2">
                {!["PUBLISHING", "PUBLISHED"].includes(post.status) && (
                  <button
                    type="button"
                    onClick={() => setShowRewriteDialog(true)}
                    disabled={regenerating}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50"
                    title="Mở Studio AI để nhập hướng dẫn chi tiết hoặc chat cùng AI"
                  >
                    {regenerating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>AI đang viết bài...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{content ? "Viết lại bằng AI" : "✨ Sinh nội dung bằng AI"}</span>
                      </>
                    )}
                  </button>
                )}
                <span
                  className={`text-xs font-mono ${
                    isOverLimit ? "text-rose-600 font-bold" : "text-slate-400"
                  }`}
                >
                  {currentLen} / {limit} ký tự
                </span>
              </div>
            </div>

            {!content && !regenerating && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800">
                <div>
                  <span className="font-semibold block">Bài viết này chưa có nội dung</span>
                  <span className="text-[11px] text-amber-700">
                    Bấm &quot;Tạo ngay&quot; để mở studio AI, nhập hướng dẫn cụ thể hoặc trò chuyện cùng trợ lý AI.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRewriteDialog(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shrink-0 transition shadow-2xs"
                >
                  Tạo ngay
                </button>
              </div>
            )}

            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={["PUBLISHING", "PUBLISHED"].includes(post.status)}
              className={`w-full text-xs p-3.5 border rounded-xl focus:outline-hidden focus:ring-2 bg-white transition leading-relaxed ${
                isOverLimit
                  ? "border-rose-300 focus:ring-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:ring-blue-500"
              }`}
              placeholder="Nhập nội dung bài viết hoặc bấm 'Sinh nội dung bằng AI' để tự động tạo..."
            />
          </div>

          {/* Hashtags Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              disabled={["PUBLISHING", "PUBLISHED"].includes(post.status)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="#tag1 #tag2..."
            />
          </div>

          {/* Media Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-slate-500" />
                Ảnh đính kèm
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({post.mediaUrls.length})
                  </span>
                )}
              </label>

              {!["PUBLISHING", "PUBLISHED"].includes(post.status) && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadCustomImage}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage || regeneratingImage || deletingImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors disabled:opacity-50"
                    title="Tải ảnh từ máy tính của bạn"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-slate-600" />
                    )}
                    <span>Tải ảnh từ máy</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerateImage}
                    disabled={uploadingImage || regeneratingImage || deletingImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors disabled:opacity-50"
                    title="Yêu cầu AI tạo ảnh minh họa khớp nội dung bài viết"
                  >
                    {regeneratingImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    )}
                    <span>{post.mediaUrls && post.mediaUrls.length > 0 ? "Tạo lại ảnh AI" : "Tạo ảnh AI"}</span>
                  </button>
                </div>
              )}
            </div>

            {post.mediaUrls && post.mediaUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {post.mediaUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs"
                  >
                    <img
                      src={url}
                      alt="Post attachment"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {!["PUBLISHING", "PUBLISHED"].includes(post.status) && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage || deletingImage}
                          className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-md transition"
                          title="Thay thế bằng ảnh khác từ máy"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRegenerateImage}
                          disabled={regeneratingImage}
                          className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition"
                          title="Tạo lại ảnh bằng AI"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          disabled={deletingImage}
                          className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Chưa có hình ảnh đính kèm</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bạn có thể tải ảnh lên từ máy tính hoặc bấm &quot;Tạo ảnh AI&quot; để sinh hình ảnh minh họa phù hợp
                </p>
              </div>
            )}
          </div>

          {/* Attempt History Timeline */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block">
              Lịch sử các lần thử đăng ({attempts.length})
            </span>
            {loadingAttempts ? (
              <div className="py-4 text-center text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-600 mb-1" />
                Đang tải nhật ký...
              </div>
            ) : attempts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có lượt thử đăng nào.</p>
            ) : (
              <div className="space-y-2">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        Lần thử #{att.attemptNo} (Chu kỳ {att.publishCycle})
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          att.outcome === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : att.outcome === "RETRYABLE_ERROR"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {att.outcome}
                      </span>
                    </div>
                    {att.startedAt && (
                      <p className="text-[11px] text-slate-400">
                        Bắt đầu: {new Date(att.startedAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                    {att.errorMessage && (
                      <p className="text-rose-600 text-[11px] bg-rose-50 p-2 rounded">
                        {att.errorMessage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!["PUBLISHING", "PUBLISHED", "SKIPPED"].includes(post.status) && (
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
              >
                Bỏ qua
              </button>
            )}
            {["FAILED", "NEEDS_REVIEW"].includes(post.status) && (
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Thử lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!["PUBLISHING", "PUBLISHED"].includes(post.status) && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            )}

            {["READY", "FAILED"].includes(post.status) && (
              <button
                onClick={handlePublishNow}
                disabled={publishing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                {publishing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Đăng ngay
              </button>
            )}
          </div>
        </div>
      </div>

      <AIRewriteDialog
        isOpen={showRewriteDialog}
        onClose={() => setShowRewriteDialog(false)}
        currentContent={content}
        postId={post.id}
        platform={post.platform}
        planTopic={post.planName}
        onApplyContent={(newContent, newHashtags) => {
          setContent(newContent);
          if (newHashtags) setHashtags(newHashtags);
          setStatusMessage("Đã áp dụng nội dung mới từ AI!");
        }}
        onDirectRegenerate={handleRegenerateContent}
        isRegenerating={regenerating}
      />
    </div>
  );
}
