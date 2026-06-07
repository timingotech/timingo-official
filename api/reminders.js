import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Sent immediately when a reminder is created — separate from (and in addition to)
// the scheduled "X before due" nudges that api/reminders-check.js sends later.
async function sendCreatedEmail(reminder) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  // Note: `dateStyle`/`timeStyle` can't be combined with `timeZoneName` (Intl throws), so spell out the parts.
  const dueLabel = new Date(reminder.due_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const emails = reminder.person_emails || [];
  const names = reminder.person_names || [];

  await Promise.all(
    emails.map(async (email, i) => {
      const name = names[i] || email;
      try {
        await resend.emails.send({
          from: `${process.env.FROM_NAME || 'TimingoTech Reminders'} <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: `Reminder set: ${reminder.title}`,
          html: `<p>Hi ${name},</p>
            <p>A reminder has just been set for <strong>${reminder.company}</strong>:</p>
            <h3 style="margin: 8px 0;">${reminder.title}</h3>
            ${reminder.notes ? `<p>${reminder.notes}</p>` : ''}
            <p><strong>Due:</strong> ${dueLabel}</p>
            <p>You'll get follow-up nudges by email as the due time gets closer.</p>
            <p style="color:#888; font-size: 12px;">Sent by Timingo Tech Reminders</p>
          `,
        });
      } catch (err) {
        console.error(`Failed to send "reminder created" email to ${email} for ${reminder.id}:`, err);
      }
    })
  );
}

const UPDATABLE_FIELDS = [
  'company',
  'person_names',
  'person_emails',
  'title',
  'notes',
  'due_at',
  'remind_offsets_minutes',
  'completed',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Reminders storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_KEY)' });
  }

  const supabase = getClient();

  try {
    if (req.method === 'GET') {
      const { company } = req.query || {};
      let query = supabase.from('reminders').select('*').order('due_at', { ascending: true });
      if (company) query = query.ilike('company', company);

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ reminders: data });
    }

    if (req.method === 'POST') {
      const { company, person_names, person_emails, title, notes, due_at, remind_offsets_minutes } = req.body || {};

      const emails = Array.isArray(person_emails) ? person_emails.map((e) => String(e).trim()).filter(Boolean) : [];
      const names = Array.isArray(person_names) ? person_names.map((n) => String(n).trim()).filter(Boolean) : [];

      if (!company || !title || !due_at || emails.length === 0) {
        return res.status(400).json({ error: 'Missing required fields: company, title, due_at, and at least one recipient email' });
      }

      const offsets = Array.isArray(remind_offsets_minutes) && remind_offsets_minutes.length
        ? remind_offsets_minutes.map(Number).filter((n) => Number.isFinite(n) && n >= 0)
        : [1440, 60, 10, 5];

      const { data, error } = await supabase
        .from('reminders')
        .insert({
          company,
          person_names: names,
          person_emails: emails,
          title,
          notes: notes || null,
          due_at,
          remind_offsets_minutes: offsets,
        })
        .select()
        .single();

      if (error) throw error;

      // Fire-and-forget: let the person know right away that a reminder was set for them.
      // Don't let an email hiccup block the API response — the reminder is already saved.
      sendCreatedEmail(data).catch((err) => console.error('sendCreatedEmail failed:', err));

      return res.status(201).json({ reminder: data });
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const patch = {};
      for (const key of UPDATABLE_FIELDS) {
        if (key in updates) patch[key] = updates[key];
      }
      if (Object.keys(patch).length === 0) {
        return res.status(400).json({ error: 'No updatable fields provided' });
      }

      if ('person_emails' in patch) {
        patch.person_emails = Array.isArray(patch.person_emails)
          ? patch.person_emails.map((e) => String(e).trim()).filter(Boolean)
          : [];
        if (patch.person_emails.length === 0) {
          return res.status(400).json({ error: 'At least one recipient email is required' });
        }
      }
      if ('person_names' in patch) {
        patch.person_names = Array.isArray(patch.person_names)
          ? patch.person_names.map((n) => String(n).trim()).filter(Boolean)
          : [];
      }

      // Changing the due date means past notifications no longer apply — let them fire again on the new schedule
      if ('due_at' in patch) patch.sent_offsets = [];

      const { data, error } = await supabase.from('reminders').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ reminder: data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reminders API error:', err);
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
