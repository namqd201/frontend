'use client';

import React, { useState } from 'react';
import { SocialConnection, SocialAccount } from '@/types/social';
import { DisconnectDialog } from './DisconnectDialog';
import { ManualConnectModal } from './ManualConnectModal';

export interface PlatformConfig {
  platform: 'FACEBOOK' | 'THREADS' | 'X' | 'LINKEDIN';
  title: string;
  subtitle: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
  oauthUrl: string;
}

interface ChannelCardProps {
  config: PlatformConfig;
  connection?: SocialConnection;
  onToggleAccount: (accountId: string, enabled: boolean) => Promise<void>;
  onHealthCheck: (connectionId: string) => Promise<void>;
  onDisconnect: (connectionId: string) => Promise<void>;
  onConnectFake: (platform: string, displayName: string) => Promise<void>;
  onConnectManual: (data: {
    platform: string;
    displayName: string;
    platformAccountId: string;
    accessToken: string;
    username?: string;
    appId?: string;
    appSecret?: string;
  }) => Promise<void>;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  config,
  connection,
  onToggleAccount,
  onHealthCheck,
  onDisconnect,
  onConnectFake,
  onConnectManual,
}) => {
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnectingFake, setIsConnectingFake] = useState(false);
  const [togglingAccountId, setTogglingAccountId] = useState<string | null>(null);


  const isConnected = !!connection;

  const handleHealthCheck = async () => {
    if (!connection) return;
    setIsHealthChecking(true);
    try {
      await onHealthCheck(connection.id);
    } finally {
      setIsHealthChecking(false);
    }
  };

  const handleDisconnectConfirm = async () => {
    if (!connection) return;
    setIsDisconnecting(true);
    try {
      await onDisconnect(connection.id);
      setIsDisconnectModalOpen(false);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleToggle = async (acc: SocialAccount) => {
    setTogglingAccountId(acc.id);
    try {
      await onToggleAccount(acc.id, !acc.isEnabled);
    } finally {
      setTogglingAccountId(null);
    }
  };

  const handleDemoConnect = async () => {
    setIsConnectingFake(true);
    try {
      await onConnectFake(config.platform, `${config.title} Official`);
    } finally {
      setIsConnectingFake(false);
    }
  };

  // Badge trạng thái token
  const getStatusBadge = () => {
    if (!isConnected) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          Chưa kết nối
        </span>
      );
    }

    if (connection.status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Đang hoạt động
        </span>
      );
    }

    if (connection.status === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Token hết hạn
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Cần kết nối lại
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between">
        {/* Card Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white"
                style={{ backgroundColor: config.brandColor }}
              >
                {config.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 leading-tight">
                  {config.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {config.subtitle}
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {isConnected ? (
            <div className="space-y-4">
              {/* Connection info */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="font-medium text-slate-800">{connection.displayName}</span>
                  {connection.tokenExpiresAt && (
                    <p className="text-slate-400 mt-0.5">
                      Hết hạn: {new Date(connection.tokenExpiresAt).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleHealthCheck}
                  disabled={isHealthChecking}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="Kiểm tra tính hợp lệ của token và kết nối"
                >
                  {isHealthChecking ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  <span>Kiểm tra</span>
                </button>
              </div>

              {/* Sub-accounts / Pages list */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Kênh đăng ({connection.accounts.length})
                </p>
                <div className="space-y-2">
                  {connection.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {acc.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={acc.avatarUrl}
                            alt={acc.displayName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
                            {acc.displayName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {acc.displayName}
                          </p>
                          {acc.username && (
                            <p className="text-2xs text-slate-500 truncate">
                              @{acc.username}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Switch toggle isEnabled */}
                      <div className="flex items-center gap-2 pl-3">
                        <span className="text-2xs font-medium text-slate-500">
                          {acc.isEnabled ? 'Đang bật' : 'Tắt'}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={acc.isEnabled}
                          onClick={() => handleToggle(acc)}
                          disabled={togglingAccountId === acc.id}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                            acc.isEnabled ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              acc.isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Chưa liên kết tài khoản {config.title}. Nhấn nút bên dưới để cấp quyền qua OAuth chính thống.
              </p>
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
            {isConnected ? (
              <div className="w-full flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-center"
                >
                  + Thêm Page khác
                </button>
                <button
                  type="button"
                  onClick={() => setIsDisconnectModalOpen(true)}
                  className="py-2 px-3 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors text-center whitespace-nowrap"
                >
                  Ngắt kết nối
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white rounded-xl transition-all shadow-xs text-center flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: config.brandColor }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Thêm Token / Page</span>
                </button>
                <button
                  type="button"
                  onClick={handleDemoConnect}
                  disabled={isConnectingFake}
                  className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shadow-2xs"
                  title="Kết nối nhanh kênh giả lập phục vụ kiểm thử / Dry-Run"
                >
                  {isConnectingFake ? '...' : 'Demo / Test'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ManualConnectModal
        isOpen={isManualModalOpen}
        config={config}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={async (data) => {
          await onConnectManual(data);
        }}
      />


      <DisconnectDialog
        isOpen={isDisconnectModalOpen}
        platformName={config.title}
        isSubmitting={isDisconnecting}
        onConfirm={handleDisconnectConfirm}
        onCancel={() => setIsDisconnectModalOpen(false)}
      />
    </>
  );
};
