"use client";

import { useState } from "react";

interface AiArchitectBoxProps {
  prompt: string;
  setPrompt: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  modelId: string;
  setModelId: (val: string) => void;
  onGenerate: () => void;
  onInsertHook: (hook: string) => void;
  loading: boolean;
}

const HOOKS = [
  '💡 "Tại sao các Agency hàng đầu ngừng đăng bài thủ công?"',
  '⚡ "Cắt giảm 80% thời gian Content Ops với Zero Duplicate"',
  '🔥 "Bí quyết vận hành 20+ fanpage không bao giờ lo chết Token"',
];

export function AiArchitectBox({
  prompt,
  setPrompt,
  tone,
  setTone,
  modelId,
  setModelId,
  onGenerate,
  onInsertHook,
  loading,
}: AiArchitectBoxProps) {
  return (
    <div className="rounded-xl bg-[#ffffff] p-4 lg:p-6 shadow-xs flex flex-col gap-4 relative overflow-hidden border border-[#c3c6d7]/30">
      <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#e9ddff]/40 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6b38d4] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-semibold text-[#0b1c30]">
              AI Content Architect
            </h2>
            <p className="text-[12px] text-[#434655]">
              Gemini 1.5 Pro Engine với bộ nhớ Brand Voice
            </p>
          </div>
        </div>
        <span className="font-['JetBrains_Mono'] text-[12px] px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113]">
          Neural Ready
        </span>
      </div>

      {/* Brand Voice Pillbox */}
      <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-1 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#6b38d4] text-[18px]">
              mic_external_on
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0b1c30]">
              Active Brand Voice
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#434655]">
            Acme Tech Corp
          </span>
        </div>
        <p className="text-[12px] text-[#434655] leading-relaxed">
          <span className="font-semibold text-[#0b1c30]">Tone:</span> Chuyên nghiệp, Tự tin, Tinh thần Data-driven, Thân thiện.{" "}
          <span className="text-[#ba1a1a] font-medium ml-2">Cấm kỵ:</span> spam, "cam kết 100%", "hạt dẻ", đa cấp.
        </p>
      </div>

      {/* Prompt Textarea */}
      <div className="flex flex-col gap-1 relative z-10">
        <label
          className="text-[11px] font-semibold text-[#434655] uppercase"
          htmlFor="ai-prompt-input"
        >
          Prompt ý tưởng chiến dịch
        </label>
        <div className="relative">
          <textarea
            id="ai-prompt-input"
            className="w-full rounded-xl bg-[#eff4ff] p-3 text-[13px] text-[#0b1c30] placeholder:text-[#737686] focus:outline-none focus:bg-[#ffffff] transition-all resize-none shadow-inner border border-[#c3c6d7]/20"
            placeholder="Nhập yêu cầu để AI tạo bài viết..."
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <span className="font-['JetBrains_Mono'] text-[12px] text-[#737686]">
              {prompt.length} ký tự
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Hooks */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className="text-[11px] font-semibold text-[#737686] uppercase">
          Gợi ý AI Hooks (Nhấn để chèn)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {HOOKS.map((h, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onInsertHook(h)}
              className="px-2.5 py-1 rounded-lg bg-[#dce9ff] hover:bg-[#e9ddff] hover:text-[#23005c] text-[#434655] text-[12px] transition-all text-left"
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Tone & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 relative z-10">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#737686] font-medium">Phong cách giọng văn</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-[#eff4ff] text-[#0b1c30] text-[13px] rounded-xl p-2.5 outline-none cursor-pointer border border-[#c3c6d7]/20"
          >
            <option value="Chuyên gia (Tech Authority)">Chuyên gia (Tech Authority)</option>
            <option value="Truyền cảm hứng (Growth Mindset)">Truyền cảm hứng (Growth Mindset)</option>
            <option value="Hóm hỉnh & Gần gũi">Hóm hỉnh & Gần gũi</option>
            <option value="Ngắn gọn (Bullet-points)">Ngắn gọn (Bullet-points)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[#737686] font-medium">Mô hình AI Phân tích</label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full bg-[#eff4ff] text-[#0b1c30] text-[13px] rounded-xl p-2.5 outline-none cursor-pointer border border-[#c3c6d7]/20"
          >
            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Mặc định)</option>
            <option value="GPT-4o">GPT-4o (High-context Fallback)</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Refined Copy)</option>
          </select>
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        type="button"
        id="btn-generate-ai"
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6b38d4] to-[#004ac6] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all disabled:opacity-50 relative z-10"
      >
        <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
          {loading ? "sync" : "auto_awesome"}
        </span>
        <span>{loading ? "Đang xử lý đa kênh..." : "AI Generate & Adapt Biến thể Đa kênh"}</span>
      </button>
    </div>
  );
}
