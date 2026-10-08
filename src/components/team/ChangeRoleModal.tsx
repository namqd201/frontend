'use client';

import React, { useState } from 'react';
import { TeamMemberItem } from '@/types/team';

interface ChangeRoleModalProps {
  isOpen: boolean;
  member: TeamMemberItem | null;
  onClose: () => void;
  onSubmit: (memberId: string, newRole: string) => Promise<void>;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ isOpen, member, onClose, onSubmit }) => {
  const [role, setRole] = useState<string>(member?.role || 'CONTENT_CREATOR');
  const [submitting, setSubmitting] = useState(false);

  // Sync role if member changes
  React.useEffect(() => {
    if (member) {
      setRole(member.role);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(member.id, role);
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Thay đổi vai trò</h3>
              <p className="text-xs text-slate-500">{member.name} ({member.email})</p>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="change-role-select">
              Chọn vai trò phân quyền mới (RBAC)
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer pr-10"
                id="change-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="WORKSPACE_ADMIN">WORKSPACE_ADMIN · Quản trị viên</option>
                <option value="CONTENT_CREATOR">CONTENT_CREATOR · Người sáng tạo nội dung</option>
                <option value="VIEWER_ANALYST">VIEWER_ANALYST · Người xem & Thống kê</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-slate-400 pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            Thay đổi vai trò sẽ có hiệu lực ngay lập tức. Quyền hạn truy cập các tính năng như duyệt bài, kết nối MXH và tạo prompt AI sẽ được điều chỉnh tương ứng.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={onClose}
              type="button"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
              type="submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
