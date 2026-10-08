'use client';

import React from 'react';
import { ContentPlanItem } from '@/types/plan';
import { api } from '@/lib/api';

interface PlanListProps {
  plans: ContentPlanItem[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export const PlanList: React.FC<PlanListProps> = ({
  plans,
  onRefresh,
  onOpenCreate,
}) => {
  const handleActivate = async (planId: string) => {
    try {
      await api.post(`/api/v1/plans/${planId}/activate`, {});
      onRefresh();
    } catch (err) {
      console.error('Lỗi kích hoạt:', err);
      alert('Không thể kích hoạt kế hoạch');
    }
  };

  const handlePause = async (planId: string) => {
    try {
      await api.post(`/api/v1/plans/${planId}/pause`, {});
      onRefresh();
    } catch (err) {
      console.error('Lỗi tạm dừng:', err);
    }
  };

  const handleResume = async (planId: string) => {
    try {
      await api.post(`/api/v1/plans/${planId}/resume`, {});
      onRefresh();
    } catch (err) {
      console.error('Lỗi tiếp tục:', err);
    }
  };

  const handleCancel = async (planId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy kế hoạch này? Các bài đăng chưa chạy sẽ bị bỏ qua.')) return;
    try {
      await api.post(`/api/v1/plans/${planId}/cancel`, {});
      onRefresh();
    } catch (err) {
      console.error('Lỗi hủy:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đang chạy
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Bản nháp
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Tạm dừng
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Đã hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Chưa có Kế hoạch đăng bài nào
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Thiết lập một lần cho cả tuần: AI sẽ tự viết nội dung, tạo ảnh minh họa và đăng tự động theo các khung giờ bạn chọn.
        </p>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
        >
          <span>+ Tạo kế hoạch đầu tiên</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Danh sách kế hoạch ({plans.length})
          </h2>
          <p className="text-2xs text-slate-500">
            Theo dõi tiến độ đăng bài tự động và quản lý các chiến dịch
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
        >
          <span>+ Tạo kế hoạch mới</span>
        </button>
      </div>

      <div className="space-y-3">
        {plans.map((p) => {
          const progressPercent = p.totalSlots > 0
            ? Math.round((p.publishedSlots / p.totalSlots) * 100)
            : 0;

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {p.name}
                    </h3>
                    {getStatusBadge(p.status)}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.topic}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-500 pt-1">
                    <span>
                      Thời gian: <strong className="text-slate-700">{p.startDate}</strong> đến <strong className="text-slate-700">{p.endDate}</strong>
                    </span>
                    <span>•</span>
                    <span>Tần suất: <strong className="text-slate-700">{p.postsPerDay} bài/ngày</strong></span>
                    <span>•</span>
                    <span>Ước tính AI: <strong className="text-emerald-600">~${p.estimatedCostUsd?.toFixed(2) || '0.00'}</strong></span>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  {p.status === 'ACTIVE' && p.totalSlots > 0 && (
                    <div className="w-40 space-y-1">
                      <div className="flex justify-between text-2xs text-slate-500">
                        <span>Tiến độ</span>
                        <span className="font-semibold text-slate-700">{p.publishedSlots}/{p.totalSlots} ({progressPercent}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {p.status === 'DRAFT' && (
                      <button
                        type="button"
                        onClick={() => handleActivate(p.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                      >
                        Kích hoạt
                      </button>
                    )}
                    {p.status === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handlePause(p.id)}
                        className="px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-xl transition-colors"
                      >
                        Tạm dừng
                      </button>
                    )}
                    {p.status === 'PAUSED' && (
                      <button
                        type="button"
                        onClick={() => handleResume(p.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                      >
                        Tiếp tục
                      </button>
                    )}
                    {(p.status === 'ACTIVE' || p.status === 'PAUSED' || p.status === 'DRAFT') && (
                      <button
                        type="button"
                        onClick={() => handleCancel(p.id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
