-- Migration for existing installs: adds priority, category, url, custom_email_body
-- to the reminders table.  Safe to run on a live database — uses ADD COLUMN IF NOT EXISTS.
-- Run in: Supabase > SQL Editor > New query

alter table reminders
  add column if not exists priority text not null default 'medium',
  add column if not exists category text,
  add column if not exists url text,
  add column if not exists custom_email_body text;
