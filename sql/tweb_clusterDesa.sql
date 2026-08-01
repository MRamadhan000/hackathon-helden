CREATE TABLE tweb_clusterdesa (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan format UUID
    nama VARCHAR(100) NOT NULL,
    jenis VARCHAR(50) NOT NULL, -- Contoh: Dusun, RT, RW
    parent_id VARCHAR(36) NULL, -- Hubungan hierarki wilayah (self-referencing)
    ketua_wilayah VARCHAR(100) NULL,
    koordinat JSONB NULL, -- Menyimpan data koordinat spasial/peta
    FOREIGN KEY (parent_id) REFERENCES tweb_clusterdesa(id)
);