# 🏡 Hackathon Helden — Sistem Informasi Desa Digital

> Aplikasi web pengelolaan administrasi desa berbasis digital: mencakup mutasi kependudukan, survei kelayakan bansos, manajemen program bantuan sosial, serta transparansi anggaran desa.

---

## 📑 Daftar Isi

1. [Gambaran Umum](#-gambaran-umum)
2. [Role & Penjelasannya](#-role--penjelasannya)
3. [Cara Setup (Getting Started)](#-cara-setup)
4. [Model Data](#-model-data)
5. [Arsitektur Sistem](#-arsitektur-sistem)
6. [Struktur Direktori](#-struktur-direktori)
7. [Tech Stack](#-tech-stack)

---

## 🌐 Gambaran Umum

**Helden** adalah sistem informasi desa yang dirancang untuk mendigitalisasi proses administrasi kependudukan dan penyaluran bantuan sosial. Sistem ini menghubungkan empat lapisan pengguna — dari warga, ketua RT, sekretaris desa, hingga kepala desa — dalam satu platform terpadu yang mendukung mode **online** maupun **offline**.

**Fitur Utama:**
- 📋 Mutasi Kependudukan (Warga Baru, Non-Aktif, Koreksi Data)
- 🏠 Survei Kelayakan Rumah & Bansos
- 💰 Manajemen Program Bantuan Sosial
- 📊 Transparansi Anggaran via Siskeudes
- ⚖️ Mekanisme Sanggahan oleh Warga
- 📵 Dukungan Mode Offline dengan IndexedDB (Dexie)
- 📱 Progressive Web App (PWA)

---

## 👥 Role & Penjelasannya

Sistem memiliki **4 role pengguna** yang terdefinisi di tabel `tweb_user_role`. Login dilakukan cukup dengan **NIK** — tidak perlu password terpisah.

---

### 1. 🏠 WARGA (`WARGA`)

**Siapa:** Penduduk terdaftar di desa yang memiliki NIK valid.

**Akses halaman:**
| Halaman | Fungsi |
|---|---|
| `/warga/dashboard` | Ringkasan status data dan program yang diikuti |
| `/warga/perbaiki-data` | Mengajukan permintaan koreksi data diri |
| `/warga/sanggah-rumah` | Mengajukan sanggahan terhadap penilaian kondisi rumah |

**Alur kerja:**
1. Warga login dengan NIK.
2. Dapat melihat apakah dirinya terdaftar sebagai penerima bansos.
3. Jika tidak setuju dengan penilaian kondisi rumah, dapat mengajukan sanggahan ke Sekdes.
4. Dapat mengajukan koreksi data kependudukan diri sendiri.

---

### 2. 🏘️ KETUA RT (`KETUA_RT`)

**Siapa:** Ketua RT yang terdaftar dan memiliki `clusterdesaId` sesuai wilayah RT-nya.

**Akses halaman:**
| Halaman | Fungsi |
|---|---|
| `/rt` | Dashboard utama Ketua RT |
| `/rt/mutasi` | Input & riwayat mutasi kependudukan |
| `/rt/warga` | Daftar seluruh warga di wilayah RT |
| `/rt/kelayakan` | Survei kelayakan rumah warga untuk bansos |
| `/rt/sanggahan` | Melihat sanggahan warga yang masuk |

**Alur kerja:**
1. RT login dengan NIK.
2. Mengelola data mutasi warga (Warga Baru, Non-Aktif, Koreksi Data) — pengajuan dikirim ke Sekdes untuk disetujui.
3. Melakukan survei kelayakan rumah warga sebagai dasar rekomendasi penerima bansos.
4. Mendukung **mode offline**: data tersimpan di IndexedDB dan otomatis tersinkronisasi saat kembali online.
5. Wilayah / Tempat untuk warga baru otomatis terisi sesuai cluster desa RT yang login.

---

### 3. 📝 SEKRETARIS DESA (`SEKRETARIS`)

**Siapa:** Sekretaris Desa yang mengelola administrasi dan verifikasi seluruh pengajuan dari RT maupun warga.

**Akses halaman:**
| Halaman | Fungsi |
|---|---|
| `/sekdes/dashboard` | Dashboard overview aktivitas desa |
| `/sekdes/berkas-rt` | Verifikasi pengajuan mutasi dari Ketua RT |
| `/sekdes/sanggahan` | Tindak lanjut sanggahan kondisi rumah dari warga |
| `/sekdes/program` | Manajemen program bantuan sosial |
| `/sekdes/program/[slug]` | Detail & pengelolaan penerima per program |
| `/sekdes/rekomendasi-sk` | Rekomendasi Surat Keputusan penerima bansos |
| `/sekdes/siskeudes` | Integrasi data anggaran dari Siskeudes |

**Alur kerja:**
1. Menerima dan memverifikasi pengajuan mutasi dari RT (APPROVED / REJECTED + feedback).
2. Membuat dan mengelola program bantuan sosial beserta anggaran dan jadwalnya.
3. Menambahkan penerima program (per penduduk atau per wilayah).
4. Menindaklanjuti sanggahan dari warga (setuju / tolak).
5. Mengimpor referensi anggaran dari Siskeudes sebagai dasar nominal program.

---

### 4. 👨‍💼 KEPALA DESA (`KEPALA_DESA`)

**Siapa:** Kepala Desa yang memiliki akses tertinggi untuk monitoring dan pengesahan kebijakan.

**Akses halaman:**
| Halaman | Fungsi |
|---|---|
| `/kades/dashboard` | Dashboard ringkasan tingkat desa |
| `/kades/program` | Monitoring seluruh program bantuan |
| `/kades/anggaran` | Transparansi dan realisasi anggaran desa |
| `/kades/detail-anggaran` | Rincian per pos anggaran |
| `/kades/detail-kpm` | Detail Keluarga Penerima Manfaat |
| `/kades/detail-penduduk` | Detail data kependudukan |
| `/kades/detail-realisasi` | Laporan realisasi penyaluran bantuan |
| `/kades/dokumen` | Manajemen dokumen & SK desa |

**Alur kerja:**
1. Memantau seluruh program bantuan sosial dan realisasinya.
2. Melihat transparansi anggaran desa secara menyeluruh.
3. Mengesahkan dokumen dan Surat Keputusan (SK) penerima manfaat.
4. Mengakses laporan demografi dan statistik kependudukan desa.

---

## 🚀 Cara Setup

### Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v9+
- Akun **Supabase** (atau gunakan project yang sudah ada)
- Git

---

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/MRamadhan000/hackathon-helden.git
cd hackathon-helden
```

### Langkah 2 — Install Dependensi

```bash
npm install
```

### Langkah 3 — Konfigurasi Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
```

> **Catatan:** Nilai di atas didapat dari dashboard Supabase → Settings → API.

### Langkah 4 — Setup Database di Supabase

Jalankan semua file SQL di folder `sql/` secara berurutan pada Supabase SQL Editor:

```
1. sql/tweb_clusterDesa.sql           ← Tabel wilayah/cluster desa
2. sql/tweb_keluarga.sql              ← Tabel data kartu keluarga
3. sql/tweb_penduduk.sql              ← Tabel data penduduk
4. sql/tweb_user_role.sql             ← Tabel role pengguna
5. sql/siskuedes.sql                  ← Tabel referensi anggaran Siskeudes
6. sql/program.sql                    ← Tabel program bantuan sosial
7. sql/penerima.sql                   ← Tabel penerima program
8. sql/tweb_pengajuan_mutasi.sql      ← Tabel pengajuan mutasi
9. sql/tweb_mutasi_logs.sql           ← Tabel audit log mutasi
10. sql/tweb_survei_kelayakan.sql     ← Tabel survei kelayakan
11. sql/tweb_survei_kelayakan_log.sql ← Tabel log survei
```

### Langkah 5 — Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi tersedia di: **http://localhost:3000**

### Langkah 6 — Login

Buka browser dan akses halaman login. Masukkan **NIK** penduduk yang terdaftar di tabel `tweb_penduduk` dengan role yang sesuai di `tweb_user_role`.

| Role | Halaman Setelah Login |
|---|---|
| WARGA | `/warga/dashboard` |
| KETUA_RT | `/rt` |
| SEKRETARIS | `/sekdes/dashboard` |
| KEPALA_DESA | `/kades/dashboard` |

---

## 🗄️ Model Data

Berikut adalah seluruh tabel database beserta relasi antar tabelnya.

### Diagram Relasi Entitas

```
tweb_clusterdesa (self-ref)
       │
       ├──◄── tweb_keluarga ──────────────────────┐
       │           │                               │
       │           ▼                               │
       └──◄── tweb_penduduk ─────────────────┐    │
                   │                          │    │
                   ├──◄── tweb_user_role      │    │
                   │                          │    │
                   ├──◄── tweb_mutasi_pengajuan ◄──┘
                   │           │
                   │           └──◄── tweb_mutasi_logs
                   │
                   ├──◄── tweb_survei_kelayakan ────► program
                   │           │
                   │           └──◄── tweb_survei_kelayakan_log
                   │
                   └──◄── penerima ────────────────► program
                                                       │
                                                   siskeudes (ref)
```

---

### Tabel: `tweb_clusterdesa`
Merepresentasikan hierarki wilayah desa (Dusun, RT, RW, dll).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID unik wilayah |
| `nama` | VARCHAR(100) | Nama wilayah (cth: "RT 03") |
| `jenis` | VARCHAR(50) | Jenis: Dusun / RT / RW |
| `parent_id` | VARCHAR(36) FK | Hierarki ke cluster induk (self-referencing) |
| `ketua_wilayah` | VARCHAR(100) | Nama ketua wilayah |
| `koordinat` | JSONB | Data koordinat spasial/peta |

---

### Tabel: `tweb_keluarga`
Data Kartu Keluarga (KK) yang terdaftar di desa.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID KK |
| `no_kk` | VARCHAR(16) UNIQUE | Nomor Kartu Keluarga (16 digit) |
| `alamat` | TEXT | Alamat tempat tinggal |
| `clusterdesa_id` | VARCHAR(36) FK | Lokasi wilayah KK |
| `created_at` | TIMESTAMP | Waktu pembuatan data |

---

### Tabel: `tweb_penduduk`
Data kependudukan setiap individu warga desa.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID penduduk |
| `nik` | VARCHAR(16) UNIQUE | NIK (16 digit), dipakai sebagai kredensial login |
| `nama` | VARCHAR(255) | Nama lengkap |
| `tempat_lahir` | VARCHAR(100) | Tempat lahir |
| `tanggal_lahir` | DATE | Tanggal lahir |
| `jenis_kelamin` | VARCHAR(20) | L / P |
| `agama` | VARCHAR(50) | Agama |
| `status_penduduk` | VARCHAR(50) | Tetap / Pindah / Meninggal |
| `status_verifikasi_dukcapil` | VARCHAR(50) | Terverifikasi / Anomali |
| `keluarga_id` | VARCHAR(36) FK | Relasi ke KK |
| `clusterdesa_id` | VARCHAR(36) FK | Lokasi wilayah tinggal |

---

### Tabel: `tweb_user_role`
Mendefinisikan role/hak akses setiap penduduk dalam sistem.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID record role |
| `penduduk_id` | VARCHAR(36) FK UNIQUE | Referensi ke `tweb_penduduk` |
| `role` | VARCHAR(50) | `KEPALA_DESA` / `SEKRETARIS` / `KETUA_RT` / `WARGA` |
| `created_at` | TIMESTAMP | Waktu pemberian role |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### Tabel: `tweb_mutasi_pengajuan`
Pengajuan mutasi kependudukan dari Ketua RT ke Sekretaris Desa.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID pengajuan |
| `nik` | VARCHAR(16) | NIK warga terkait |
| `nama` | VARCHAR(255) | Nama warga |
| `jenis_mutasi` | VARCHAR(50) | `Warga Baru` / `Non-Aktif` / `Koreksi Data` |
| `status` | VARCHAR(50) | `PENDING` / `APPROVED` / `REJECTED` / `RESUBMITTED` |
| `feedback_sekdes` | TEXT | Catatan penolakan dari Sekdes |
| `tipe_proses` | VARCHAR(20) | `ONLINE` / `OFFLINE` |
| `req_method` | VARCHAR(20) | Metode pengajuan |
| `tahun_periode` | VARCHAR(4) | Tahun periode data |
| `keluarga_id` | VARCHAR(36) FK | Relasi ke KK |
| `clusterdesa_id` | VARCHAR(36) FK | Wilayah tujuan |
| `created_by` | VARCHAR(36) FK | RT yang mengajukan |
| `approved_by` | VARCHAR(36) FK | Sekdes yang menyetujui |
| `parent` | VARCHAR FK | Referensi pengajuan ulang (resubmit) |

---

### Tabel: `tweb_mutasi_logs`
Audit trail setiap perubahan status pada pengajuan mutasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID log |
| `mutasi_id` | VARCHAR(36) FK | Referensi ke pengajuan mutasi |
| `actor_id` | VARCHAR(36) | Pengguna yang melakukan aksi |
| `actor_role` | VARCHAR(50) | Role aktor |
| `action` | VARCHAR(100) | Deskripsi aksi |
| `status_awal` | VARCHAR(50) | Status sebelum perubahan |
| `status_baru` | VARCHAR(50) | Status setelah perubahan |
| `catatan` | TEXT | Keterangan tambahan |
| `created_at` | TIMESTAMP | Waktu kejadian |

---

### Tabel: `tweb_survei_kelayakan`
Data hasil survei kelayakan rumah warga untuk penentuan penerima bansos.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID survei |
| `penduduk_id` | VARCHAR(36) FK | Warga yang disurvei |
| `nik` | VARCHAR(16) | NIK warga |
| `skor` | INTEGER | Total skor kelayakan |
| `kategori` | VARCHAR(100) | Kategori kelayakan |
| `jenis_dinding` | VARCHAR(100) | Material dinding rumah |
| `jenis_lantai` | VARCHAR(100) | Material lantai rumah |
| `sanitasi` | VARCHAR(100) | Kondisi sanitasi |
| `sumber_air` | TEXT | Sumber air bersih |
| `penghasilan_bulanan` | NUMERIC | Penghasilan per bulan |
| `ada_lansia` | BOOLEAN | Ada anggota lansia |
| `status` | VARCHAR(50) | `PENDING` / `APPROVED` / `REJECTED` |
| `feedback_sekdes` | TEXT | Catatan Sekdes |
| `program_id` | VARCHAR(36) FK | Program terkait |
| `tahun_periode` | VARCHAR(4) | Tahun periode |

---

### Tabel: `program`
Data program bantuan sosial yang dikelola Sekdes.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID program |
| `nama` | VARCHAR(255) | Nama program |
| `deskripsi` | TEXT | Deskripsi program |
| `jumlah_anggaran` | NUMERIC(18,2) | Total anggaran program |
| `nominal` | NUMERIC(18,2) | Nominal per penerima |
| `sisa_uang` | NUMERIC(18,2) | Sisa anggaran tersisa |
| `nomor_sk` | VARCHAR(100) | Nomor Surat Keputusan |
| `tanggal_mulai` | DATE | Tanggal mulai program |
| `tanggal_selesai` | DATE | Tanggal selesai program |
| `created_by` | VARCHAR(36) FK | Sekdes pembuat program |

---

### Tabel: `penerima`
Data penerima manfaat per program bantuan sosial.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID record penerima |
| `program_id` | VARCHAR(36) FK | Program terkait |
| `penduduk_id` | VARCHAR(36) FK | Penduduk penerima |
| `area_location_id` | VARCHAR(36) FK | Lokasi / cluster wilayah |
| `status` | VARCHAR(50) | `PENDING` / `APPROVED` / `REJECTED` / `DISTRIBUTED` |
| `nominal` | NUMERIC(18,2) | Nominal bantuan yang diterima |
| `catatan` | TEXT | Catatan tambahan |
| `created_by` | VARCHAR(36) FK | Sekdes yang menambahkan |

---

### Tabel: `siskeudes`
Referensi data anggaran dari sistem Siskeudes (Sistem Keuangan Desa).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID record |
| `nama` | VARCHAR(255) | Nama pos anggaran |
| `kategori` | VARCHAR(50) | `bansos` / `operasional` |
| `nominal` | NUMERIC(18,2) | Nominal anggaran |
| `kkm` | NUMERIC(18,2) | KKM / ambang batas |

---

## 🏗️ Arsitektur Sistem

### Overview

```
┌──────────────────────────────────────────────────────┐
│                  BROWSER / PWA                        │
│                                                       │
│  ┌────────────────┐      ┌──────────────────────┐    │
│  │  Next.js App   │      │  IndexedDB (Dexie)   │    │
│  │  (App Router)  │◄────►│  Offline Queue       │    │
│  └───────┬────────┘      └──────────────────────┘    │
│          │                                            │
│  ┌───────▼────────────────────────────────────────┐  │
│  │           Layers Aplikasi                       │  │
│  │  Pages → Hooks → Services → Supabase Client    │  │
│  └───────┬────────────────────────────────────────┘  │
└──────────┼───────────────────────────────────────────┘
           │  HTTPS / REST
┌──────────▼───────────────────────────────────────────┐
│               SUPABASE (Backend-as-a-Service)         │
│                                                       │
│   PostgreSQL DB  │  Auth (NIK-based)  │  Realtime    │
└──────────────────────────────────────────────────────┘
```

---

### Layer Arsitektur

#### 1. Presentation Layer — `app/`
Routing berbasis **Next.js App Router**. Setiap folder mewakili satu segmen URL.

```
app/
├── page.tsx              ← Landing page / root
├── login/                ← Halaman login (input NIK)
├── rt/                   ← Panel Ketua RT
│   ├── page.tsx          ← Dashboard RT
│   ├── mutasi/           ← Manajemen mutasi kependudukan
│   ├── warga/            ← Daftar warga RT
│   ├── kelayakan/        ← Survei kelayakan bansos
│   └── sanggahan/        ← Sanggahan warga
├── sekdes/               ← Panel Sekretaris Desa
│   ├── dashboard/        ← Dashboard Sekdes
│   ├── berkas-rt/        ← Verifikasi pengajuan RT
│   ├── program/          ← Manajemen program bansos
│   ├── sanggahan/        ← Tindak lanjut sanggahan
│   ├── rekomendasi-sk/   ← Rekomendasi SK penerima
│   └── siskeudes/        ← Integrasi Siskeudes
├── kades/                ← Panel Kepala Desa
│   ├── dashboard/        ← Dashboard Kades
│   ├── program/          ← Monitoring program
│   ├── anggaran/         ← Transparansi anggaran
│   └── dokumen/          ← Manajemen dokumen & SK
└── warga/                ← Panel Warga Umum
    ├── dashboard/        ← Status warga
    ├── perbaiki-data/    ← Koreksi data diri
    └── sanggah-rumah/    ← Ajukan sanggahan
```

#### 2. Component Layer — `components/`
Komponen UI yang reusable, diorganisir per domain:

```
components/
└── rt/
    ├── FormMutasiLengkap.tsx   ← Form input mutasi
    ├── TableWarga.tsx           ← Tabel daftar warga
    ├── SearchableNikSelect.tsx  ← Dropdown pencarian NIK
    ├── FormSurveiKelayakan.tsx  ← Form survei rumah
    ├── CardSanggahan.tsx        ← Card detail sanggahan
    └── RTHeader.tsx             ← Header panel RT
```

#### 3. Hook Layer — `hooks/`
Custom React Hooks sebagai jembatan antara UI dan service layer.

```
hooks/
├── useAuth.ts              ← State autentikasi & session
├── useConnection.ts        ← Deteksi status online/offline
├── useMasterPeriode.ts     ← Data periode aktif
├── useUserRoles.ts         ← Daftar user roles
└── cores/
    ├── usePenduduk.ts         ← Data penduduk
    ├── useKeluarga.ts         ← Data kartu keluarga
    ├── useClusterDesa.ts      ← Data wilayah
    ├── useMutasi.ts           ← Pengajuan mutasi
    ├── useSanggahan.ts        ← Data sanggahan
    └── useSurveiKelayakan.ts  ← Data survei
```

#### 4. Service Layer — `services/`
Berinteraksi langsung dengan Supabase (query, insert, update).

```
services/
└── core/
    ├── auth.service.ts         ← Login by NIK, fetch profile
    ├── penduduk.service.ts     ← CRUD data penduduk
    ├── mutasi.service.ts       ← Submit & approve mutasi
    ├── kelayakan.service.ts    ← Submit & approve survei
    ├── sanggahan.service.ts    ← Manajemen sanggahan
    ├── keluarga.service.ts     ← Data KK
    ├── clusterDesa.service.ts  ← Data wilayah
    ├── demografi.service.ts    ← Statistik kependudukan
    └── warga.service.ts        ← Data warga umum
```

#### 5. Provider Layer — `providers/`
Context provider global untuk state autentikasi.

```
providers/
└── AuthProvider.tsx    ← Context: user, role, login(), logout()
```

#### 6. Offline Layer — `lib/`
Implementasi offline-first menggunakan **Dexie (IndexedDB wrapper)**.

```
lib/
├── db.ts               ← Koneksi IndexedDB (Dexie)
└── mutasiOfflineDB.ts  ← Tabel offline queue mutasi
```

**Alur Offline:**
```
Submit Mutasi
     │
     ▼
 Online? ──YES──► Kirim ke Supabase ──► Berhasil? ──YES──► Selesai
     │                                      │
     NO                                     NO
     │                                      │
     ▼                                      ▼
Simpan ke IndexedDB ◄─────────────── Simpan ke IndexedDB
     │
     ▼
Saat Online Kembali → Auto Sync ke Supabase
```

---

### Alur Autentikasi

```
User input NIK
      │
      ▼
auth.service.ts → query tweb_penduduk by NIK
      │
      ▼
Query tweb_user_role → dapatkan role
      │
      ▼
Set AuthContext (user, role)
      │
      ▼
Redirect ke halaman sesuai role:
  WARGA        → /warga/dashboard
  KETUA_RT     → /rt
  SEKRETARIS   → /sekdes/dashboard
  KEPALA_DESA  → /kades/dashboard
```

---

### Alur Pengajuan Mutasi

```
KETUA RT
   │ Input form mutasi (Warga Baru / Non-Aktif / Koreksi)
   ▼
Cek koneksi internet
   ├── Online  → Submit ke Supabase (status: PENDING)
   └── Offline → Simpan IndexedDB, auto-sync saat online
         │
         ▼
SEKRETARIS DESA
   │ Menerima pengajuan di /sekdes/berkas-rt
   ├── APPROVED → Status berubah ke APPROVED
   └── REJECTED → Status REJECTED + feedback ke RT
         │
         ▼
KETUA RT (jika REJECTED)
   └── Bisa resubmit dengan perbaikan (status: RESUBMITTED)
```

---

## 📁 Struktur Direktori

```
hackathon-helden/
├── app/                    ← Next.js App Router pages
├── components/             ← Reusable UI components
├── hooks/                  ← Custom React Hooks
├── lib/                    ← Utility & offline DB (Dexie)
├── providers/              ← React Context Providers
├── services/               ← Supabase data access layer
├── sql/                    ← Skema database PostgreSQL
├── types/                  ← TypeScript type definitions
├── utils/                  ← Helper functions
├── public/                 ← Static assets & PWA manifest
├── .env.local              ← Environment variables (tidak di-commit)
├── next.config.ts          ← Konfigurasi Next.js
├── package.json            ← Dependensi & scripts
└── tsconfig.json           ← Konfigurasi TypeScript
```

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.12 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Backend / DB | Supabase (PostgreSQL) | ^2.111.0 |
| Offline DB | Dexie (IndexedDB) | ^4.4.4 |
| Charts | Chart.js + react-chartjs-2 | ^4.5.1 |
| PWA | @ducanh2912/next-pwa | ^10.2.9 |
| Linting | ESLint | ^9 |

---

## 🔐 Catatan Keamanan

- Autentikasi menggunakan NIK — cocok untuk konteks desa tanpa kompleksitas password management
- Session disimpan di `localStorage` dan di-refresh dari Supabase di background
- Environment variables sensitif (Supabase URL & Key) wajib disimpan di `.env.local` dan **tidak** di-commit ke repository
- File `.env.local` sudah terdaftar di `.gitignore`

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Hackathon** dan bersifat open untuk dikembangkan lebih lanjut.

---

*Dibuat dengan ❤️ oleh Tim Helden — Hackathon 2026*
