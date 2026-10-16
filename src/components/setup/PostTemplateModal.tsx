'use client';

import React, { useState, useEffect } from 'react';
import { PostTemplateItem, PostTemplateRequest } from '@/types/template';
import { X, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface PostTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template?: PostTemplateItem | null;
}

export function PostTemplateModal({
  isOpen,
  onClose,
  onSuccess,
  template,
}: PostTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [structure, setStructure] = useState('');
  const [exampleContent, setExampleContent] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setDescription(template.description || '');
      setStructure(template.structure || '');
      setExampleContent(template.exampleContent || '');
      setIsDefault(template.isDefault || false);
    } else {
      setName('');
      setDescription('');
      setStructure('');
      setExampleContent('');
      setIsDefault(false);
    }
    setError(null);
  }, [template, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên form mẫu');
      return;
    }
    if (!structure.trim()) {
      setError('Vui lòng nhập cấu trúc chi tiết của form mẫu');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: PostTemplateRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      structure: structure.trim(),
      exampleContent: exampleContent.trim() || undefined,
      isDefault,
    };

    try {
      if (template?.id) {
        await api.put(`/api/v1/templates/${template.id}`, payload);
      } else {
        await api.post('/api/v1/templates', payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Không thể lưu form mẫu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {template ? (template.isSystem ? 'Xem / Nhân bản Form mẫu' : 'Chỉnh sửa Form mẫu') : 'Tạo Form mẫu bài viết mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Form mẫu quy định cấu trúc dàn ý bài viết để AI tuân thủ 100%
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tên Form mẫu bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: AIDA Bán Hàng, PAS Chia Sẻ Vấn Đề, Storytelling Kể Chuyện..."
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-2 focus:outline-blue-600 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả ngắn (Khi nào nên dùng)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Phù hợp bài ra mắt sản phẩm mới, chạy khuyến mãi, giới thiệu tính năng website..."
              className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-2 focus:outline-blue-600 bg-slate-50 leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cấu trúc chi tiết (AI bắt buộc tuân theo) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-blue-600 flex items-center gap-1 font-medium">
                <HelpCircle className="h-3 w-3" />
                Các phần của bài viết
              </span>
            </div>
            <textarea
              rows={5}
              required
              value={structure}
              onChange={(e) => setStructure(e.target.value)}
              placeholder={`Phần 1: Hook thu hút trong 2 dòng đầu gây tò mò\nPhần 2: Nêu nỗi đau hoặc thực trạng người đọc đang gặp phải\nPhần 3: Đưa ra giải pháp cốt lõi với 3 luận điểm gạch đầu dòng\nPhần 4: Bằng chứng / Kết quả cụ thể\nPhần 5: Kêu gọi hành động (CTA) để lại bình luận`}
              className="w-full p-3 text-xs font-mono rounded-lg border border-slate-200 focus:outline-2 focus:outline-blue-600 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nội dung ví dụ minh họa (Tùy chọn)
            </label>
            <textarea
              rows={3}
              value={exampleContent}
              onChange={(e) => setExampleContent(e.target.value)}
              placeholder="Dán một bài viết mẫu minh họa rõ ràng cấu trúc trên để AI học hỏi..."
              className="w-full p-3 text-xs font-mono rounded-lg border border-slate-200 focus:outline-2 focus:outline-blue-600 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultTemplate"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isDefaultTemplate" className="text-xs text-slate-700 font-medium cursor-pointer">
              Đặt làm form mẫu mặc định khi tạo kế hoạch và sinh bài tự động
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{template?.id ? 'Lưu thay đổi' : 'Tạo Form mẫu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
