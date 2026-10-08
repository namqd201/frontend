"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Cpu, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Layers, 
  AlertCircle,
  PlayCircle,
  Radio
} from "lucide-react";
import { AiPipelineProgressResponse, ActivePipelineTask } from "@/types/pipeline";
import { PipelineStepperCard } from "@/components/pipeline/PipelineStepperCard";
import { AiStatsCards } from "@/components/pipeline/AiStatsCards";
import { RecentAiActivities } from "@/components/pipeline/RecentAiActivities";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function AiPipelinePage() {
  const [data, setData] = useState<AiPipelineProgressResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [triggering, setTriggering] = useState<boolean>(false);
  const [triggerMessage, setTriggerMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchPipelineData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      // Thử gọi /api/v1/ai/pipeline, nếu lỗi thử /api/v1/settings/ai/pipeline
      let res = await fetch("http://localhost:8080/api/v1/ai/pipeline", {
        credentials: "include",
      });
      if (!res.ok) {
        res = await fetch("http://localhost:8080/api/v1/settings/ai/pipeline", {
          credentials: "include",
        });
      }

      if (res.ok) {
        const json: AiPipelineProgressResponse = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu AI Pipeline:", err);
    } finally {
      setLoading(false);
      if (showIndicator) setIsRefreshing(false);
    }
  }, []);

  // Fetch ban đầu
  useEffect(() => {
    fetchPipelineData();
  }, [fetchPipelineData]);
  // Auto-refresh interval và mutation listener (realtime sync)
  useRealtimeSync(() => {
    if (autoRefresh) fetchPipelineData(false);
  }, { interval: 3500 });

  // Xử lý kích hoạt AI viết bài ngay
  const handleTriggerNow = async () => {
    setTriggering(true);
    setTriggerMessage(null);
    try {
      const res = await fetch("http://localhost:8080/api/v1/ai/trigger", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setTriggerMessage(json.message || "Đã kích hoạt AI viết bài thành công!");
        // Refresh lại dữ liệu
        await fetchPipelineData(true);
      } else {
        setTriggerMessage("Không thể kích hoạt tự động (Vui lòng kiểm tra kết nối API)");
      }
    } catch (err) {
      console.error("Lỗi kích hoạt:", err);
      setTriggerMessage("Lỗi khi gửi lệnh kích hoạt");
    } finally {
      setTriggering(false);
    }
  };

  // Lọc tác vụ hiển thị
  const filteredTasks = (data?.activeTasks || []).filter((task) => {
    if (statusFilter === "ALL") return true;
    return task.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
              <Cpu className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Tiến trình AI (AI Pipeline Monitor)
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Theo dõi chi tiết quy trình 5 bước AI tạo nội dung, kiểm duyệt an toàn và lịch sử vận hành thời gian thực.
          </p>
        </div>

        {/* Nút tác vụ & Auto refresh toggle */}
        <div className="flex items-center gap-2.5">
          {/* Nút Auto-refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoRefresh
                ? "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
            }`}
            title={autoRefresh ? "Đang bật tự động cập nhật mỗi 5 giây" : "Bấm để bật tự động cập nhật"}
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefresh ? "animate-pulse text-[#16A34A]" : ""}`} />
            <span>{autoRefresh ? "Live (5s)" : "Tạm dừng"}</span>
          </button>

          {/* Nút Làm mới ngay */}
          <button
            onClick={() => fetchPipelineData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F8FAFC] disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2563EB]" : ""}`} />
            <span>Làm mới</span>
          </button>

          {/* Nút Kích hoạt AI viết bài ngay */}
          <button
            onClick={handleTriggerNow}
            disabled={triggering}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm disabled:opacity-50 transition-colors"
          >
            <Zap className={`h-3.5 w-3.5 ${triggering ? "animate-bounce" : ""}`} />
            <span>{triggering ? "Đang phát lệnh..." : "Kích hoạt AI viết ngay"}</span>
          </button>
        </div>
      </div>

      {/* Thông báo kết quả kích hoạt */}
      {triggerMessage && (
        <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
            <span>{triggerMessage}</span>
          </div>
          <button 
            onClick={() => setTriggerMessage(null)}
            className="text-xs font-bold text-[#1E40AF] hover:underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Thẻ thống kê tổng quan */}
      <AiStatsCards
        totalPlanned={data?.totalPlanned ?? 0}
        totalGenerating={data?.totalGenerating ?? 0}
        totalReady={data?.totalReady ?? 0}
        totalFailed={data?.totalFailed ?? 0}
      />

      {/* Khối danh sách bài viết & Quy trình Stepper */}
      <div className="space-y-4">
        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "ALL"
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Tất cả ({data?.activeTasks?.length ?? 0})
            </button>
            <button
              onClick={() => setStatusFilter("GENERATING")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "GENERATING"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Đang viết ({data?.totalGenerating ?? 0})
            </button>
            <button
              onClick={() => setStatusFilter("PLANNED")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "PLANNED"
                  ? "bg-white text-[#475569] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Chờ duyệt ({data?.totalPlanned ?? 0})
            </button>
            <button
              onClick={() => setStatusFilter("READY")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "READY"
                  ? "bg-white text-[#16A34A] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Đã xong ({data?.totalReady ?? 0})
            </button>
          </div>

          <span className="text-xs text-[#64748B]">
            Hiển thị {filteredTasks.length} tác vụ trong quy trình
          </span>
        </div>

        {/* Danh sách Task Steppers */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E2E8F0]">
            <RefreshCw className="h-6 w-6 animate-spin text-[#2563EB] mx-auto mb-2" />
            <span className="text-xs text-[#64748B]">Đang tải tiến trình xử lý của AI...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E2E8F0]">
            <Layers className="h-8 w-8 text-[#94A3B8] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#0F172A]">Chưa có bài viết nào trong trạng thái này</h4>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Tất cả các bài trong kế hoạch xuất bản sẽ tự động chạy qua quy trình này trước giờ đăng.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <PipelineStepperCard key={task.postId} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Lịch sử hoạt động AI gần nhất */}
      <RecentAiActivities activities={data?.recentActivities ?? []} />
    </div>
  );
}
