-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- to create the table that backs the internal Reminders page.

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  person_name text not null,
  person_email text not null,
  title text not null,
  notes text,
  due_at timestamptz not null,
  remind_offsets_minutes int[] not null default '{1440,60,10,5}',
  sent_offsets int[] not null default '{}',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reminders_due_at_idx on reminders (due_at);
create index if not exists reminders_company_idx on reminders (company);
