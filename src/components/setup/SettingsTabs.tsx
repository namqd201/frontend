"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { UserSettings, AiProviderInfo } from "@/types/settings";
import { Save, Send, Loader2, Sparkles, Clock, Globe, Bell, ShieldCheck } from "lucide-react";

export function SettingsTabs() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [aiProviders, setAiProviders] = useState<AiProviderInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, providersData] = await Promise.all([
          apiClient<UserSettings>("/api/v1/settings"),
          apiClient<AiProviderInfo[]>("/api/v1/settings/ai/providers"),
        ]);
        setSettings(settingsData);
        setAiProviders(providersData);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      const updated = await apiClient<UserSettings>("/api/v1/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(updated);
      alert("Đã lưu cài đặt thành công!");
    } catch (err: unknown) {
      alert((err as Error).message || "Lỗi khi lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (channel: "TELEGRAM" | "EMAIL") => {
    try {
      setIsTesting(true);
      setTestResult(null);
      const res = await apiClient<{ success: boolean; message: string }>(
        "/api/v1/settings/notifications/test",
        {
          method: "POST",
          body: JSON.stringify({ channel }),
        }
      );
      setTestResult(res.message);
    } catch (err: unknown) {
      setTestResult((err as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-12 flex justify-center items-center text-[#64748B]">
        <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
        <span className="ml-2 text-sm">Đang tải cấu hình...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* 1. Brand Voice / Persona */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#0F172A] font-semibold text-base">
          <Sparkles className="h-5 w-5 text-[#2563EB]" />
          <h2>Brand Voice & Persona (Giọng văn thương hiệu)</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Tông giọng chính (Tone)
            </label>
            <input
              type="text"
              value={settings.tone || ""}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
              placeholder="Ví dụ: Chuyên nghiệp, truyền cảm hứng, ngắn gọn"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Phong cách viết chi tiết (Writing Style)
            </label>
            <textarea
              rows={3}
              value={settings.writingStyle || ""}
              onChange={(e) => setSettings({ ...settings, writingStyle: e.target.value })}
              className="w-full p-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
              placeholder="Ví dụ: Súc tích, không sáo rỗng, dùng số liệu và gạch đầu dòng rõ ràng"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Từ cấm / Không được dùng (Forbidden Words)
              </label>
              <input
                type="text"
                value={settings.forbiddenWords || ""}
                onChange={(e) => setSettings({ ...settings, forbiddenWords: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
                placeholder="Ví dụ: cam kết 100%, tuyệt đối, bí mật"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Hashtags ưu tiên
              </label>
              <input
                type="text"
                value={settings.preferredHashtags || ""}
                onChange={(e) => setSettings({ ...settings, preferredHashtags: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
                placeholder="Ví dụ: #NQDSMTool #MarketingAI #Automation"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Mức độ dùng Emoji
              </label>
              <select
                value={settings.emojiPolicy}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emojiPolicy: e.target.value as UserSettings["emojiPolicy"],
                  })
                }
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
              >
                <option value="NONE">Không dùng emoji (NONE)</option>
                <option value="MINIMAL">Tối giản 1-2 emoji (MINIMAL)</option>
                <option value="MODERATE">Vừa phải (MODERATE)</option>
                <option value="EXPRESSIVE">Nhiều emoji sinh động (EXPRESSIVE)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Lời kêu gọi hành động mặc định (CTA)
              </label>
              <input
                type="text"
                value={settings.defaultCta || ""}
                onChange={(e) => setSettings({ ...settings, defaultCta: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
                placeholder="Ví dụ: Để lại bình luận để nhận tài liệu!"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Múi giờ & Ngôn ngữ */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#0F172A] font-semibold text-base">
          <Globe className="h-5 w-5 text-[#2563EB]" />
          <h2>Múi giờ & Khu vực</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Múi giờ hệ thống (IANA Timezone)
            </label>
            <input
              type="text"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Mặc định: Asia/Ho_Chi_Minh
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Ngôn ngữ viết bài mặc định
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            >
              <option value="vi">Tiếng Việt (vi)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. AI Provider & Ngân sách */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#0F172A] font-semibold text-base">
          <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
          <h2>AI Providers & Ngân sách ngày</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              AI Văn bản (Chính)
            </label>
            <select
              value={settings.textProviderPrimary}
              onChange={(e) => setSettings({ ...settings, textProviderPrimary: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            >
              {aiProviders
                .filter((p) => p.type === "TEXT")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              AI Văn bản (Dự phòng Fallback)
            </label>
            <select
              value={settings.textProviderFallback}
              onChange={(e) => setSettings({ ...settings, textProviderFallback: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            >
              {aiProviders
                .filter((p) => p.type === "TEXT")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              AI Tạo ảnh (Chính)
            </label>
            <select
              value={settings.imageProviderPrimary}
              onChange={(e) => setSettings({ ...settings, imageProviderPrimary: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            >
              {aiProviders
                .filter((p) => p.type === "IMAGE")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Ngân sách AI tối đa mỗi ngày (USD)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={settings.aiDailyBudgetUsd}
              onChange={(e) =>
                setSettings({ ...settings, aiDailyBudgetUsd: parseFloat(e.target.value) || 0 })
              }
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            />
          </div>
        </div>
      </div>

      {/* 4. Thông báo & Kênh gửi */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#0F172A] font-semibold text-base">
          <Bell className="h-5 w-5 text-[#2563EB]" />
          <h2>Kênh thông báo & Cảnh báo (Telegram / Email)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Telegram Chat ID nhận thông báo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.notifyTelegramChatId || ""}
                onChange={(e) => setSettings({ ...settings, notifyTelegramChatId: e.target.value })}
                className="flex-1 h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
                placeholder="Ví dụ: 123456789"
              />
              <button
                type="button"
                onClick={() => handleTestNotification("TELEGRAM")}
                disabled={isTesting || !settings.notifyTelegramChatId}
                className="px-3 h-10 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Gửi thử
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Email nhận thông báo
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={settings.notifyEmail || ""}
                onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
                className="flex-1 h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
                placeholder="your-email@example.com"
              />
              <button
                type="button"
                onClick={() => handleTestNotification("EMAIL")}
                disabled={isTesting || !settings.notifyEmail}
                className="px-3 h-10 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Gửi thử
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF]">
            {testResult}
          </div>
        )}
      </div>

      {/* 5. Vận hành mặc định */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-[#0F172A] font-semibold text-base">
          <Clock className="h-5 w-5 text-[#2563EB]" />
          <h2>Mặc định vận hành hệ thống</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Thời gian AI tự viết bài trước giờ đăng (Giờ)
            </label>
            <input
              type="number"
              min="1"
              max="72"
              value={settings.generateLeadHours}
              onChange={(e) =>
                setSettings({ ...settings, generateLeadHours: parseInt(e.target.value, 10) || 12 })
              }
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Mặc định: 12 giờ trước lịch đăng
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
              Ngưỡng bỏ lỡ (Missed Grace - Phút)
            </label>
            <input
              type="number"
              min="15"
              max="1440"
              value={settings.missedGraceMinutes}
              onChange={(e) =>
                setSettings({ ...settings, missedGraceMinutes: parseInt(e.target.value, 10) || 120 })
              }
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8F0] focus:outline-2 focus:outline-[#2563EB] bg-[#FAFAFA]"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Mặc định: 120 phút (quá mốc này sẽ đánh dấu Bỏ lỡ)
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Lưu thay đổi</span>
        </button>
      </div>
    </form>
  );
}
