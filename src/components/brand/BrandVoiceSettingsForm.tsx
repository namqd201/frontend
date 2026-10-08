"use client";

import React, { useState } from "react";
import { BrandProfileData } from "@/types/brand";

interface BrandVoiceSettingsFormProps {
  data: BrandProfileData;
  onChange: (updated: BrandProfileData) => void;
}

const AVAILABLE_TONES = [
  "Chuyên nghiệp (Authoritative)",
  "Dữ liệu thực tế (Data-driven)",
  "Tự tin & Thuyết phục",
  "Hài hước / Meme",
  "Tối giản / Casual",
  "Truyền cảm hứng (Inspirational)",
];

export const BrandVoiceSettingsForm: React.FC<BrandVoiceSettingsFormProps> = ({
  data,
  onChange,
}) => {
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [newForbiddenInput, setNewForbiddenInput] = useState("");

  const toggleTone = (tone: string) => {
    const isSelected = data.selectedTones.includes(tone);
    const updatedTones = isSelected
      ? data.selectedTones.filter((t) => t !== tone)
      : [...data.selectedTones, tone];
    onChange({ ...data, selectedTones: updatedTones });
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newKeywordInput.trim()) {
      e.preventDefault();
      const word = newKeywordInput.trim().startsWith("#")
        ? newKeywordInput.trim()
        : `#${newKeywordInput.trim()}`;
      if (!data.preferredKeywords.includes(word)) {
        onChange({ ...data, preferredKeywords: [...data.preferredKeywords, word] });
      }
      setNewKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    onChange({
      ...data,
      preferredKeywords: data.preferredKeywords.filter((k) => k !== kw),
    });
  };

  const handleAddForbidden = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newForbiddenInput.trim()) {
      e.preventDefault();
      const word = newForbiddenInput.trim();
      if (!data.forbiddenWords.includes(word)) {
        onChange({ ...data, forbiddenWords: [...data.forbiddenWords, word] });
      }
      setNewForbiddenInput("");
    }
  };

  const handleRemoveForbidden = (fb: string) => {
    onChange({
      ...data,
      forbiddenWords: data.forbiddenWords.filter((w) => w !== fb),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Core Identity Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">fingerprint</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface font-headline-sm">
                1. Thông tin Cốt lõi (Core Identity)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Nhận diện doanh nghiệp cho các mô hình AI LLM tinh chỉnh nội dung có bối cảnh.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-outline hidden sm:inline">table: workspace_profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
              <span>Tên thương hiệu</span>
              <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.brandName}
                onChange={(e) => onChange({ ...data, brandName: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-[18px]">
                verified
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
              <span>Ngành nghề hoạt động</span>
              <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                value={data.industry}
                onChange={(e) => onChange({ ...data, industry: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/20"
              >
                <option value="B2B SaaS & Growth Marketing Technology">
                  B2B SaaS & Growth Marketing Technology
                </option>
                <option value="Fintech & High-Frequency Digital Banking">
                  Fintech & High-Frequency Digital Banking
                </option>
                <option value="AI Agency & Creative Ops">AI Agency & Creative Ops</option>
                <option value="E-commerce D2C Automation">E-commerce D2C Automation</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-on-surface">Định vị thương hiệu & Mô tả ngắn</label>
            <textarea
              rows={2}
              value={data.positioningDescription}
              onChange={(e) => onChange({ ...data, positioningDescription: e.target.value })}
              className="w-full p-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary resize-none border border-outline-variant/20 leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-on-surface">
              Đối tượng mục tiêu (Target Audience)
            </label>
            <input
              type="text"
              value={data.targetAudience}
              onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20"
            />
            <p className="text-[11px] text-on-surface-variant">
              Phân cách bằng dấu phẩy. Giúp AI tối ưu hóa độ sâu chuyên môn và cấu trúc luận điểm.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Tone of Voice Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface font-headline-sm">
                2. Tone giọng & Phong cách Viết (Tone of Voice)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Thiết lập tính cách câu chữ, tỷ lệ biểu cảm và lời kêu gọi hành động chuẩn hóa.
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-semibold hidden sm:inline">
            Prompt Matrix Layer
          </span>
        </div>

        {/* Tone Chips */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface">Sắc thái trọng tâm (Preset Tone Selection)</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TONES.map((tone) => {
              const isSelected = data.selectedTones.includes(tone);
              return (
                <button
                  key={tone}
                  type="button"
                  onClick={() => toggleTone(tone)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-on-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSelected ? "check" : "add"}
                  </span>
                  <span>{tone}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface">Chỉ dẫn phong cách diễn đạt chuyên biệt</label>
          <textarea
            rows={3}
            value={data.styleInstruction}
            onChange={(e) => onChange({ ...data, styleInstruction: e.target.value })}
            className="w-full p-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20 leading-relaxed"
          />
        </div>

        {/* Emoji Policy */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface">Quy tắc Emoji trong phân phối mạng xã hội</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "MINIMAL",
                title: "Tối giản (Chuẩn B2B)",
                desc: "Giới hạn 1-2 icon tinh tế, phục vụ ngắt đoạn trực quan.",
              },
              {
                id: "RICH",
                title: "Phong phú (B2C)",
                desc: "Sinh động, hấp dẫn thị giác, kích thích tương tác cảm xúc.",
              },
              {
                id: "NONE",
                title: "Tuyệt đối không dùng",
                desc: "Phong cách báo chí điều tra hoặc thông báo kỹ thuật thuần túy.",
              },
            ].map((em) => (
              <label
                key={em.id}
                onClick={() => onChange({ ...data, emojiPolicy: em.id as any })}
                className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
                  data.emojiPolicy === em.id
                    ? "bg-primary-fixed/30 border-primary/40 shadow-xs"
                    : "bg-surface-container-low border-transparent hover:bg-surface-container-high"
                }`}
              >
                <input
                  type="radio"
                  name="emojiPolicy"
                  checked={data.emojiPolicy === em.id}
                  onChange={() => {}}
                  className="mt-0.5 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">{em.title}</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">{em.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Default CTA */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-on-surface">CTA mặc định (Default Call-to-Action)</label>
            <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">link</span>
              Tự động gắn UTM tag
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={data.defaultCta}
              onChange={(e) => onChange({ ...data, defaultCta: e.target.value })}
              className="w-full h-10 px-3 pl-9 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              ads_click
            </span>
          </div>
        </div>
      </section>

      {/* 3. Server-side Content Filter (Guardrails) */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface font-headline-sm">
                3. Server-side Content Filter (Từ khóa & An toàn)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Lớp bảo vệ kiểm duyệt thời gian thực dựa trên JSONB data schema (task.md Section 11.1).
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-error text-on-error px-2 py-0.5 rounded-full font-semibold hidden sm:inline">
            Strict Guardrail
          </span>
        </div>

        {/* Preferred Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface">
            Từ khóa ưu tiên (Preferred Keywords - JSONB tags)
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
            {data.preferredKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest text-primary rounded-lg font-mono text-xs shadow-xs border border-outline-variant/20"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-outline hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Nhập từ mới rồi ấn Enter..."
              className="flex-1 min-w-[160px] bg-transparent font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none px-2"
            />
          </div>
        </div>

        {/* Forbidden Words */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error text-[18px]">gpp_bad</span>
              <span>Danh sách Từ cấm kỵ (Forbidden Words - Server Guardrail)</span>
            </label>
            <span className="font-mono text-xs text-error font-medium">
              {data.forbiddenWords.length} từ đang chặn
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-error-container/20 rounded-xl border border-error-container/40">
            {data.forbiddenWords.map((fb) => (
              <span
                key={fb}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest text-error rounded-lg text-xs font-semibold shadow-xs border border-error-container/40"
              >
                <span>{fb}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveForbidden(fb)}
                  className="text-error/70 hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newForbiddenInput}
              onChange={(e) => setNewForbiddenInput(e.target.value)}
              onKeyDown={handleAddForbidden}
              placeholder="Thêm từ cấm + Enter..."
              className="flex-1 min-w-[160px] bg-transparent text-xs text-error placeholder:text-error/60 focus:outline-none px-2"
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant leading-relaxed border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
            <span>
              Nếu AI sinh ra bất kỳ từ nào trong danh mục này, hệ thống sẽ tự động kích hoạt{" "}
              <strong className="text-on-surface">Server-side Content Filter</strong> để viết lại ngữ cảnh mà
              không làm gián đoạn lịch đăng, trước khi người dùng nhìn thấy bài viết tại Thư viện.
            </span>
          </div>
        </div>

        {/* Violation Policy */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="text-xs font-semibold text-on-surface">Chế độ can thiệp khi vi phạm Guardrail</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label
              onClick={() => onChange({ ...data, violationPolicy: "AUTO_REWRITE" })}
              className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
                data.violationPolicy === "AUTO_REWRITE"
                  ? "bg-primary-fixed/30 border-primary/40 shadow-xs"
                  : "bg-surface-container-low border-transparent hover:bg-surface-container-high"
              }`}
            >
              <input
                type="radio"
                name="violationPolicy"
                checked={data.violationPolicy === "AUTO_REWRITE"}
                onChange={() => {}}
                className="mt-0.5 accent-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span>Tự động viết lại (Auto-Rewrite)</span>
                  <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.2 rounded font-semibold">
                    KHUYÊN DÙNG
                  </span>
                </span>
                <span className="text-[11px] text-on-surface-variant leading-relaxed">
                  Mô hình AI tự động dùng từ đồng nghĩa chuẩn mực B2B để thay thế tức thời.
                </span>
              </div>
            </label>

            <label
              onClick={() => onChange({ ...data, violationPolicy: "FLAG_MANUAL" })}
              className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
                data.violationPolicy === "FLAG_MANUAL"
                  ? "bg-primary-fixed/30 border-primary/40 shadow-xs"
                  : "bg-surface-container-low border-transparent hover:bg-surface-container-high"
              }`}
            >
              <input
                type="radio"
                name="violationPolicy"
                checked={data.violationPolicy === "FLAG_MANUAL"}
                onChange={() => {}}
                className="mt-0.5 accent-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Đánh dấu cảnh báo đỏ & Sửa thủ công</span>
                <span className="text-[11px] text-on-surface-variant leading-relaxed">
                  Tạm dừng luồng đăng tự động, gửi thông báo trực tiếp cho Admin phê duyệt.
                </span>
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
