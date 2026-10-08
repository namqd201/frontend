"use client";

import { useRef, useState } from "react";
import {
  X,
  Sparkles,
  MessageSquare,
  Wand2,
  Send,
  Loader2,
  Check,
  Bot,
  User,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Copy,
  Edit3,
  ChevronDown,
  ChevronUp,
  Hash,
  Eye,
} from "lucide-react";
import { ChatAttachment, ChatMessage, PostChatResponse } from "@/types/post";
import api from "@/lib/api";

interface AIRewriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  postId: string;
  platform: string;
  planTopic?: string;
  onApplyContent: (newContent: string, newHashtags?: string) => void;
  onDirectRegenerate: (customPrompt?: string, tone?: string) => Promise<void>;
  isRegenerating: boolean;
}

const QUICK_PROMPTS = [
  "⚡ Rút gọn ngắn gọn, súc tích hơn",
  "🔥 Viết cuốn hút, bắt trend và gây ấn tượng",
  "💼 Giọng văn chuyên nghiệp, uy tín",
  "🎭 Hài hước, dí dỏm, tạo tiếng cười",
  "🎯 Thêm lời kêu gọi hành động (CTA) kích thích tương tác",
  "❓ Đặt câu hỏi mở để người đọc bình luận",
  "📝 Chia thành các gạch đầu dòng rõ ràng",
  "🎁 Nhấn mạnh ưu đãi và quyền lợi dùng thử",
];

const TONE_OPTIONS = [
  { value: "", label: "Giữ nguyên mặc định" },
  { value: "Thân thiện, gần gũi", label: "Thân thiện, gần gũi" },
  { value: "Chuyên nghiệp, chuyên gia", label: "Chuyên nghiệp, uy tín" },
  { value: "Hài hước, dí dỏm", label: "Hài hước, dí dỏm" },
  { value: "Truyền cảm hứng, tích cực", label: "Truyền cảm hứng" },
  { value: "Thúc giục, cấp bách", label: "Thúc giục, cấp bách" },
];

export function AIRewriteDialog({
  isOpen,
  onClose,
  currentContent,
  postId,
  platform,
  planTopic,
  onApplyContent,
  onDirectRegenerate,
  isRegenerating,
}: AIRewriteDialogProps) {
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào bạn! Mình là AI Content Copilot. Bạn có thể trò chuyện, dán ảnh chụp màn hình (Ctrl+V) hoặc bấm biểu tượng kẹp giấy để gửi tệp/ảnh. Mình sẽ phân tích và hỗ trợ bạn viết bài thật ưng ý nhé!",
    },
  ]);
  const [inputChat, setInputChat] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [latestSuggestion, setLatestSuggestion] = useState<{
    content: string;
    hashtags?: string[];
  } | null>(null);

  // New Draft Display & Modal States
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpandedDraft, setIsExpandedDraft] = useState(true);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editedDraftContent, setEditedDraftContent] = useState("");
  const [copiedDraft, setCopiedDraft] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
            setPendingAttachments((prev) => [
              ...prev,
              {
                fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                mimeType: "image/jpeg",
                base64Data: compressedBase64,
                previewUrl: compressedBase64,
              },
            ]);
            return;
          }

          // Fallback
          const rawBase64 = e.target?.result as string;
          setPendingAttachments((prev) => [
            ...prev,
            {
              fileName: file.name,
              mimeType: file.type || "image/jpeg",
              base64Data: rawBase64,
              previewUrl: rawBase64,
            },
          ]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setPendingAttachments((prev) => [
          ...prev,
          {
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            base64Data,
            previewUrl: undefined,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(processFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          processFile(file);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickPromptClick = (text: string) => {
    if (!customPrompt.trim()) {
      setCustomPrompt(text);
    } else {
      setCustomPrompt((prev) => `${prev}. ${text}`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onDirectRegenerate(customPrompt.trim() || undefined, selectedTone || undefined);
    onClose();
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = inputChat.trim();
    if ((!msg && pendingAttachments.length === 0) || chatLoading) return;

    const currentAttachments = [...pendingAttachments];
    const newHistory: ChatMessage[] = [
      ...chatMessages,
      {
        role: "user",
        content: msg || (currentAttachments.length > 0 ? "Phân tích tài liệu/ảnh này giúp tôi:" : ""),
        attachments: currentAttachments,
      },
    ];

    setChatMessages(newHistory);
    setInputChat("");
    setPendingAttachments([]);
    setChatLoading(true);

    try {
      const res = await api.post<{ data: PostChatResponse }>(`/api/v1/posts/${postId}/chat`, {
        message: msg || "Hãy phân tích hình ảnh/tệp đính kèm tôi vừa gửi và đề xuất nội dung bài đăng phù hợp.",
        currentContent,
        history: chatMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        attachments: currentAttachments.map((a) => ({
          fileName: a.fileName,
          mimeType: a.mimeType,
          base64Data: a.base64Data,
        })),
      });

      if (res.data) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data?.reply || "Đã xong!" },
        ]);

        if (res.data.suggestedContent) {
          setLatestSuggestion({
            content: res.data.suggestedContent,
            hashtags: res.data.suggestedHashtags,
          });
          setEditedDraftContent(res.data.suggestedContent);
          setIsExpandedDraft(true);
          setIsEditingDraft(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi kết nối tới AI";
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Rất tiếc, đã có lỗi xảy ra: ${errorMsg}. Vui lòng thử lại.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyDraft = async () => {
    const textToCopy = isEditingDraft && editedDraftContent.trim()
      ? editedDraftContent.trim()
      : latestSuggestion?.content;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleApplyLatestSuggestion = () => {
    if (!latestSuggestion) return;
    const finalContent = isEditingDraft && editedDraftContent.trim()
      ? editedDraftContent.trim()
      : latestSuggestion.content;
    onApplyContent(
      finalContent,
      latestSuggestion.hashtags ? latestSuggestion.hashtags.join(" ") : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`bg-white w-full ${
          isMaximized ? "max-w-5xl h-[92vh]" : "max-w-3xl max-h-[92vh]"
        } rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Studio Sáng tạo Nội dung cùng AI
              </h3>
              <p className="text-[11px] text-slate-500">
                Nền tảng: <span className="font-semibold text-slate-700">{platform}</span>
                {planTopic && (
                  <>
                    {" "}
                    • Chủ đề: <span className="text-slate-700">{planTopic}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              title={isMaximized ? "Thu nhỏ cửa sổ" : "Mở rộng cửa sổ"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-5 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "form"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Nhập yêu cầu viết lại (Form)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "chat"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Trò chuyện Co-pilot với AI (Đính kèm ảnh / tệp)
            {latestSuggestion && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Mô tả yêu cầu cụ thể của bạn cho AI:
                </label>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Viết lại theo phong cách trẻ trung hài hước, nhấn mạnh tính năng làm đề thi thử trực tuyến cho học sinh cấp 3, bổ sung 3 gạch đầu dòng và kêu gọi đăng ký miễn phí ngay hôm nay..."
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed placeholder:text-slate-400"
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2 uppercase tracking-wider">
                  Gợi ý nhanh (bấm để thêm vào yêu cầu):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPromptClick(prompt)}
                      className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 rounded-lg text-slate-600 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Giọng điệu (Tone):
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <p className="text-[11px] text-slate-500 italic pb-2">
                    💡 Gemini sẽ kết hợp thông tin chủ đề của kế hoạch với yêu cầu riêng của bạn để tạo ra bài viết mới mẻ và độc nhất.
                  </p>
                </div>
              </div>

              {/* Form Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 shadow-xs"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang viết lại bài...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Viết lại ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div
              className={`flex flex-col ${
                isMaximized ? "h-[calc(92vh-175px)]" : "h-[540px]"
              }`}
              onPaste={handlePaste}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {/* Chat Messages Timeline */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] text-xs p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60"
                      }`}
                    >
                      {/* Attached media inside bubble */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {m.attachments.map((att, aIdx) => (
                            <div key={aIdx} className="overflow-hidden rounded-lg">
                              {att.mimeType.startsWith("image/") ? (
                                <img
                                  src={att.previewUrl || att.base64Data}
                                  alt={att.fileName}
                                  className="w-24 h-24 object-cover rounded-lg border border-white/30"
                                />
                              ) : (
                                <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded text-[11px]">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[120px]">{att.fileName}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {m.content}
                    </div>
                    {m.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <span>AI đang phân tích tài liệu/ảnh và soạn bài...</span>
                  </div>
                )}
              </div>

              {/* Latest Suggestion Card - Scrollable & Expandable */}
              {latestSuggestion && (
                <div className="mt-2.5 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-xs transition-all">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-200/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Bản thảo mới do AI vừa tạo
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium border border-emerald-200/60">
                        {(isEditingDraft ? editedDraftContent : latestSuggestion.content).length} ký tự
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Toggle Expand / Collapse */}
                      <button
                        type="button"
                        onClick={() => setIsExpandedDraft(!isExpandedDraft)}
                        className="px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1"
                        title={isExpandedDraft ? "Thu gọn bản thảo" : "Xem toàn bộ bản thảo"}
                      >
                        {isExpandedDraft ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Thu gọn</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Xem đầy đủ</span>
                          </>
                        )}
                      </button>

                      {/* Copy button */}
                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-lg transition flex items-center gap-1 border border-slate-200/70 bg-white/70"
                        title="Sao chép nội dung"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Sao chép</span>
                          </>
                        )}
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isEditingDraft) {
                            setEditedDraftContent(latestSuggestion.content);
                            setIsExpandedDraft(true);
                          }
                          setIsEditingDraft(!isEditingDraft);
                        }}
                        className={`px-2 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 border ${
                          isEditingDraft
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/80 border-slate-200/70 bg-white/70"
                        }`}
                        title={isEditingDraft ? "Hủy chế độ sửa" : "Chỉnh sửa trực tiếp trước khi áp dụng"}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isEditingDraft ? "Đang sửa" : "Sửa"}</span>
                      </button>

                      {/* Apply button */}
                      <button
                        type="button"
                        onClick={handleApplyLatestSuggestion}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg transition shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Áp dụng vào bài viết
                      </button>
                    </div>
                  </div>

                  {/* Content display */}
                  <div className="mt-2.5">
                    {isEditingDraft ? (
                      <div>
                        <label className="text-[11px] font-medium text-emerald-800 mb-1 block">
                          Bạn có thể trực tiếp sửa câu từ dưới đây trước khi áp dụng:
                        </label>
                        <textarea
                          rows={isMaximized ? 8 : 6}
                          value={editedDraftContent}
                          onChange={(e) => setEditedDraftContent(e.target.value)}
                          className="w-full text-xs p-3 bg-white text-slate-800 rounded-xl border border-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                        />
                      </div>
                    ) : isExpandedDraft ? (
                      <div className="relative">
                        <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-white/95 p-3.5 rounded-xl border border-emerald-200/80 max-h-56 sm:max-h-64 overflow-y-auto select-text shadow-2xs font-normal">
                          {latestSuggestion.content}
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsExpandedDraft(true)}
                        className="cursor-pointer group text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-300 transition"
                      >
                        <p className="line-clamp-2 italic text-slate-600">
                          &quot;{latestSuggestion.content}&quot;
                        </p>
                        <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1 group-hover:underline">
                          <Eye className="w-3 h-3" /> Bấm để xem toàn bộ nội dung bản thảo...
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {latestSuggestion.hashtags && latestSuggestion.hashtags.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/50 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-emerald-800 flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Hashtags:
                        </span>
                        {latestSuggestion.hashtags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] px-2 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-md border border-emerald-200/60 font-mono"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pending Attachments Strip */}
              {pendingAttachments.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  {pendingAttachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="relative group flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs"
                    >
                      {att.mimeType.startsWith("image/") ? (
                        <img
                          src={att.previewUrl || att.base64Data}
                          alt="preview"
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-500 ml-1" />
                      )}
                      <span className="text-[11px] text-slate-700 max-w-[120px] truncate pr-1">
                        {att.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="w-4 h-4 rounded-full bg-slate-300 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[10px] text-slate-700 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <span className="text-[10px] text-slate-400">
                    ({pendingAttachments.length} tệp đính kèm)
                  </span>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,.pdf,.txt,.md,.csv,.json"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Chat Input Box */}
              <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition shrink-0"
                  title="Đính kèm ảnh hoặc tệp (PDF, TXT, MD, CSV)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Nhập tin nhắn hoặc dán ảnh (Ctrl+V) / tải tệp lên..."
                  className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={chatLoading}
                />

                <button
                  type="submit"
                  disabled={(!inputChat.trim() && pendingAttachments.length === 0) || chatLoading}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1 transition disabled:opacity-50 shrink-0 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>💡 Có thể nhấn Ctrl+V để dán ảnh trực tiếp từ clipboard hoặc kéo thả tệp vào đây.</span>
                <span>Hỗ trợ ảnh, PDF, TXT, MD</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
