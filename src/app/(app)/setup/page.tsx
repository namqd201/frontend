'use client';

import React, { useState, useEffect } from 'react';
import { SettingsTabs } from '@/components/setup/SettingsTabs';
import { PlanList } from '@/components/setup/PlanList';
import { PlanWizard } from '@/components/setup/PlanWizard';
import { ContentPlanItem } from '@/types/plan';
import { SocialAccount } from '@/types/social';
import { api } from '@/lib/api';
import { Calendar, SlidersHorizontal } from 'lucide-react';

import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'settings'>('plans');
  const [plans, setPlans] = useState<ContentPlanItem[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [plansData, accountsData] = await Promise.all([
        api.get<ContentPlanItem[]>('/api/v1/plans'),
        api.get<SocialAccount[]>('/api/v1/social/accounts'),
      ]);
      setPlans(plansData || []);
      setAccounts(accountsData || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu setup:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  // Tự động đồng bộ realtime khi tạo kế hoạch, kích hoạt plan, hoặc theo chu kỳ 5s
  useRealtimeSync(() => loadData(true), { interval: 5000 });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Thiết lập</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý Kế hoạch đăng bài tự động (Plans) và Cài đặt chung hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`pb-2.5 px-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Kế hoạch (Plans)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-2.5 px-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Cài đặt chung</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'plans' ? (
        loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Đang tải danh sách kế hoạch...
          </div>
        ) : (
          <PlanList
            plans={plans}
            onRefresh={loadData}
            onOpenCreate={() => setIsWizardOpen(true)}
          />
        )
      ) : (
        <SettingsTabs />
      )}

      {/* Wizard Modal */}
      <PlanWizard
        accounts={accounts}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
