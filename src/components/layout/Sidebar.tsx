"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, FileText, Share2, Settings, Cpu } from "lucide-react";

const NAV_ITEMS = [
  { href: "/schedule", label: "Lịch đăng", icon: Calendar },
  { href: "/posts", label: "Bài đăng", icon: FileText },
  { href: "/pipeline", label: "Tiến trình AI", icon: Cpu },
  { href: "/channels", label: "Kênh", icon: Share2 },
  { href: "/setup", label: "Thiết lập", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 min-h-screen fixed left-0 top-0 bottom-0 z-30">
      {/* Brand Logo */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-[#F1F5F9]">
        <div className="h-7 w-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
          N
        </div>
        <div>
          <span className="font-semibold text-sm text-[#0F172A] tracking-tight block">
            NQDSMTool
          </span>
          <span className="text-[10px] text-[#64748B] block font-mono">
            v2.0.0 · Ops
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
        Công cụ cá nhân tự động
      </div>
    </aside>
  );
}
