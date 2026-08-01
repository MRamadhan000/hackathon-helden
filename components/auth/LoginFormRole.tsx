"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { usePenduduk } from "@/hooks/cores/usePenduduk";
import { UserRole } from "@/types/auth";

interface LoginFormRoleProps {
  targetRole: UserRole | "ANY";
  roleLabel: string;
  description: string;
  defaultRedirect: string;
  badgeStyle: string;
}

export default function LoginFormRole({
  targetRole,
  roleLabel,
  description,
  defaultRedirect,
  badgeStyle,
}: LoginFormRoleProps) {
  const router = useRouter();
  const { user, login, logout, isLoading: isAuthLoading } = useAuth();
  const { roles: realRolesList, isLoading: isRolesLoading } = useUserRoles();
  const { data: realPendudukList } = usePenduduk();

  const [inputNik, setInputNik] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah Hydration Mismatch dengan memastikan komponen sudah ter-mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ambil Sampel NIK dari Supabase yang Sesuai dengan Role Ini
  const sampleAccounts = useMemo(() => {
    if (!realPendudukList || realPendudukList.length === 0) return [];

    const roleMap = new Map<string, UserRole>();
    (realRolesList || []).forEach((r) => {
      roleMap.set(r.pendudukId, r.role);
    });

    const mapped = realPendudukList.map((p) => ({
      nik: p.nik,
      nama: p.nama,
      role: roleMap.get(p.id) || ("WARGA" as UserRole),
    }));

    if (targetRole === "ANY") return mapped.slice(0, 8);
    return mapped.filter((a) => a.role === targetRole).slice(0, 8);
  }, [realPendudukList, realRolesList, targetRole]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanNik = inputNik.trim();
    if (!cleanNik) {
      setErrorMsg("Silakan masukkan NIK 16-digit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await login(cleanNik);

      if (targetRole !== "ANY" && profile.role !== targetRole) {
        logout();
        throw new Error(
          `AKSES DITOLAK: NIK (${cleanNik}) terdaftar sebagai peran '${profile.role}'. Halaman ini khusus untuk '${roleLabel}'.`
        );
      }

      setSuccessMsg(
        `Berhasil Login! Selamat Datang, ${profile.nama} (${profile.role}). Mengalihkan...`
      );

      let targetRoute = defaultRedirect;
      if (profile.role === "KEPALA_DESA") targetRoute = "/kades/dashboard";
      else if (profile.role === "SEKRETARIS") targetRoute = "/sekdes/dashboard";
      else if (profile.role === "KETUA_RT") targetRoute = "/rt";
      else if (profile.role === "WARGA") targetRoute = "/warga/dashboard";

      setTimeout(() => {
        router.push(targetRoute);
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal login. Pastikan NIK Anda terdaftar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a safe loading skeleton during SSR / prior to client mount to avoid layout shifts & mismatches
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative antialiased">
        <div className="max-w-md w-full space-y-6 pt-12 animate-pulse">
          <div className="h-20 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative antialiased">
      {/* HEADER NAVIGASI */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition shadow-2xs"
        >
          <span>←</span>
          <span>Kembali ke Halaman Utama</span>
        </Link>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-2xs"
        >
          <span>⚙️ Panel Admin Role</span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-6 pt-12">
        {/* HEADING ROLE PORTAL */}
        <div className="text-center space-y-2">
          <span className={`px-3 py-1 font-extrabold text-[10px] rounded-full uppercase tracking-wider border ${badgeStyle}`}>
            {roleLabel}
          </span>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Login By NIK
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* JIKA SUDAH LOGGED IN */}
        {user ? (
          <div className="bg-white border border-emerald-200 p-6 rounded-2xl shadow-sm text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-black text-lg">
              ✓
            </div>
            <div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] rounded-lg border border-emerald-200 uppercase">
                {user.role}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-2">{user.nama}</h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">NIK: {user.nik}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (user.role === "KEPALA_DESA") router.push("/kades/dashboard");
                  else if (user.role === "SEKRETARIS") router.push("/sekdes/dashboard");
                  else if (user.role === "KETUA_RT") router.push("/rt");
                  else router.push("/warga/dashboard");
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Masuk ke Dashboard ({user.role}) →
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Keluar / Ganti NIK
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* FORM LOGIN BY NIK */}
            <form
              onSubmit={handleLoginSubmit}
              className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5"
            >
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Verifikasi NIK & Cek Role Database
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Masukkan NIK untuk mengecek role di `tweb_user_role`.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold leading-relaxed animate-in fade-in duration-150">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold leading-relaxed animate-in fade-in duration-150">
                  ✓ {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Masukkan 16-digit NIK..."
                    value={inputNik}
                    onChange={(e) => setInputNik(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900"
                    required
                  />
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isAuthLoading}
                className="w-full bg-slate-950 hover:bg-slate-800 active:bg-slate-900 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Mengecek Database Role...</span>
                ) : (
                  <>
                    <span>Masuk ke {roleLabel}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* SAMPLING NIK FETCHED FROM SUPABASE */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡ NIK Sampel {roleLabel} (Supabase Live):</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Klik NIK untuk Tes</span>
              </div>

              {isRolesLoading ? (
                <div className="text-[11px] text-slate-400 text-center py-2">
                  Memuat data NIK sampel dari Supabase...
                </div>
              ) : sampleAccounts.length > 0 ? (
                <div className="space-y-2">
                  {sampleAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputNik(acc.nik)}
                      className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                          {acc.nama}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                          NIK: <strong className="text-slate-800">{acc.nik}</strong>
                        </p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  Belum ada penugasan NIK untuk {roleLabel} di `tweb_user_role`. Tetapkan via{" "}
                  <Link href="/admin" className="text-blue-600 underline font-bold">
                    Panel Admin Role
                  </Link>
                  .
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}