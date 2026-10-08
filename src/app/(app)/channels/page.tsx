'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { SocialConnection } from '@/types/social';
import { api } from '@/lib/api';
import { ChannelCard, PlatformConfig } from '@/components/channels/ChannelCard';

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    platform: 'FACEBOOK',
    title: 'Facebook Page',
    subtitle: 'Đăng bài tự động lên Fanpage',
    brandColor: '#1877F2',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    oauthUrl: '/oauth2/authorization/facebook',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    platform: 'THREADS',
    title: 'Threads',
    subtitle: 'Đăng bài lên trang Threads cá nhân',
    brandColor: '#000000',
    badgeBg: 'bg-zinc-100',
    badgeText: 'text-zinc-800',
    oauthUrl: '/oauth2/authorization/threads',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.186 24C5.466 24 0 18.534 0 11.814 0 5.094 5.466 0 12.186 0c6.643 0 11.96 5.253 12.184 11.892l-2.68.082c-.2-5.17-4.423-9.288-9.504-9.288-5.254 0-9.504 4.25-9.504 9.504 0 5.254 4.25 9.504 9.504 9.504 3.754 0 7.021-2.203 8.528-5.385l2.404 1.196C20.672 21.378 16.71 24 12.186 24z" />
      </svg>
    ),
  },
  {
    platform: 'X',
    title: 'X (Twitter)',
    subtitle: 'Đăng Tweet và chuỗi bài viết',
    brandColor: '#000000',
    badgeBg: 'bg-zinc-100',
    badgeText: 'text-zinc-800',
    oauthUrl: '/oauth2/authorization/twitter',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    platform: 'LINKEDIN',
    title: 'LinkedIn',
    subtitle: 'Đăng bài chuyên nghiệp lên Profile',
    brandColor: '#0A66C2',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    oauthUrl: '/oauth2/authorization/linkedin',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export default function ChannelsPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadConnections = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = await api.get<SocialConnection[]>('/api/v1/social/connections');
      setConnections(data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách kênh:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections(false);
  }, []);

  // Tự động đồng bộ realtime khi có thay đổi kênh hoặc định kỳ 5s
  useRealtimeSync(() => loadConnections(true), { interval: 5000 });

  const handleToggleAccount = async (accountId: string, enabled: boolean) => {
    try {
      await api.put(`/api/v1/social/accounts/${accountId}/toggle`, { enabled });
      // Cập nhật local state
      setConnections((prev) =>
        prev.map((c) => ({
          ...c,
          accounts: c.accounts.map((a) =>
            a.id === accountId ? { ...a, isEnabled: enabled } : a
          ),
        }))
      );
      showToast(enabled ? 'Đã bật kênh đăng bài' : 'Đã tắt kênh đăng bài');
    } catch (err) {
      console.error('Lỗi bật tắt kênh:', err);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleHealthCheck = async (connectionId: string) => {
    try {
      const res = await api.post<{ valid: boolean; message: string }>(
        `/api/v1/social/connections/${connectionId}/health-check`,
        {}
      );
      showToast(res.message);
      loadConnections();
    } catch (err) {
      console.error('Lỗi kiểm tra kết nối:', err);
      showToast('Không thể kết nối đến máy chủ');
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await api.post(`/api/v1/social/connections/${connectionId}/disconnect`, {});
      showToast('Đã ngắt kết nối thành công');
      startTransition(() => {
        setConnections((prev) => prev.filter((c) => c.id !== connectionId));
      });
    } catch (err) {
      console.error('Lỗi ngắt kết nối:', err);
      showToast('Có lỗi xảy ra khi ngắt kết nối');
    }
  };

  const handleConnectFake = async (platform: string, displayName: string) => {
    try {
      await api.post('/api/v1/social/connections/fake/connect', {
        platform,
        displayName,
      });
      showToast(`Đã kết nối giả lập thành công cho ${platform}`);
      loadConnections();
    } catch (err) {
      console.error('Lỗi kết nối fake:', err);
      showToast('Lỗi kết nối giả lập');
    }
  };

  const handleConnectManual = async (data: {
    platform: string;
    displayName: string;
    platformAccountId: string;
    accessToken: string;
    username?: string;
  }) => {
    try {
      await api.post('/api/v1/social/connections/manual/connect', data);
      showToast(`Đã lưu kết nối thành công cho ${data.platform}`);
      await loadConnections();
    } catch (err) {
      console.error('Lỗi kết nối thủ công:', err);
      showToast('Có lỗi xảy ra khi lưu kết nối');
      throw err;
    }
  };

  const connectedCount = connections.length;
  const totalActiveChannels = connections.reduce(
    (acc, curr) => acc + curr.accounts.filter((a) => a.isEnabled).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Kênh mạng xã hội
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý và kết nối nhiều Fanpage / Tài khoản qua Token hoặc OAuth để tự động hóa đăng bài viết và hình ảnh.
          </p>
        </div>

        {/* Stats pill */}
        <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Kết nối: <strong className="text-slate-900">{connectedCount}/4</strong></span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-slate-600">
            <span>Kênh hoạt động: <strong className="text-emerald-600">{totalActiveChannels}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Platform Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-6 space-y-4">
              <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
              <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLATFORM_CONFIGS.map((config) => {
            const conn = connections.find(
              (c) => c.platform.toUpperCase() === config.platform
            );
            return (
              <ChannelCard
                key={config.platform}
                config={config}
                connection={conn}
                onToggleAccount={handleToggleAccount}
                onHealthCheck={handleHealthCheck}
                onDisconnect={handleDisconnect}
                onConnectFake={handleConnectFake}
                onConnectManual={handleConnectManual}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
