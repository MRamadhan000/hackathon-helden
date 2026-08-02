-- Tabel Sanggahan Data Diri Warga (tweb_sanggahan_penduduk)
CREATE TABLE IF NOT EXISTS tweb_sanggahan_penduduk (
    id VARCHAR(36) PRIMARY KEY,
    penduduk_id VARCHAR(36),
    nik_pelapor VARCHAR(16) NOT NULL,
    nama_pelapor VARCHAR(255) NOT NULL,
    jenis_ketidakcocokan VARCHAR(100) NOT NULL,
    alasan_sanggahan TEXT NOT NULL,
    tipe_proses VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- 'OFFLINE' | 'ONLINE'
    req_method VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- 'OFFLINE' (via RT) | 'ONLINE' (via web)
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'DIAJUKAN_SEKDES', 'APPROVED', 'REJECTED', 'RESUBMITTED'
    feedback_sekdes TEXT,
    tahun_periode VARCHAR(4) NOT NULL DEFAULT '2026',
    created_by VARCHAR(36) NOT NULL,
    approved_by VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Sanggahan Kondisi Rumah (tweb_sanggahan_rumah)
CREATE TABLE IF NOT EXISTS tweb_sanggahan_rumah (
    id VARCHAR(36) PRIMARY KEY,
    penduduk_id VARCHAR(36),
    nik_pelapor VARCHAR(16) NOT NULL,
    nama_pelapor VARCHAR(255) NOT NULL,
    jenis_dinding VARCHAR(100) NOT NULL,
    jenis_lantai VARCHAR(100) NOT NULL,
    sanitasi VARCHAR(100) NOT NULL,
    skor_sistem INT DEFAULT 0,
    alasan_warga TEXT NOT NULL,
    tipe_proses VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- 'OFFLINE' | 'ONLINE'
    req_method VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- 'OFFLINE' (via RT) | 'ONLINE' (via web)
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'DIAJUKAN_SEKDES', 'APPROVED', 'REJECTED', 'RESUBMITTED'
    feedback_sekdes TEXT,
    tahun_periode VARCHAR(4) NOT NULL DEFAULT '2026',
    created_by VARCHAR(36) NOT NULL,
    approved_by VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Audit Trail / Log Riwayat Sanggahan (tweb_sanggahan_logs)
CREATE TABLE IF NOT EXISTS tweb_sanggahan_logs (
    id VARCHAR(36) PRIMARY KEY,
    sanggahan_id VARCHAR(36) NOT NULL,
    jenis_sanggahan VARCHAR(50) NOT NULL, -- 'PENDUDUK' | 'RUMAH'
    actor_id VARCHAR(36) NOT NULL, -- FK ke user / tweb_penduduk
    actor_role VARCHAR(50) NOT NULL, -- 'WARGA', 'RT', 'SEKDES'
    action VARCHAR(100) NOT NULL, -- 'SUBMIT_OFFLINE', 'SUBMIT_ONLINE', 'FORWARD_TO_SEKDES', 'APPROVE', 'REJECT', 'RESUBMIT'
    status_awal VARCHAR(50),
    status_baru VARCHAR(50) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
