-- Tabel Pengajuan Mutasi Kependudukan (tweb_mutasi_pengajuan)
CREATE TABLE IF NOT EXISTS tweb_mutasi_pengajuan (
    id VARCHAR(36) PRIMARY KEY,
    nik VARCHAR(16) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(20) NOT NULL,
    agama VARCHAR(50) NOT NULL,
    keluarga_id VARCHAR(36) NOT NULL,
    clusterdesa_id VARCHAR(36) NOT NULL,
    jenis_mutasi VARCHAR(50) NOT NULL, -- 'Warga Baru', 'Non-Aktif', 'Koreksi Data'
    keterangan TEXT,
    tipe_proses VARCHAR(20) NOT NULL DEFAULT 'OFFLINE', -- 'OFFLINE' (ke RT) | 'ONLINE' (tanpa RT)
    req_method VARCHAR(20) NOT NULL DEFAULT 'OFFLINE', -- 'OFFLINE' (lewat RT) | 'ONLINE' (via web)
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'RESUBMITTED'
    feedback_sekdes TEXT,
    tahun_periode VARCHAR(4) NOT NULL DEFAULT '2026',
    created_by VARCHAR(36) NOT NULL, -- ID User / Warga / RT yang mengajukan
    approved_by VARCHAR(36), -- ID Sekdes yang melakukan verifikasi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (keluarga_id) REFERENCES tweb_keluarga(id),
    FOREIGN KEY (clusterdesa_id) REFERENCES tweb_clusterdesa(id)
);

-- Tabel Audit Trail / Log Riwayat Mutasi (tweb_mutasi_logs)
CREATE TABLE IF NOT EXISTS tweb_mutasi_logs (
    id VARCHAR(36) PRIMARY KEY,
    mutasi_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36) NOT NULL, -- FK ke user / tweb_penduduk yang memproses
    actor_role VARCHAR(50) NOT NULL, -- 'WARGA', 'RT', 'SEKDES'
    action VARCHAR(100) NOT NULL, -- 'SUBMIT_OFFLINE', 'SUBMIT_ONLINE', 'APPROVE', 'REJECT', 'RESUBMIT'
    status_awal VARCHAR(50),
    status_baru VARCHAR(50) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mutasi_id) REFERENCES tweb_mutasi_pengajuan(id) ON DELETE CASCADE
);
