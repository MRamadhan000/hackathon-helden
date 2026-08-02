create table public.program (
  id character varying(36) not null,
  nama character varying(255) not null,
  deskripsi text null,
  jumlah_anggaran numeric(18, 2) not null,
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  created_by character varying(36) not null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  nominal numeric(18, 2) null,
  sisa_uang numeric(18, 2) null,
  nomor_sk character varying(100) null,
  constraint program_pkey primary key (id),
  constraint program_created_by_fkey foreign KEY (created_by) references tweb_penduduk (id) on update CASCADE on delete RESTRICT,
  constraint program_tanggal_check check ((tanggal_selesai >= tanggal_mulai))
) TABLESPACE pg_default;

create index IF not exists idx_program_created_by on public.program using btree (created_by) TABLESPACE pg_default;

create index IF not exists idx_program_tanggal on public.program using btree (tanggal_mulai, tanggal_selesai) TABLESPACE pg_default;