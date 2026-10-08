"use client";

interface ContentEditorModuleProps {
  content: string;
  setContent: (val: string) => void;
  brandVoiceReport: string;
}

export function ContentEditorModule({
  content,
  setContent,
  brandVoiceReport,
}: ContentEditorModuleProps) {
  return (
    <div className="rounded-xl bg-[#ffffff] p-4 lg:p-6 shadow-xs flex flex-col gap-4 border border-[#c3c6d7]/30">
      {/* Editor Header & Guardrail status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
            edit_document
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#0b1c30] font-semibold">
            Nội dung gốc (Base Content)
          </span>
        </div>

        {/* Brand Safety Filter Chip */}
        <div className="flex items-center gap-1 bg-[#6ffbbe] text-[#002113] px-2.5 py-1 rounded-full text-[11px] font-semibold">
          <span className="material-symbols-outlined text-[16px] text-[#006242]">verified</span>
          <span>{brandVoiceReport}</span>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-[#eff4ff] p-1.5 rounded-xl border border-[#c3c6d7]/20">
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors"
          title="Đậm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">format_bold</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors"
          title="Nghiêng"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">format_italic</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors"
          title="Chèn Link"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">link</span>
        </button>
        <div className="w-px h-5 bg-[#c3c6d7]/40 mx-1" />
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors"
          title="Emoji"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">mood</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors flex items-center gap-0.5 text-xs font-semibold px-2"
          title="Gợi ý Hashtag"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">tag</span>
          <span>AI Tags</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-[#dce9ff] text-[#434655] hover:text-[#0b1c30] transition-colors"
          title="Đính kèm Media"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">attach_file</span>
        </button>
        <div className="ml-auto flex items-center gap-1 font-['JetBrains_Mono'] text-[12px] text-[#737686] px-2">
          <span>{content.length}</span> ký tự
        </div>
      </div>

      {/* Editor Body */}
      <textarea
        className="w-full bg-[#eff4ff] rounded-xl p-4 text-[14px] text-[#0b1c30] focus:outline-none focus:bg-[#ffffff] transition-all leading-relaxed border border-[#c3c6d7]/20"
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Media Attachment Box */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[#737686] uppercase">
          Tệp đính kèm (Cloudflare R2 CDN)
        </span>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] border border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-[#d3e4fe] overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrVv9gwjmcOh6N7Vfh05b3NKl00sWDpy_8li-FbfeksKWozhMzA-mkVrcNLdPElStaa8v0lN_6sHmDjbpi2gqdoq_nthwhwU2sOy7_EwcUmp1zDtkHwr8bn2qYEPO8p5wpxu8gw8BoTi_3kG4yRzpec76fdC8d34Xj-0WFk_vG7DDQqmskbCfKb77pJNkRGSoc0KAQHZFbPant8A7X37AcSwAJaU-XSoXbeoNvGPgC"
                alt="nqdsmtool-v2-automation-banner"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#0b1c30] font-semibold truncate max-w-xs">
                nqdsmtool-v2-automation-banner.png
              </span>
              <span className="font-['JetBrains_Mono'] text-[12px] text-[#737686]">
                1200 x 630 px · 1.2 MB · S3/R2 Synced
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg hover:bg-[#dce9ff] text-[#434655] transition-colors"
              title="Xem trước"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors"
              title="Xóa tệp"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
