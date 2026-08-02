create table public.penerima (
  id character varying(36) not null,
  program_id character varying(36) not null,
  penduduk_id character varying(36) not null,
  area_location_id character varying(36) not null,
  created_by character varying(36) not null,
  status character varying(50) not null default 'PENDING'::character varying,
  catatan text null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  nominal numeric(18, 2) null,
  constraint penerima_pkey primary key (id),
  constraint penerima_area_location_fkey foreign KEY (area_location_id) references tweb_clusterdesa (id) on update CASCADE on delete RESTRICT,
  constraint penerima_penduduk_fkey foreign KEY (penduduk_id) references tweb_penduduk (id) on update CASCADE on delete RESTRICT,
  constraint penerima_program_fkey foreign KEY (program_id) references program (id) on update CASCADE on delete RESTRICT,
  constraint penerima_status_check check (
    (
      (status)::text = any (
        (
          array[
            'PENDING'::character varying,
            'APPROVED'::character varying,
            'REJECTED'::character varying,
            'DISTRIBUTED'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_penerima_program_id on public.penerima using btree (program_id) TABLESPACE pg_default;

create index IF not exists idx_penerima_penduduk_id on public.penerima using btree (penduduk_id) TABLESPACE pg_default;

create index IF not exists idx_penerima_area_location_id on public.penerima using btree (area_location_id) TABLESPACE pg_default;

create index IF not exists idx_penerima_created_by on public.penerima using btree (created_by) TABLESPACE pg_default;

create index IF not exists idx_penerima_status on public.penerima using btree (status) TABLESPACE pg_default;