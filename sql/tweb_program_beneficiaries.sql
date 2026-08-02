create table public.program_beneficiaries (
    id character varying(36) not null,

    program_id character varying(36) not null,
    penduduk_id character varying(36) not null,

    amount_allocated numeric(18,2) not null default 0,
    amount_remaining numeric(18,2) not null default 0,

    status character varying(20) not null default 'PENDING',

    notes text null,

    created_at timestamp without time zone default now(),
    updated_at timestamp without time zone default now(),

    constraint program_beneficiaries_pkey
        primary key (id),

    constraint program_beneficiaries_program_id_fkey
        foreign key (program_id)
        references public.program(id)
        on update cascade
        on delete cascade,

    constraint program_beneficiaries_penduduk_id_fkey
        foreign key (penduduk_id)
        references public.tweb_penduduk(id)
        on update cascade
        on delete restrict,

    constraint program_beneficiaries_status_check
        check (
            status in (
                'PENDING',
                'SENT',
                'RECEIVED',
                'COMPLETED'
            )
        )
);

create index idx_program_beneficiaries_program
on public.program_beneficiaries(program_id);

create index idx_program_beneficiaries_penduduk
on public.program_beneficiaries(penduduk_id);

create index idx_program_beneficiaries_status
on public.program_beneficiaries(status);