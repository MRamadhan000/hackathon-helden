create table public.program (
    id character varying(36) not null,

    nama character varying(255) not null,
    deskripsi text null,

    jumlah_anggaran numeric(18,2) not null,

    tanggal_mulai date not null,
    tanggal_selesai date not null,

    created_by character varying(36) not null,

    created_at timestamp without time zone default now(),
    updated_at timestamp without time zone default now(),

    constraint program_pkey primary key (id),

    constraint program_created_by_fkey
        foreign key (created_by)
        references public.tweb_penduduk (id)
        on update cascade
        on delete restrict,

    constraint program_tanggal_check
        check (tanggal_selesai >= tanggal_mulai)
);

create index idx_program_created_by
on public.program(created_by);

create index idx_program_tanggal
on public.program(tanggal_mulai, tanggal_selesai);