'use client';

import React, { useState, useEffect } from 'react';
import { PostTemplateItem } from '@/types/template';
import { api } from '@/lib/api';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Edit2,
  Trash2,
  BookOpen,
  Copy,
  Check,
  Star,
  Layers,
} from 'lucide-react';
import { PostTemplateModal } from './PostTemplateModal';

export function PostTemplateList() {
  const [templates, setTemplates] = useState<PostTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplateItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await api.get<PostTemplateItem[]>('/api/v1/templates');
      setTemplates(res || []);
    } catch (err: unknown) {
      console.error('Failed to fetch templates:', err);
      setActionError((err as Error).message || 'Không thể tải danh sách form mẫu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await api.post(`/api/v1/templates/${id}/set-default`);
      await fetchTemplates();
    } catch (err: unknown) {
      alert((err as Error).message || 'Không thể đặt làm mặc định');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa form mẫu "${name}" không?`)) return;
    try {
      await api.delete(`/api/v1/templates/${id}`);
      await fetchTemplates();
    } catch (err: unknown) {
      alert((err as Error).message || 'Không thể xóa form mẫu');
    }
  };

  const handleCopyStructure = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Quản lý Form mẫu bài viết (Post Templates)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Định nghĩa các khung sườn, công thức copywriting (AIDA, PAS, Storytelling...) để AI tuân theo cấu trúc này khi viết bài mới hoặc tinh chỉnh bài viết hiện có.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedTemplate(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm Form mẫu mới</span>
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          Đang tải danh sách form mẫu bài viết...
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Chưa có form mẫu nào</h3>
          <p className="text-xs text-slate-500 mt-1">
            Bấm "Thêm Form mẫu mới" để tạo dàn ý chuẩn theo phong cách của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                tpl.isDefault
                  ? 'border-blue-400 ring-1 ring-blue-400 bg-blue-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Badges & Actions */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{tpl.name}</span>
                    {tpl.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Mặc định
                      </span>
                    )}
                    {tpl.isSystem ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Hệ thống
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Của bạn
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Sao chép cấu trúc"
                      onClick={() => handleCopyStructure(tpl.id, tpl.structure)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      {copiedId === tpl.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      title={tpl.isSystem ? "Xem / Nhân bản" : "Chỉnh sửa"}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {!tpl.isSystem && (
                      <button
                        type="button"
                        title="Xóa form mẫu"
                        onClick={() => handleDelete(tpl.id, tpl.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {tpl.description && (
                  <p className="text-xs text-slate-500 mb-3">{tpl.description}</p>
                )}

                {/* Structure preview box */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 mb-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    Cấu trúc dàn ý AI sẽ tuân theo:
                  </div>
                  <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {tpl.structure}
                  </pre>
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {tpl.isSystem ? 'Form mẫu chuẩn ngành' : 'Được tùy biến riêng'}
                </span>
                {!tpl.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(tpl.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Đặt làm mặc định
                  </button>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Đang kích hoạt mặc định
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal create / edit */}
      <PostTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTemplates}
        template={selectedTemplate}
      />
    </div>
  );
}
