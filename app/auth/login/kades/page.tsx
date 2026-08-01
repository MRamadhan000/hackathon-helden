"use client";

import React, { Suspense } from "react";
import LoginFormRole from "@/components/auth/LoginFormRole";

export default function LoginKadesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat Login Kepala Desa...</div>}>
      <LoginFormRole
        targetRole="KEPALA_DESA"
        roleLabel="Kepala Desa"
        description="Portal Login Khusus Kepala Desa untuk Pengambilan Keputusan Strategis & Persetujuan SK Bansos."
        defaultRedirect="/kades/dashboard"
        badgeStyle="bg-purple-100 text-purple-800 border-purple-200"
      />
    </Suspense>
  );
}
