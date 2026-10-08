"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/schedule");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-[#0F172A]">
      <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
      <span className="mt-3 text-sm text-[#475569]">Đang tải...</span>
    </div>
  );
}
