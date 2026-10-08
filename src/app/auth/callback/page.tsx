"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { refreshUser } = useAuth();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function handleAuth() {
      try {
        await refreshUser();
      } catch (err) {
        console.error("Failed to refresh user:", err);
      } finally {
        // Chuyển hướng về trang chủ
        window.location.replace("/");
      }
    }

    handleAuth();
  }, [refreshUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-slate-100">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <h2 className="text-xl font-semibold">Đăng nhập thành công!</h2>
        <p className="text-sm text-slate-400">Đang đồng bộ hồ sơ và chuyển hướng...</p>
      </div>
    </div>
  );
}
