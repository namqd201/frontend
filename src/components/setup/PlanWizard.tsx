'use client';

import React, { useState, useEffect } from 'react';
import { CalculatedSlot, CreatePlanPayload, PlanPreviewData } from '@/types/plan';
import { SocialAccount } from '@/types/social';
import { api } from '@/lib/api';

interface PlanWizardProps {
  accounts: SocialAccount[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_HOURS = ['09:00', '14:00', '19:00'];

const IMAGE_STYLES = [
  { id: 'cinematic', label: 'Điện ảnh (Cinematic)', desc: 'Ánh sáng nghệ thuật, chiều sâu rõ ràng' },
  { id: 'minimalist', label: 'Tối giản (Minimalist)', desc: 'Màu sắc tinh gọn, hiện đại, thoáng đãng' },
  { id: 'photorealistic', label: 'Ảnh thực tế (Realistic)', desc: 'Chân thực như chụp máy ảnh thật' },
  { id: 'digital_art', label: 'Digital Art', desc: 'Minh họa đồ họa sống động, sáng tạo' },
];

export const PlanWizard: React.FC<PlanWizardProps> = ({
  accounts,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PlanPreviewData | null>(null);

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tone, setTone] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [postsPerDay, setPostsPerDay] = useState(2);
  const [timeSlots, setTimeSlots] = useState<string[]>(['09:00', '19:00']);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [includeImage, setIncludeImage] = useState(true);
  const [imageStyle, setImageStyle] = useState('minimalist');

  // Auto select active channels
  useEffect(() => {
    if (accounts.length > 0 && selectedAccountIds.length === 0) {
      const activeIds = accounts.filter((a) => a.isEnabled).map((a) => a.id);
      setSelectedAccountIds(activeIds);
    }
  }, [accounts, selectedAccountIds.length]);

  // Adjust time slots when postsPerDay changes
  const handlePostsPerDayChange = (count: number) => {
    setPostsPerDay(count);
    if (count === 1) {
      setTimeSlots(['09:00']);
    } else if (count === 2) {
      setTimeSlots(['09:00', '19:00']);
    } else if (count === 3) {
      setTimeSlots(['09:00', '14:00', '20:00']);
    } else if (count === 4) {
      setTimeSlots(['08:00', '12:00', '16:00', '20:00']);
    } else if (count === 5) {
      setTimeSlots(['08:00', '11:30', '14:30', '18:00', '21:00']);
    }
  };

  const handleTimeSlotChange = (index: number, newTime: string) => {
    if (!newTime) return;
    const updated = [...timeSlots];
    updated[index] = newTime;
    setTimeSlots(updated);
  };

  const handleAddTimeSlot = (defaultTime = '12:00') => {
    if (timeSlots.length >= 8) {
      alert('Tối đa 8 khung giờ đăng mỗi ngày');
      return;
    }
    const updated = [...timeSlots, defaultTime].sort();
    setTimeSlots(updated);
    setPostsPerDay(updated.length);
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (timeSlots.length <= 1) {
      alert('Cần ít nhất 1 khung giờ đăng bài mỗi ngày');
      return;
    }
    const updated = timeSlots.filter((_, idx) => idx !== index);
    setTimeSlots(updated);
    setPostsPerDay(updated.length);
  };

  // Fetch Preview when reaching Step 5
  useEffect(() => {
    if (step === 5) {
      fetchPreview();
    }
  }, [step]);

  const [previewError, setPreviewError] = useState<string | null>(null);

  const fetchPreview = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const payload: CreatePlanPayload = {
        name: name || 'Kế hoạch chưa đặt tên',
        topic: topic || 'Chủ đề mặc định',
        instructions,
        tone: tone || undefined,
        startDate,
        endDate,
        timezone: 'Asia/Ho_Chi_Minh',
        postsPerDay,
        timeSlots,
        targetAccountIds: selectedAccountIds.length > 0 ? selectedAccountIds : (accounts.length > 0 ? [accounts[0].id] : []),
        includeImage,
        imageStyle,
      };
      const res = await api.post<PlanPreviewData>('/api/v1/plans/preview', payload);
      if (res && res.slots) {
        setPreviewData(res);
      } else {
        throw new Error('Dữ liệu xem trước rỗng');
      }
    } catch (err) {
      console.warn('Lỗi tính toán xem trước từ server, tự động tính toán cục bộ:', err);
      // Fallback tính toán cục bộ hiển thị ngay lập tức không để trống UI
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
      const channelCount = Math.max(1, selectedAccountIds.length);
      const totalPosts = totalDays * postsPerDay * channelCount;
      const costPerPost = includeImage ? 0.025 : 0.005;

      const generatedSlots: CalculatedSlot[] = [];
      const cur = new Date(start);
      for (let d = 0; d < Math.min(totalDays, 5); d++) {
        const dStr = cur.toISOString().split('T')[0];
        timeSlots.forEach((slot, sIdx) => {
          generatedSlots.push({
            slotKey: `${dStr}#${sIdx + 1}`,
            localDate: dStr,
            localTime: slot,
            scheduledAt: `${dStr}T${slot}:00`,
            generateAt: `${dStr}T${slot}:00`,
          });
        });
        cur.setDate(cur.getDate() + 1);
      }

      setPreviewData({
        totalDays,
        postsPerDay,
        totalSlotsPerChannel: totalDays * postsPerDay,
        totalPosts,
        estimatedCostUsd: totalPosts * costPerPost,
        slots: generatedSlots,
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreate = async (activateImmediately: boolean) => {
    setSubmitting(true);
    try {
      const payload: CreatePlanPayload = {
        name,
        topic,
        instructions,
        tone: tone || undefined,
        startDate,
        endDate,
        timezone: 'Asia/Ho_Chi_Minh',
        postsPerDay,
        timeSlots,
        targetAccountIds: selectedAccountIds,
        includeImage,
        imageStyle,
      };

      // 1. Tạo bản nháp
      const draftRes = await api.post<{ id: string }>('/api/v1/plans/draft', payload);


      // 2. Kích hoạt ngay nếu chọn
      if (activateImmediately) {
        await api.post(`/api/v1/plans/${draftRes.id}/activate`, {});
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi tạo kế hoạch:', err);
      alert('Có lỗi xảy ra khi lưu kế hoạch. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Wizard Header & Stepper */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Thiết lập Kế hoạch đăng bài tự động
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bước {step}/6: {
                  step === 1 ? 'Chủ đề & Trọng tâm' :
                  step === 2 ? 'Lịch đăng & Tần suất' :
                  step === 3 ? 'Kênh đăng bài' :
                  step === 4 ? 'Hình ảnh & Phong cách AI' :
                  step === 5 ? 'Xem trước Lịch & Chi phí' : 'Xác nhận & Kích hoạt'
                }
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* BƯỚC 1: Chủ đề & Trọng tâm */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tên kế hoạch *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Chiến dịch mùa hè, Giới thiệu sản phẩm mới..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chủ đề & Mô tả nội dung *
                </label>
                <textarea
                  rows={4}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Mô tả bằng ngôn ngữ tự nhiên: Ví dụ: Tuần này chia sẻ mẹo làm việc hiệu quả, câu chuyện khởi nghiệp, kinh nghiệm tiếp thị số cho người mới..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hướng dẫn bổ sung / Trọng tâm (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ví dụ: Nhấn mạnh lời kêu gọi đăng ký dùng thử, kèm hashtag #Startup #Tech"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* BƯỚC 2: Thời gian & Lịch đăng */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Tần suất đăng nhanh: <strong className="text-blue-600 text-sm">{postsPerDay} bài/ngày</strong>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handlePostsPerDayChange(n)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        postsPerDay === n
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {n} bài/ngày
                    </button>
                  ))}
                </div>
              </div>

              {/* TÙY CHỈNH KHUNG GIỜ CHI TIẾT */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Khung giờ đăng ({timeSlots.length} khung giờ)
                    </label>
                    <span className="text-2xs text-slate-500">
                      Tự do chỉnh sửa giờ, phút hoặc thêm bớt khung giờ theo ý muốn
                    </span>
                  </div>
                  {timeSlots.length < 8 && (
                    <button
                      type="button"
                      onClick={() => handleAddTimeSlot('12:00')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                    >
                      + Thêm khung giờ
                    </button>
                  )}
                </div>

                {/* Danh sách các slot giờ với input time */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-400 shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="time"
                          value={slot}
                          onChange={(e) => handleTimeSlotChange(idx, e.target.value)}
                          className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none w-full cursor-pointer"
                        />
                      </div>
                      {timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(idx)}
                          className="w-5 h-5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-xs transition-colors shrink-0"
                          title="Xóa khung giờ này"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gợi ý khung giờ vàng tương tác cao */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Gợi ý khung giờ vàng tương tác cao (Facebook):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Sáng', time: '08:30' },
                      { label: 'Trưa', time: '11:45' },
                      { label: 'Đầu giờ chiều', time: '14:00' },
                      { label: 'Tan tầm', time: '17:30' },
                      { label: 'Tối', time: '20:00' },
                      { label: 'Đêm', time: '21:30' },
                    ].map((gold) => {
                      const isAlready = timeSlots.includes(gold.time);
                      return (
                        <button
                          key={gold.time}
                          type="button"
                          onClick={() => {
                            if (!isAlready) handleAddTimeSlot(gold.time);
                          }}
                          disabled={isAlready}
                          className={`text-2xs px-2.5 py-1 rounded-lg border transition-all ${
                            isAlready
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                          }`}
                        >
                          {isAlready ? '✓ ' : '+ '}
                          {gold.time} ({gold.label})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-2xs text-slate-500">
                  Múi giờ áp dụng: <strong>Asia/Ho_Chi_Minh (GMT+7)</strong>
                </p>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Kênh đăng bài */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Chọn các kênh mạng xã hội sẽ tự động phát hành bài viết theo kế hoạch này:
              </p>

              {accounts.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-500 mb-3">
                    Bạn chưa có kênh mạng xã hội nào được kích hoạt.
                  </p>
                  <a
                    href="/channels"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Đến trang Kênh để kết nối
                  </a>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccountIds.includes(acc.id);
                    return (
                      <label
                        key={acc.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAccountIds([...selectedAccountIds, acc.id]);
                              } else {
                                setSelectedAccountIds(selectedAccountIds.filter((id) => id !== acc.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">
                              {acc.displayName}
                            </p>
                            <p className="text-2xs text-slate-500">
                              {acc.platform} • {acc.accountType}
                            </p>
                          </div>
                        </div>

                        <span className="text-2xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                          {acc.isEnabled ? 'Sẵn sàng' : 'Chưa bật'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 4: Hình ảnh & Phong cách AI */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Tự động tạo ảnh minh họa bằng AI
                  </h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Hệ thống sẽ dùng Gemini Image / OpenAI để sinh ảnh độc quyền khớp với từng bài viết.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeImage}
                  onClick={() => setIncludeImage(!includeImage)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    includeImage ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      includeImage ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {includeImage && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Phong cách hình ảnh
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {IMAGE_STYLES.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setImageStyle(st.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          imageStyle === st.id
                            ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-600'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="text-xs font-semibold text-slate-900">{st.label}</p>
                        <p className="text-2xs text-slate-500 mt-0.5">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 5: Xem trước Lịch & Chi phí */}
          {step === 5 && (
            <div className="space-y-4">
              {previewLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
                  Đang tính toán các khung giờ đăng và ước tính chi phí AI...
                </div>
              ) : previewData ? (
                <div className="space-y-4">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-2xs text-slate-500 font-medium uppercase">Tổng thời gian</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">{previewData.totalDays} ngày</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-2xs text-slate-500 font-medium uppercase">Tổng số bài</span>
                      <p className="text-base font-bold text-blue-600 mt-0.5">{previewData.totalPosts} bài</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-2xs text-slate-500 font-medium uppercase">Ước tính AI</span>
                      <p className="text-base font-bold text-emerald-600 mt-0.5">~${previewData.estimatedCostUsd.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Slot Preview List */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Xem trước các khung giờ đầu tiên ({Math.min(previewData.slots.length, 6)} slot)
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {previewData.slots.slice(0, 6).map((sl) => (
                        <div
                          key={sl.slotKey}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{sl.localDate}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-mono text-blue-600">{sl.localTime}</span>
                          </div>
                          <span className="text-2xs text-slate-400">Sinh nội dung: trước 12h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* BƯỚC 6: Xác nhận & Kích hoạt */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tên kế hoạch:</span>
                  <span className="font-semibold text-slate-900">{name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Chủ đề:</span>
                  <span className="font-medium text-slate-800 truncate max-w-xs">{topic}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Thời gian:</span>
                  <span className="font-medium text-slate-800">{startDate} đến {endDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tần suất:</span>
                  <span className="font-medium text-slate-800">{postsPerDay} bài/ngày</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Số kênh phát hành:</span>
                  <span className="font-medium text-blue-600">{selectedAccountIds.length} kênh</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tạo ảnh AI:</span>
                  <span className="font-medium text-slate-800">{includeImage ? 'Có' : 'Không'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có thể <strong>Lưu bản nháp</strong> để chỉnh sửa thêm, hoặc <strong>Kích hoạt ngay</strong> để hệ thống tự động sinh nội dung và đăng bài theo lịch.
              </p>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Quay lại
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!name.trim() || !topic.trim())) {
                    alert('Vui lòng nhập Tên kế hoạch và Chủ đề');
                    return;
                  }
                  if (step === 3 && selectedAccountIds.length === 0) {
                    alert('Vui lòng chọn ít nhất một kênh đăng bài');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-xs"
              >
                Tiếp tục
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleCreate(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Lưu bản nháp
                </button>
                <button
                  type="button"
                  onClick={() => handleCreate(true)}
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  {submitting ? 'Đang kích hoạt...' : 'Kích hoạt ngay'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
