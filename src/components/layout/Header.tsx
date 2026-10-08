"use client";

import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "./NotificationBell";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[#64748B]">NQDSMTool Vận hành</span>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-[#E2E8F0]">
            {user.pictureUrl ? (
              <Image
                src={user.pictureUrl}
                alt={user.name || "User"}
                width={28}
                height={28}
                className="rounded-full ring-1 ring-[#E2E8F0]"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#E2E8F0] text-[#475569] font-medium text-xs flex items-center justify-center">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
            <span className="text-xs font-medium text-[#0F172A] hidden sm:inline">
              {user.name}
            </span>
            <button
              onClick={() => logout()}
              aria-label="Đăng xuất"
              title="Đăng xuất"
              className="p-1.5 rounded-md text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
