CREATE TABLE tweb_penduduk (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan format UUID
    nik VARCHAR(16) NOT NULL UNIQUE, -- FK ke Dukcapil
    nama VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(20) NOT NULL,
    agama VARCHAR(50) NOT NULL,
    status_penduduk VARCHAR(50) NOT NULL,
    status_verifikasi_dukcapil VARCHAR(50) NOT NULL,
    keluarga_id VARCHAR(36) NOT NULL,
    clusterdesa_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (keluarga_id) REFERENCES tweb_keluarga(id),
    FOREIGN KEY (clusterdesa_id) REFERENCES tweb_clusterdesa(id)
);