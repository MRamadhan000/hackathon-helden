create table public.siskeudes (
  id character varying(36) not null,
  nama character varying(255) not null,
  kategori character varying(50) not null,
  nominal numeric(18, 2) not null,
  kkm numeric(18, 2) null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint siskeudes_pkey primary key (id),
  constraint siskeudes_kategori_check check (
    (
      (kategori)::text = any (
        (
          array[
            'bansos'::character varying,
            'operasional'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_siskeudes_kategori on public.siskeudes using btree (kategori) TABLESPACE pg_default;

create index IF not exists idx_siskeudes_nama on public.siskeudes using btree (nama) TABLESPACE pg_default;