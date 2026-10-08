"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Palette,
  Compass,
  FileCheck2,
  Image as ImageIcon
} from "lucide-react";
import { ActivePipelineTask } from "@/types/pipeline";
import Link from "next/link";

interface PipelineStepperCardProps {
  task: ActivePipelineTask;
}

const PIPELINE_STEPS = [
  {
    step: 1,
    title: "1. Khám phá & Nghiên cứu góc nhìn",
    subtitle: "Research & Ideation",
    desc: "AI phân tích chủ đề, chọn lọc góc nhìn độc đáo và cấu trúc thông điệp cốt lõi.",
    icon: Compass,
  },
  {
    step: 2,
    title: "2. Áp dụng Brand Tone & Phong cách",
    subtitle: "Brand Voice Alignment",
    desc: "Tích hợp tông giọng thương hiệu, loại trừ từ cấm và nhúng hashtag ưu tiên.",
    icon: Palette,
  },
  {
    step: 3,
    title: "3. Sinh nội dung đa nền tảng",
    subtitle: "Gemini 3.8 Flash Pro Content Generation",
    desc: "Tạo tiêu đề hấp dẫn, nội dung chi tiết, biểu tượng cảm xúc và lời kêu gọi hành động (CTA).",
    icon: Sparkles,
  },
  {
    step: 4,
    title: "4. Kiểm duyệt an toàn ContentGuard",
    subtitle: "Safety & Compliance Audit",
    desc: "Quét kiểm duyệt tự động tiêu chuẩn cộng đồng Facebook/Mạng xã hội và an toàn từ khóa.",
    icon: ShieldCheck,
  },
  {
    step: 5,
    title: "5. Tạo hình ảnh & Hoàn tất lên lịch",
    subtitle: "Media & Final Dispatch",
    desc: "Tạo ảnh minh họa phù hợp ngữ cảnh và lưu bài ở trạng thái Sẵn sàng xuất bản (READY).",
    icon: ImageIcon,
  },
];

export function PipelineStepperCard({ task }: PipelineStepperCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isGenerating = task.status === "GENERATING";
  const isFailed = task.status === "GENERATION_FAILED";
  const isReady = task.status === "READY";
  const isPlanned = task.status === "PLANNED";

  // Xác định step hiện tại:
  // Nếu status là READY -> step 5 hoàn tất
  // Nếu GENERATING -> step 3 hoặc 4
  // Nếu PLANNED -> step 1
  let activeStep = 1;
  if (isReady) activeStep = 5;
  else if (isGenerating) activeStep = 3;
  else if (isFailed) activeStep = 3;
  else activeStep = 1;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all hover:border-[#CBD5E1]">
      {/* Header Task */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0 border border-[#DBEAFE]">
            {task.platform === "FACEBOOK" ? "f" : task.platform === "TELEGRAM" ? "tg" : "AI"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#0F172A] truncate">
                {task.topic || "Bài viết nội dung tự động"}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">
                {task.platform}
              </span>
            </div>
            <p className="text-xs text-[#64748B] truncate mt-0.5">
              Kế hoạch: <span className="font-medium text-[#334155]">{task.planName || "Mặc định"}</span> · Model: <span className="text-[#2563EB] font-medium">{task.modelUsed || "gemini-3.8-flash"}</span>
            </p>
          </div>
        </div>

        {/* Trạng thái & Toggle */}
        <div className="flex items-center gap-3">
          {isGenerating && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1D4ED8] animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Đang viết nội dung ({task.percentComplete || 60}%)
            </span>
          )}
          {isPlanned && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
              <Clock className="h-3.5 w-3.5 text-[#64748B]" />
              Trong hàng đợi
            </span>
          )}
          {isReady && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã xong (Sẵn sàng đăng)
            </span>
          )}
          {isFailed && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
              <AlertCircle className="h-3.5 w-3.5" />
              Gặp sự cố
            </span>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] rounded transition-colors"
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar (Overall) */}
      <div className="h-1 bg-[#F1F5F9] w-full">
        <div 
          className={`h-full transition-all duration-500 ${
            isReady ? "bg-[#16A34A]" : isFailed ? "bg-[#DC2626]" : "bg-[#2563EB]"
          }`}
          style={{ width: `${task.percentComplete || (isReady ? 100 : isGenerating ? 60 : 15)}%` }}
        />
      </div>

      {/* Chi tiết từng bước Stepper dọc */}
      {isExpanded && (
        <div className="p-5 bg-white">
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
            {PIPELINE_STEPS.map((s, idx) => {
              const StepIcon = s.icon;
              
              // Tính toán trạng thái của bước này:
              let isStepDone = false;
              let isStepActive = false;
              let isStepPending = false;
              let isStepFailed = false;

              if (isReady) {
                isStepDone = true;
              } else if (isGenerating) {
                if (s.step < activeStep) isStepDone = true;
                else if (s.step === activeStep) isStepActive = true;
                else isStepPending = true;
              } else if (isFailed) {
                if (s.step < activeStep) isStepDone = true;
                else if (s.step === activeStep) isStepFailed = true;
                else isStepPending = true;
              } else {
                // PLANNED
                if (s.step === 1) isStepActive = true;
                else isStepPending = true;
              }

              return (
                <div key={s.step} className="relative flex items-start gap-4">
                  {/* Step Dot Icon */}
                  <div className="absolute -left-[30px] top-0.5">
                    {isStepDone && (
                      <div className="h-6 w-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {isStepActive && (
                      <div className="h-6 w-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center ring-4 ring-white shadow-sm animate-pulse">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      </div>
                    )}
                    {isStepFailed && (
                      <div className="h-6 w-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                        <AlertCircle className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {isStepPending && (
                      <div className="h-6 w-6 rounded-full bg-[#F1F5F9] text-[#94A3B8] border border-[#CBD5E1] flex items-center justify-center ring-4 ring-white">
                        <span className="text-[10px] font-bold">{s.step}</span>
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className={`flex-1 min-w-0 ${isStepPending ? "opacity-60" : ""}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${
                          isStepActive ? "text-[#2563EB]" : isStepDone ? "text-[#0F172A]" : "text-[#475569]"
                        }`}>
                          {s.title}
                        </h4>
                        <span className="text-xs text-[#94A3B8] font-normal">
                          ({s.subtitle})
                        </span>
                      </div>

                      {isStepActive && (
                        <span className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                          Đang thực thi...
                        </span>
                      )}
                      {isStepDone && (
                        <span className="text-xs font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                          Đã hoàn thành
                        </span>
                      )}
                      {isStepFailed && (
                        <span className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                          Lỗi
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {s.desc}
                    </p>

                    {/* Hiển thị chi tiết thời gian hoặc tiến trình phụ nếu đang active */}
                    {isStepActive && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0" />
                        <span>{task.progressDescription || "Đang tối ưu văn phong tự động theo tiêu chuẩn Facebook Pro"}</span>
                      </div>
                    )}

                    {isStepFailed && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0" />
                        <span>{task.progressDescription || "Gặp sự cố khi gọi Gemini AI"}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">
              Cập nhật lần cuối: {new Date(task.updatedAt).toLocaleTimeString("vi-VN")}
            </span>
            <Link
              href={`/posts?id=${task.postId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded-lg border border-[#BFDBFE] transition-colors"
            >
              <span>Xem bài viết chi tiết</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
