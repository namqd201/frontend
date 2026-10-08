'use client';

import React from 'react';

interface TeamMetricsGridProps {
  totalMembers: number;
  memberLimit: number;
  adminCount: number;
  creatorCount: number;
  pendingInviteCount: number;
  planTier: string;
}

export const TeamMetricsGrid: React.FC<TeamMetricsGridProps> = ({
  totalMembers,
  memberLimit,
  adminCount,
  creatorCount,
  pendingInviteCount,
  planTier,
}) => {
  const quotaPercent = Math.min(100, Math.round((totalMembers / (memberLimit || 10)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Tổng thành viên & Quota */}
      <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col justify-between gap-3 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tổng thành viên</span>
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[18px]">group</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl text-slate-900 font-bold leading-none">{totalMembers}</span>
            <span className="text-sm text-slate-500 font-medium">/ {memberLimit} thành viên</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500 font-medium">
            <span>Gói {planTier} Workspace</span>
            <span className="font-semibold text-blue-600">{quotaPercent}% Hạn mức</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Quản trị viên */}
      <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col justify-between gap-3 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quản trị viên</span>
          <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl text-slate-900 font-bold leading-none">{adminCount}</span>
            <span className="text-sm text-slate-500 font-medium">người điều hành</span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-snug">
            Có quyền phê duyệt bài viết, chỉnh sửa tự động hóa & kết nối tài khoản MXH.
          </p>
        </div>
      </div>

      {/* KPI 3: Sáng tạo nội dung */}
      <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col justify-between gap-3 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Người sáng tạo</span>
          <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[18px]">draw</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl text-slate-900 font-bold leading-none">{creatorCount}</span>
            <span className="text-sm text-slate-500 font-medium">thành viên đang tạo bài</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-600 font-semibold">Tạo 38 bài tuần này</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Thư mời đang chờ */}
      <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col justify-between gap-3 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lời mời đang chờ</span>
          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl text-slate-900 font-bold leading-none">{pendingInviteCount}</span>
            <span className="text-sm text-slate-500 font-medium">chưa kích hoạt</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-[14px] text-amber-500">timer</span>
            <span>Hiệu lực 7 ngày HMAC-SHA256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
