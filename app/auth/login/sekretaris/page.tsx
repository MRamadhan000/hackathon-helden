"use client";

import React, { Suspense } from "react";
import LoginFormRole from "@/components/auth/LoginFormRole";

export default function LoginSekretarisPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat Login Sekretaris Desa...</div>}>
      <LoginFormRole
        targetRole="SEKRETARIS"
        roleLabel="Sekretaris Desa"
        description="Portal Login Khusus Sekretaris Desa untuk Verifikasi Mutasi, Peninjauan Sanggahan, & Audit Kependudukan."
        defaultRedirect="/sekdes/dashboard"
        badgeStyle="bg-indigo-100 text-indigo-800 border-indigo-200"
      />
    </Suspense>
  );
}
