import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function buildEmailHtml({ reminder, name, dueLabel, isCreated = false, offsetMinutes = null }) {
  const when = offsetMinutes === null ? null : describeOffset(offsetMinutes);

  const accentColor  = offsetMinutes === 0 ? '#e53e3e' : isCreated ? '#6675F7' : '#F7666F';
  const badgeText    = isCreated
    ? '🔔 Reminder Set'
    : offsetMinutes === 0
    ? '⚡ Due Right Now'
    : `⏰ Due ${when}`;

  const messageHtml = reminder.custom_email_body
    ? `<p style="margin:0 0 16px;color:#374151;line-height:1.6;">${String(reminder.custom_email_body).replace(/\n/g, '<br/>')}</p>`
    : isCreated
    ? `<p style="margin:0 0 16px;color:#374151;line-height:1.6;">A reminder has been set for <strong style="color:#111827;">${reminder.company}</strong>. You'll receive follow-up nudges by email as the due time approaches.</p>`
    : `<p style="margin:0 0 16px;color:#374151;line-height:1.6;">This is your reminder for <strong style="color:#111827;">${reminder.company}</strong>${offsetMinutes === 0 ? ' — it's due <strong>right now</strong>' : `, due <strong>${when}</strong>`}.</p>`;

  const notesHtml = reminder.notes
    ? `<div style="margin:16px 0;padding:14px 16px;background:#F9FAFB;border-left:3px solid #D1D5DB;border-radius:4px;">
        <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">${reminder.notes.replace(/\n/g, '<br/>')}</p>
       </div>`
    : '';

  const urlHtml = reminder.url
    ? `<p style="margin:12px 0 0;"><a href="${reminder.url}" style="color:#6675F7;font-size:13px;text-decoration:none;">🔗 View reference link →</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${reminder.title}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <!-- header bar -->
        <tr><td style="background:linear-gradient(135deg,#F7666F,#6675F7);border-radius:12px 12px 0 0;padding:24px 32px;">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.05em;color:rgba(255,255,255,0.8);text-transform:uppercase;">Timingo Tech Reminders</p>
          <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;">${reminder.title}</p>
        </td></tr>

        <!-- body card -->
        <tr><td style="background:#ffffff;padding:28px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">

          <!-- badge -->
          <p style="margin:0 0 20px;">
            <span style="display:inline-block;padding:6px 14px;background:${accentColor}18;color:${accentColor};font-size:13px;font-weight:600;border-radius:20px;border:1px solid ${accentColor}33;">${badgeText}</span>
          </p>

          <p style="margin:0 0 4px;font-size:15px;color:#111827;">Hi <strong>${name}</strong>,</p>

          <div style="margin:16px 0;">
            ${messageHtml}
            ${notesHtml}
          </div>

          <!-- due date block -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr>
              <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 18px;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Due date &amp; time</p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${dueLabel}</p>
              </td>
            </tr>
          </table>

          <!-- company row -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Company</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${reminder.company}</p>
              </td>
              ${reminder.category ? `
              <td width="4px"></td>
              <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Category</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${reminder.category}</p>
              </td>` : ''}
            </tr>
          </table>

          ${urlHtml}

        </td></tr>

        <!-- footer -->
        <tr><td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 12px 12px;border-top:none;padding:16px 32px;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
            Sent by <strong style="color:#6B7280;">Timingo Tech Reminders</strong> &nbsp;·&nbsp; <a href="https://timingotech.com/reminders" style="color:#6675F7;text-decoration:none;">Manage reminders</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function describeOffset(offsetMinutes) {
  if (offsetMinutes === 0) return 'right now';
  if (offsetMinutes % 1440 === 0) {
    const days = offsetMinutes / 1440;
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }
  if (offsetMinutes % 60 === 0) {
    const hours = offsetMinutes / 60;
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `in ${offsetMinutes} minutes`;
}

// Sent immediately when a reminder is created.
async function sendCreatedEmail(reminder) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
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
          html: buildEmailHtml({ reminder, name, dueLabel, isCreated: true }),
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
  'priority',
  'category',
  'url',
  'custom_email_body',
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
      const {
        company, person_names, person_emails, title, notes, due_at,
        remind_offsets_minutes, priority, category, url, custom_email_body,
      } = req.body || {};

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
          priority: priority || 'medium',
          category: category || null,
          url: url || null,
          custom_email_body: custom_email_body || null,
        })
        .select()
        .single();

      if (error) throw error;

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

      // Changing the due date means past notifications no longer apply — reset so they fire on the new schedule.
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
