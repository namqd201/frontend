'use client';

import React, { useState } from 'react';
import { PlatformConfig } from './ChannelCard';

interface ManualConnectModalProps {
  isOpen: boolean;
  config: PlatformConfig;
  onClose: () => void;
  onSubmit: (data: {
    platform: string;
    displayName: string;
    platformAccountId: string;
    accessToken: string;
    username?: string;
    appId?: string;
    appSecret?: string;
  }) => Promise<void>;
}

export const ManualConnectModal: React.FC<ManualConnectModalProps> = ({
  isOpen,
  config,
  onClose,
  onSubmit,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [platformAccountId, setPlatformAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [showAutoPermanent, setShowAutoPermanent] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformAccountId.trim() && !accessToken.trim() && !displayName.trim()) {
      setError('Vui lòng nhập ít nhất Tên Page hoặc Access Token');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        platform: config.platform,
        displayName: displayName.trim(),
        platformAccountId: platformAccountId.trim(),
        accessToken: accessToken.trim(),
        username: username.trim(),
        appId: appId.trim() || undefined,
        appSecret: appSecret.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm kết nối';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: config.brandColor }}
            >
              {config.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Thêm {config.title} thủ công
              </h3>
              <p className="text-xs text-slate-500">
                Nhập Token hoặc Page ID để kết nối trực tiếp không cần OAuth
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tên hiển thị / Tên Fanpage <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ví dụ: NQDSM Official Fanpage"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page ID / Account ID
                </label>
                <input
                  type="text"
                  value={platformAccountId}
                  onChange={(e) => setPlatformAccountId(e.target.value)}
                  placeholder="Ví dụ: 1048291048123"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username (@tag)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: nqdsm_tech"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Access Token (Page Token hoặc User Token)
                </label>
                <span className="text-2xs text-slate-400">Tùy chọn khi test</span>
              </div>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                rows={3}
                placeholder="Dán mã Access Token lấy từ Graph API Explorer hoặc phần mềm..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
              <p className="text-2xs text-slate-500 mt-1">
                💡 Nếu dán Token thật từ Meta Graph API Explorer, hệ thống sẽ tự động quét danh sách Fanpage và ảnh đại diện thật của bạn!
              </p>
            </div>

            {/* Permanent/Long-lived Token Extension Section for Facebook & Threads */}
            {(config.platform === 'FACEBOOK' || config.platform === 'THREADS') && (
              <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {config.platform === 'FACEBOOK' 
                        ? 'Tự động đổi Token Vĩnh viễn (Never Expire)' 
                        : 'Tự động đổi Token 60 ngày (Long-Lived Token)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAutoPermanent(!showAutoPermanent)}
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    {showAutoPermanent ? 'Thu gọn' : 'Bật cấu hình'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {config.platform === 'FACEBOOK'
                    ? 'Mã Graph API Explorer mặc định chỉ sống được 1 - 2 giờ. Để hệ thống lên lịch và đăng bài auto không bị gián đoạn, bạn có thể nhập App ID & Secret để hệ thống tự động đổi thành Page Token vĩnh viễn!'
                    : 'Mã Threads ngắn hạn mặc định sống 1 giờ. Nếu server đã cấu hình biến môi trường THREADS_APP_SECRET, hệ thống sẽ tự động đổi sang Token 60 ngày. Bạn cũng có thể nhập trực tiếp App ID & Secret bên dưới.'}
                </p>

                {showAutoPermanent && (
                  <div className="space-y-2.5 pt-2 border-t border-blue-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {config.platform === 'FACEBOOK' ? 'Facebook App ID' : 'Threads App ID'}
                        </label>
                        <input
                          type="text"
                          value={appId}
                          onChange={(e) => setAppId(e.target.value)}
                          placeholder="VD: 1538291048123"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {config.platform === 'FACEBOOK' ? 'Facebook App Secret' : 'Threads App Secret'}
                        </label>
                        <input
                          type="password"
                          value={appSecret}
                          onChange={(e) => setAppSecret(e.target.value)}
                          placeholder="Mã bí mật của ứng dụng..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      📍 Lấy tại: developers.facebook.com ➔ Ứng dụng ({config.title}) ➔ Cài đặt ứng dụng ➔ Cơ bản.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Guide Accordion for manual 0-code never expire token */}
            {config.platform === 'FACEBOOK' && (
              <div className="text-2xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setShowManualGuide(!showManualGuide)}
                  className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                >
                  <span>{showManualGuide ? '▼ Ẩn hướng dẫn' : '▶ Xem cách lấy Token Vĩnh viễn trực tiếp trên Meta (Không cần App Secret)'}</span>
                </button>
                {showManualGuide && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                    <p className="font-semibold text-slate-800">3 bước lấy Page Access Token vĩnh viễn không bao giờ hết hạn:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                      <li>Truy cập <a href="https://developers.facebook.com/tools/debug/accesstoken/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Trình gỡ lỗi mã truy cập (Access Token Debugger)</a>, dán token ngắn hạn vào và bấm <strong>Gỡ lỗi</strong>.</li>
                      <li>Kéo xuống cuối cùng bấm nút <strong>Mở rộng mã truy cập (Extend Access Token)</strong> ➔ Nhận mã 60 ngày.</li>
                      <li>Mở lại Graph API Explorer, dán mã 60 ngày vào ô Token, gọi <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">GET me/accounts?fields=name,id,access_token</code> ➔ Copy chuỗi <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">access_token</code> của Fanpage bạn muốn kết nối và dán vào ô Access Token ở trên!</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu & Kết nối</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
