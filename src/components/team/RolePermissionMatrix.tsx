'use client';

import React from 'react';

interface RolePermissionMatrixProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({ isExpanded, onToggle }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100" id="rbac-matrix-panel">
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">schema</span>
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Bảng Ma trận Phân quyền Vai trò (RBAC Matrix Reference)</h2>
            <p className="text-xs text-slate-500">
              Chi tiết 4 cấp độ phân quyền trong Acme Growth Workspace: Owner, Admin, Creator, Analyst.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-xs hidden sm:inline">{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
          <span
            className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-5 overflow-x-auto pt-3 border-t border-slate-100 animate-in fade-in duration-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-2.5 px-4 rounded-l-lg">Khối Chức Năng / Thao Tác</th>
                <th className="py-2.5 px-4 text-center">Owner</th>
                <th className="py-2.5 px-4 text-center">Admin</th>
                <th className="py-2.5 px-4 text-center">Creator</th>
                <th className="py-2.5 px-4 text-center rounded-r-lg">Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-medium flex items-center gap-2 text-slate-900">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">credit_card</span>
                  Quản lý Thanh toán, Gói cước & Xóa Workspace
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-medium flex items-center gap-2 text-slate-900">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">approval</span>
                  Phê duyệt bài viết (Approve / Reject) & Kết nối MXH
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-medium flex items-center gap-2 text-slate-900">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">smart_toy</span>
                  Soạn thảo bằng AI & Gửi duyệt bài (Submit for Approval)
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[18px]">remove</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-medium flex items-center gap-2 text-slate-900">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">analytics</span>
                  Xem Thư viện bài viết, Lịch đăng & Báo cáo Thống kê
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
