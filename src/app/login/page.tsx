"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Lock } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-md text-left">
        {/* Header & Logo */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span className="font-semibold text-lg text-[#0F172A] tracking-tight">
            NQDSMTool
          </span>
        </div>

        <h1 className="text-xl font-semibold text-[#0F172A] mt-4">
          Đăng nhập hệ thống
        </h1>
        <p className="text-sm text-[#475569] mt-1 leading-relaxed">
          Tự động viết, tạo ảnh và đăng bài theo kế hoạch của bạn.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={loginWithGoogle}
            className="w-full h-11 px-4 flex items-center justify-center gap-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-medium transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          <button
            onClick={loginWithFacebook}
            className="w-full h-11 px-4 flex items-center justify-center gap-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-medium transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Tiếp tục với Facebook</span>
          </button>
        </div>

        {/* Error Feedback */}
        {error === "not_allowed" && (
          <div className="mt-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#DC2626]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Tài khoản này không nằm trong danh sách cho phép (Allowlist).</span>
          </div>
        )}

        {error === "expired" && (
          <div className="mt-4 p-3 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] flex items-start gap-2.5 text-xs text-[#D97706]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.</span>
          </div>
        )}

        {error === "auth_failed" && (
          <div className="mt-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#DC2626]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Xác thực không thành công. Vui lòng thử lại.</span>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
          <Lock className="h-3.5 w-3.5" />
          <span>Chỉ tài khoản trong allowlist mới truy cập được.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
