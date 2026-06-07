-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- to (re)create the table that backs the internal Reminders page.
--
-- NOTE: this drops any existing `reminders` table — fine for a fresh setup,
-- but don't re-run it once you have real reminders you want to keep.

drop table if exists reminders;

create table reminders (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  person_names text[] not null,
  person_emails text[] not null,
  title text not null,
  notes text,
  due_at timestamptz not null,
  remind_offsets_minutes int[] not null default '{1440,60,10,5}',
  sent_offsets int[] not null default '{}',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index reminders_due_at_idx on reminders (due_at);
create index reminders_company_idx on reminders (company);

-- Browser push subscriptions for the "notify me on this device" toggle.
-- Safe to run on its own — it does not touch the reminders table above.
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
