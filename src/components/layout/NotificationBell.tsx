"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { NotificationItem } from "@/types/settings";

interface NotificationResponse {
  items: NotificationItem[];
  unreadCount: number;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient<NotificationResponse>("/api/v1/notifications?page=0&size=10");
      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setIsLoading(true);
      await apiClient("/api/v1/notifications/read-all", { method: "POST" });
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo hệ thống"
        className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-[#F1F5F9] flex items-center justify-between">
            <span className="font-semibold text-sm text-[#0F172A]">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isLoading}
                className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                Không có thông báo mới.
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.readAt;
                return (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition-colors ${
                      isUnread ? "bg-[#EFF6FF]/60" : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0F172A] truncate">
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-xs text-[#475569] mt-0.5 line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                        )}
                        <span className="text-[10px] text-[#94A3B8] mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
