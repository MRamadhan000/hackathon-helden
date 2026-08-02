-- Tabel Hasil Survei Kelayakan Bansos Prodeskel (tweb_survei_kelayakan)
CREATE TABLE IF NOT EXISTS tweb_survei_kelayakan (
    id VARCHAR(36) PRIMARY KEY,
    penduduk_id VARCHAR(36) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    skor INT NOT NULL DEFAULT 0,
    kategori VARCHAR(100) NOT NULL, -- 'Sangat Layak (Prioritas SK)', 'Cukup Layak', 'Tidak Layak'
    indikator_detail TEXT NOT NULL,
    jenis_dinding VARCHAR(100),
    jenis_lantai VARCHAR(100),
    sanitasi VARCHAR(100),
    penghasilan_bulanan NUMERIC(12, 2),
    ada_lansia BOOLEAN DEFAULT FALSE,
    tipe_proses VARCHAR(20) NOT NULL DEFAULT 'OFFLINE', -- 'OFFLINE' (Survei Langsung RT) | 'ONLINE' (Pengajuan Warga)
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    feedback_sekdes TEXT,
    tahun_periode VARCHAR(4) NOT NULL DEFAULT '2026',
    created_by VARCHAR(36) NOT NULL,
    approved_by VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (penduduk_id) REFERENCES tweb_penduduk(id) ON DELETE CASCADE
);

-- Tabel Audit Trail / Log Riwayat Survei Kelayakan (tweb_survei_kelayakan_logs)
CREATE TABLE IF NOT EXISTS tweb_survei_kelayakan_logs (
    id VARCHAR(36) PRIMARY KEY,
    survei_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36) NOT NULL, -- FK ke user / tweb_penduduk
    actor_role VARCHAR(50) NOT NULL, -- 'WARGA', 'RT', 'SEKDES'
    action VARCHAR(100) NOT NULL, -- 'SUBMIT_OFFLINE', 'SUBMIT_ONLINE', 'APPROVE', 'REJECT'
    status_awal VARCHAR(50),
    status_baru VARCHAR(50) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survei_id) REFERENCES tweb_survei_kelayakan(id) ON DELETE CASCADE
);
