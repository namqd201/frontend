"use client";

import { useEffect, useRef } from "react";

interface SyncOptions {
  interval?: number; // Chu kỳ polling tự động (ms), mặc định 4000ms (4 giây)
  enabled?: boolean; // Cho phép sync không
  triggerOnFocus?: boolean; // Tự động reload khi người dùng click vào tab trình duyệt
}

/**
 * Hook đồng bộ dữ liệu Realtime cho toàn bộ trang web NQDSMTool:
 * 1. Tự động reload NGAY LẬP TỨC khi có bất kỳ thao tác CRUD nào (app:data-mutated) ở bất kỳ trang/modal/drawer nào.
 * 2. Tự động reload khi người dùng quay lại tab trình duyệt (window focus & visibility visible).
 * 3. Tự động polling định kỳ nhẹ nhàng (4 giây) để bắt kịp các thay đổi từ Background Worker AI sinh bài và Scheduler tự động.
 */
export function useRealtimeSync(
  callback: () => void | Promise<void>,
  options: SyncOptions = {}
) {
  const { interval = 4000, enabled = true, triggerOnFocus = true } = options;
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Bắt sự kiện CRUD mutation toàn cục
    const handleMutation = () => {
      savedCallback.current();
    };
    window.addEventListener("app:data-mutated", handleMutation);

    // 2. Bắt sự kiện focus và hiển thị tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        savedCallback.current();
      }
    };

    if (triggerOnFocus) {
      window.addEventListener("focus", handleMutation);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    // 3. Polling chu kỳ khi tab đang hiển thị
    let timerId: ReturnType<typeof setInterval> | null = null;
    if (interval > 0) {
      timerId = setInterval(() => {
        if (document.visibilityState === "visible") {
          savedCallback.current();
        }
      }, interval);
    }

    return () => {
      window.removeEventListener("app:data-mutated", handleMutation);
      if (triggerOnFocus) {
        window.removeEventListener("focus", handleMutation);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (timerId) clearInterval(timerId);
    };
  }, [interval, enabled, triggerOnFocus]);
}
