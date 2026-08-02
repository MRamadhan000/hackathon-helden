"use client";

import React, { Suspense } from "react";
import LoginFormRole from "@/components/auth/LoginFormRole";

export default function LoginWargaPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat Login Warga Desa...</div>}>
      <LoginFormRole
        targetRole="WARGA"
        roleLabel="Warga Desa"
        description="Portal Login Mandiri Warga untuk Layanan Pengajuan Online, Perbaikan Data Diri, & Sanggahan Bansos."
        defaultRedirect="/warga/dashboard"
        badgeStyle="bg-emerald-100 text-emerald-800 border-emerald-200"
      />
    </Suspense>
  );
}
