-- 1. Tabel Keluarga (tweb_keluarga)
CREATE TABLE tweb_keluarga (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan format UUID
    no_kk VARCHAR(16) NOT NULL UNIQUE,
    alamat TEXT NOT NULL,
    clusterdesa_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clusterdesa_id) REFERENCES tweb_clusterdesa(id)
);