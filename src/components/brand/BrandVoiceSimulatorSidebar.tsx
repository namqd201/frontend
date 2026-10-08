"use client";

import React, { useState } from "react";
import { BrandProfileData, BrandVoiceTestResult } from "@/types/brand";

interface BrandVoiceSimulatorSidebarProps {
  data: BrandProfileData;
  onRunTest: (text: string) => Promise<BrandVoiceTestResult>;
}

export const BrandVoiceSimulatorSidebar: React.FC<BrandVoiceSimulatorSidebarProps> = ({
  data,
  onRunTest,
}) => {
  const [sampleText, setSampleText] = useState(
    "Tại Acme Growth Studio, chúng tôi cam kết 100% tăng trưởng chuyển đổi B2B bền vững nhờ giải pháp #ZeroDuplicate tự động hóa."
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<BrandVoiceTestResult | null>(null);

  const handleTest = async () => {
    try {
      setTesting(true);
      const res = await onRunTest(sampleText);
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  // SVG Gauge calculations (radius = 42, circumference ~= 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * data.consistencyScore) / 100;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Brand Alignment Score Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
            <h3 className="text-base font-bold text-on-surface font-headline-sm">Chỉ số Tuân thủ</h3>
          </div>
          <span className="text-[11px] bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full font-semibold">
            REAL-TIME
          </span>
        </div>

        {/* Gauge Center */}
        <div className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container-high"
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-primary transition-all duration-700"
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-on-surface font-display-lg">
                {data.consistencyScore}%
              </span>
              <span className="text-[10px] text-outline uppercase font-semibold">Consistency</span>
            </div>
          </div>
          <span className="text-xs text-on-surface-variant mt-2 text-center">
            Cấu hình đạt tiêu chuẩn cao cho luồng tự động hóa Social Engine.
          </span>
        </div>

        {/* Breakdown Badges */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">record_voice_over</span>
              <span className="text-xs text-on-surface font-medium">Tone Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary font-bold">{data.toneMatchScore}%</span>
              <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 rounded font-semibold">
                Cao
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
              <span className="text-xs text-on-surface font-medium">Safe Words Filter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-tertiary font-bold">{data.safeWordsScore}%</span>
              <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.2 rounded font-semibold">
                Tuyệt đối
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">tag</span>
              <span className="text-xs text-on-surface font-medium">Keyword Density</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-secondary font-bold">{data.keywordDensityScore}%</span>
              <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.2 rounded font-semibold">
                Tối ưu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Sandbox Tester */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">science</span>
            <h3 className="text-base font-bold text-on-surface font-headline-sm">Sandbox Kiểm thử Tức thì</h3>
          </div>
          <span className="font-mono text-xs text-outline">Gemini 1.5 Pro</span>
        </div>

        <p className="text-xs text-on-surface-variant">
          Kiểm tra trực tiếp mức độ tuân thủ của các văn bản trước khi nạp vào Automation Pipeline.
        </p>

        <div className="flex flex-col gap-1.5">
          <textarea
            rows={3}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full p-3 bg-surface-container-low rounded-xl text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary resize-none border border-outline-variant/20 leading-relaxed"
            placeholder="Nhập đoạn văn bản ngắn để kiểm tra độ tuân thủ Brand Voice..."
          />
        </div>

        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="w-full py-2.5 px-4 bg-secondary text-on-secondary text-xs font-semibold rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${testing ? "animate-spin" : ""}`}>
            {testing ? "sync" : "play_circle"}
          </span>
          <span>{testing ? "Đang thẩm định..." : "Chạy thẩm định nội dung"}</span>
        </button>

        {/* Test Result Card */}
        {testResult && (
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-on-surface">Kết quả phân tích:</span>
              <span className="font-bold text-primary">{testResult.score}/100 Điểm</span>
            </div>

            {testResult.detectedForbiddenWords.length > 0 && (
              <div className="text-error flex items-center gap-1.5 text-[11px]">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>Phát hiện từ cấm: {testResult.detectedForbiddenWords.join(", ")}</span>
              </div>
            )}

            <p className="text-[11px] text-on-surface-variant leading-relaxed">{testResult.feedback}</p>

            {testResult.rewrittenText && (
              <div className="pt-2 border-t border-outline-variant/20">
                <span className="text-[10px] uppercase font-bold text-outline">Bản tự động viết lại:</span>
                <p className="text-xs text-on-surface italic mt-0.5 font-medium bg-surface-container-lowest p-2 rounded-lg">
                  "{testResult.rewrittenText}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
