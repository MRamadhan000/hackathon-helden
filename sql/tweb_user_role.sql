-- Tabel User Role (tweb_user_role)
-- Menghubungkan data penduduk (tweb_penduduk) dengan peran di sistem desa
CREATE TABLE IF NOT EXISTS tweb_user_role (
    id VARCHAR(36) PRIMARY KEY,
    penduduk_id VARCHAR(36) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL, -- Enum: 'KEPALA_DESA', 'SEKRETARIS', 'KETUA_RT', 'WARGA'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (penduduk_id) REFERENCES tweb_penduduk(id) ON DELETE CASCADE
);
