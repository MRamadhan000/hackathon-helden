create table public.tweb_mutasi_logs (
  id character varying(36) not null,
  mutasi_id character varying(36) not null,
  actor_id character varying(36) not null,
  actor_role character varying(50) not null,
  action character varying(100) not null,
  status_awal character varying(50) null,
  status_baru character varying(50) not null,
  catatan text null,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint tweb_mutasi_logs_pkey primary key (id),
  constraint tweb_mutasi_logs_mutasi_id_fkey foreign KEY (mutasi_id) references tweb_mutasi_pengajuan (id) on delete CASCADE
) TABLESPACE pg_default;