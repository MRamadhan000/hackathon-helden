"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// HARDCODE CREDENTIALS & ROLE MAPPING
const MOCK_PEGAWAI_ACCOUNTS = [
  {
    email: "kades@desa.go.id",
    password: "123",
    role: "kepdes",
    name: "Bpk. Ahmad (Kepala Desa)",
    route: "/kades/dashboard",
  },
  {
    email: "sekdes@desa.go.id",
    password: "123",
    role: "sekdes",
    name: "Ibu Siti (Sekretaris Desa)",
    route: "/sekdes/dashboard",
  },
  {
    email: "rt01@desa.go.id",
    password: "123",
    role: "ketua_rt",
    name: "Pak RT 01",
    route: "/rt",
  },
];

export default function LoginPegawai() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi berbasis data hardcode
    const account = MOCK_PEGAWAI_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password,
    );

    if (account) {
      // Simpan role ke localStorage agar dashboard tujuan tahu siapa yang masuk (Simulasi Session)
      localStorage.setItem("mock_user_role", account.role);
      localStorage.setItem("mock_user_name", account.name);

      // Hubungkan & alihkan langsung ke folder rute dashboard yang terpisah
      router.push(account.route);
    } else {
      setErrorMsg("Kredensial pegawai salah. Gunakan kades@desa.go.id / 123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-sm w-full space-y-6">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white border border-slate-200 p-8 rounded-2xl shadow-2xs space-y-4"
        >
          <div>
            <h2 className="text-base font-black text-slate-950 tracking-tight uppercase">
              Akses Login Pegawai
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sistem Informasi Perangkat Desa Terintegrasi.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] font-bold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Email Pegawai
              </label>
              <input
                type="email"
                placeholder="contoh: kades@desa.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium text-slate-800"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs hover:bg-slate-800 transition shadow-2xs"
          >
            Masuk ke Sistem Perangkat →
          </button>
        </form>

        {/* Cheat sheet helper untuk mempermudah Anda pindah-pindah selama testing manual */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Petunjuk Akses Cepat (Testing):
          </h4>
          <div className="text-[10px] text-slate-600 space-y-1 font-mono">
            <div>
              • Kades:{" "}
              <span className="text-slate-900 font-bold">kades@desa.go.id</span>{" "}
              (Pass: 123)
            </div>
            <div>
              • Sekdes:{" "}
              <span className="text-slate-900 font-bold">
                sekdes@desa.go.id
              </span>{" "}
              (Pass: 123)
            </div>
            <div>
              • Ketua RT:{" "}
              <span className="text-slate-900 font-bold">rt01@desa.go.id</span>{" "}
              (Pass: 123)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
