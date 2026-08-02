"use client";

import React, { Suspense } from "react";
import LoginFormRole from "@/components/auth/LoginFormRole";

export default function LoginRtPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat Login Ketua RT...</div>}>
      <LoginFormRole
        targetRole="KETUA_RT"
        roleLabel="Ketua RT"
        description="Portal Login Khusus Ketua RT untuk Pendataan Warga, Input Mutasi Offline, & Survei Prodeskel DDK."
        defaultRedirect="/rt"
        badgeStyle="bg-blue-100 text-blue-800 border-blue-200"
      />
    </Suspense>
  );
}
