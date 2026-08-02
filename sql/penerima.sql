-- =============================================
-- Table: public.penerima
-- Penerima benefit / program
-- =============================================

DROP TABLE IF EXISTS public.penerima CASCADE;

CREATE TABLE public.penerima (
    id                  character varying(36)   NOT NULL,
    program_id          character varying(36)   NOT NULL,
    penduduk_id         character varying(36)   NOT NULL,   -- orang yang menerima benefit
    area_location_id    character varying(36)   NOT NULL,   -- FK ke tweb_clusterdesa
    created_by          character varying(36)   NOT NULL,   -- user yang track/input

    status              character varying(50)   NOT NULL DEFAULT 'PENDING',
    catatan             text                    NULL,

    created_at          timestamp without time zone DEFAULT now(),
    updated_at          timestamp without time zone DEFAULT now(),

    CONSTRAINT penerima_pkey PRIMARY KEY (id),

    CONSTRAINT penerima_program_fkey
        FOREIGN KEY (program_id)
        REFERENCES public.program (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT penerima_penduduk_fkey
        FOREIGN KEY (penduduk_id)
        REFERENCES public.tweb_penduduk (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT penerima_area_location_fkey
        FOREIGN KEY (area_location_id)
        REFERENCES public.tweb_clusterdesa (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT penerima_status_check
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DISTRIBUTED'))
);

-- Index
CREATE INDEX idx_penerima_program_id 
    ON public.penerima (program_id);

CREATE INDEX idx_penerima_penduduk_id 
    ON public.penerima (penduduk_id);

CREATE INDEX idx_penerima_area_location_id 
    ON public.penerima (area_location_id);

CREATE INDEX idx_penerima_created_by 
    ON public.penerima (created_by);

CREATE INDEX idx_penerima_status 
    ON public.penerima (status);