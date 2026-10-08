'use client';

import React, { useState } from 'react';
import { InviteMemberRequest } from '@/types/team';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteMemberRequest) => Promise<void>;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CONTENT_CREATOR');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      await onSubmit({ email, role, note });
      setEmail('');
      setNote('');
      setRole('CONTENT_CREATOR');
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mời thành viên mới</h3>
              <p className="text-xs text-slate-500">
                Gửi thư mời tham gia workspace bảo mật qua mã xác thực HMAC SHA-256
              </p>
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
            <label className="text-xs font-semibold text-slate-700" htmlFor="invite-email">
              Địa chỉ Email người nhận <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">mail</span>
              <input
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                id="invite-email"
                placeholder="colleague@acmegrowth.vn"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="invite-role">
              Vai trò ủy quyền (RBAC) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer pr-10"
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="WORKSPACE_ADMIN">WORKSPACE_ADMIN · Quản trị viên phụ trách xét duyệt & MXH</option>
                <option value="CONTENT_CREATOR">CONTENT_CREATOR · Sáng tạo nội dung & Prompt AI</option>
                <option value="VIEWER_ANALYST">VIEWER / ANALYST · Xem dữ liệu thống kê & Lịch xuất bản</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-slate-400 pointer-events-none">
                unfold_more
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Không thể gán quyền WORKSPACE_OWNER qua thư mời thông thường.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="invite-note">
              Ghi chú xác thực nội bộ (Tùy chọn)
            </label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              id="invite-note"
              placeholder="Ví dụ: Phụ trách chiến dịch TikTok Quý 3/2026..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-slate-600">
            <span className="material-symbols-outlined text-[18px] text-blue-600 mt-0.5">verified_user</span>
            <p className="text-xs leading-relaxed">
              Lời mời có hiệu lực trong vòng <strong className="text-slate-800">7 ngày</strong>. Người được mời sẽ nhận
              email xác thực chứa token mật mã một lần.
            </p>
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
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{submitting ? 'Đang gửi...' : 'Gửi lời mời bảo mật'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
