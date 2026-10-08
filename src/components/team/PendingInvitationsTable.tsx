'use client';

import React from 'react';
import { PendingInvitationItem } from '@/types/team';

interface PendingInvitationsTableProps {
  invitations: PendingInvitationItem[];
  onResend: (invitation: PendingInvitationItem) => void;
  onRevoke: (invitation: PendingInvitationItem) => void;
}

export const PendingInvitationsTable: React.FC<PendingInvitationsTableProps> = ({
  invitations,
  onResend,
  onRevoke,
}) => {
  const getRoleBadge = (role: PendingInvitationItem['role']) => {
    switch (role) {
      case 'WORKSPACE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            WORKSPACE_ADMIN
          </span>
        );
      case 'CONTENT_CREATOR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">edit_note</span>
            CONTENT_CREATOR
          </span>
        );
      case 'VIEWER_ANALYST':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
            <span className="material-symbols-outlined text-[13px]">visibility</span>
            VIEWER / ANALYST
          </span>
        );
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined text-[40px] mb-2 text-slate-300">mail_outline</span>
        <p className="text-sm font-medium text-slate-600">Không có lời mời nào đang chờ kích hoạt</p>
        <p className="text-xs text-slate-400 mt-0.5">Nhấn "Mời thành viên mới" để thêm cộng tác viên vào workspace</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
            <th className="py-3 px-6">Email người nhận</th>
            <th className="py-3 px-4">Vai trò đề xuất</th>
            <th className="py-3 px-4">Thời hạn Token</th>
            <th className="py-3 px-4">Bảo mật Token Link</th>
            <th className="py-3 px-6 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-slate-800">
          {invitations.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-slate-900 truncate">{inv.email}</span>
                    <span className="text-xs text-slate-500">
                      Thư mời gửi ngày {formatDate(inv.invitedAt)} {inv.note ? `· "${inv.note}"` : ''}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 whitespace-nowrap">{getRoleBadge(inv.role)}</td>

              <td className="py-3.5 px-4 whitespace-nowrap">
                {inv.hoursRemaining <= 48 ? (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>Còn {inv.hoursRemaining} giờ</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">schedule</span>
                    <span>Còn {Math.round(inv.hoursRemaining / 24)} ngày</span>
                  </div>
                )}
              </td>

              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 max-w-fit">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
                  <span>Mã hóa {inv.tokenType || 'HMAC-SHA256'}</span>
                </div>
              </td>

              <td className="py-3.5 px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    onClick={() => onResend(inv)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">send</span>
                    <span>Gửi lại email</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 text-xs font-medium transition-colors"
                    onClick={() => onRevoke(inv)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">cancel</span>
                    <span>Hủy lời mời</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
