CREATE TABLE public.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL constraint account_pk primary key,
    first_name character varying(10),
    last_name character varying(10),
    email character varying(50)
);
