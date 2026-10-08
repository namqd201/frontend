'use client';

import React from 'react';

interface DisconnectDialogProps {
  isOpen: boolean;
  platformName: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DisconnectDialog: React.FC<DisconnectDialogProps> = ({
  isOpen,
  platformName,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Ngắt kết nối {platformName}?
            </h3>
            <p className="text-xs text-slate-500">Thao tác này sẽ hủy liên kết tài khoản</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Bạn có chắc chắn muốn ngắt kết nối kênh <strong>{platformName}</strong>? Tất cả các tài khoản phụ và quyền truy cập sẽ bị xóa. Các bài đăng đã lên lịch tự động cho kênh này có thể bị tạm dừng.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              'Xác nhận ngắt kết nối'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
