create table public.tweb_survei_kelayakan_logs (
  id character varying(36) not null,
  survei_id character varying(36) not null,
  actor_id character varying(36) not null,
  actor_role character varying(50) not null,
  action character varying(100) not null,
  status_awal character varying(50) null,
  status_baru character varying(50) not null,
  catatan text null,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint tweb_survei_kelayakan_logs_pkey primary key (id),
  constraint tweb_survei_kelayakan_logs_survei_id_fkey foreign KEY (survei_id) references tweb_survei_kelayakan (id) on delete CASCADE
) TABLESPACE pg_default;