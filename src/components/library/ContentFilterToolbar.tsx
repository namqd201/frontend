"use client";

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (val: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export function ContentFilterToolbar({
  searchQuery,
  setSearchQuery,
  selectedPlatform,
  setSelectedPlatform,
  selectedAuthor,
  setSelectedAuthor,
  sortBy,
  setSortBy,
}: FilterToolbarProps) {
  return (
    <div className="px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#f8f9ff]">
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[#737686] text-[18px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#ffffff] text-[#0b1c30] text-[12px] placeholder:text-[#737686] shadow-xs border border-[#c3c6d7]/30 focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
            placeholder="Tìm theo ID, tiêu đề, hashtag hoặc nội dung bài viết..."
            type="text"
          />
        </div>

        <div className="relative">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#ffffff] text-[#0b1c30] text-[13px] shadow-xs border border-[#c3c6d7]/30 appearance-none pr-8 cursor-pointer focus:outline-none"
          >
            <option value="all">Tất cả MXH</option>
            <option value="fb">Facebook</option>
            <option value="x">X / Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="threads">Threads</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-2.5 text-[#737686] text-[16px] pointer-events-none">
            arrow_drop_down
          </span>
        </div>

        <div className="relative hidden sm:block">
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#ffffff] text-[#0b1c30] text-[13px] shadow-xs border border-[#c3c6d7]/30 appearance-none pr-8 cursor-pointer focus:outline-none"
          >
            <option value="all">Tất cả tác giả</option>
            <option value="creator_1">Hoàng Nam</option>
            <option value="creator_2">Mai Anh</option>
            <option value="ai">NQ AI Autonomous</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-2.5 text-[#737686] text-[16px] pointer-events-none">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* Sort & View Controls */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-[11px] font-semibold text-[#737686] uppercase hidden lg:inline">
          Sắp xếp:
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#ffffff] text-[#0b1c30] text-[13px] shadow-xs border border-[#c3c6d7]/30 appearance-none pr-8 cursor-pointer focus:outline-none"
          >
            <option value="newest">Mới nhất (Tạo gần đây)</option>
            <option value="scheduled_soon">Giờ hẹn gần nhất (UTC+7)</option>
            <option value="status">Trạng thái phê duyệt</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-2.5 text-[#737686] text-[16px] pointer-events-none">
            swap_vert
          </span>
        </div>

        <div className="flex items-center p-0.5 bg-[#eff4ff] rounded-lg shadow-xs border border-[#c3c6d7]/20">
          <button
            className="p-1.5 rounded bg-[#ffffff] text-[#004ac6] shadow-xs"
            title="Chế độ bảng"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">table_rows</span>
          </button>
          <button
            className="p-1.5 rounded text-[#737686] hover:text-[#0b1c30]"
            title="Chế độ thẻ"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
        </div>
      </div>
    </div>
  );
}
