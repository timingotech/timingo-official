import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Hit on a schedule by an external cron pinger (see DEPLOYMENT.md).
// Looks for reminders whose notification offsets have come due and emails the attached person.
export default async function handler(req, res) {
  const token = (req.query && req.query.token) || req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Reminders storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_KEY)' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const now = new Date();
  // Only pull reminders whose due date is within the next two days — keeps the scan cheap.
  const horizon = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('completed', false)
    .lte('due_at', horizon.toISOString());

  if (error) {
    console.error('Failed to load reminders for check:', error);
    return res.status(500).json({ error: error.message });
  }

  let emailsSent = 0;

  for (const reminder of reminders || []) {
    const dueAt = new Date(reminder.due_at);
    const offsets = reminder.remind_offsets_minutes || [];
    const sentOffsets = reminder.sent_offsets || [];
    const newlySent = [];

    for (const offsetMinutes of offsets) {
      if (sentOffsets.includes(offsetMinutes)) continue;
      const triggerAt = new Date(dueAt.getTime() - offsetMinutes * 60 * 1000);
      if (now >= triggerAt && now <= dueAt) {
        // eslint-disable-next-line no-await-in-loop
        await sendReminderEmail(resend, reminder, offsetMinutes);
        newlySent.push(offsetMinutes);
        emailsSent += 1;
      }
    }

    // Past the due time and never notified at "0" — send one final "this is due now" email.
    if (now > dueAt && !sentOffsets.includes(0) && !newlySent.includes(0)) {
      // eslint-disable-next-line no-await-in-loop
      await sendReminderEmail(resend, reminder, 0);
      newlySent.push(0);
      emailsSent += 1;
    }

    if (newlySent.length) {
      // eslint-disable-next-line no-await-in-loop
      await supabase
        .from('reminders')
        .update({ sent_offsets: [...sentOffsets, ...newlySent] })
        .eq('id', reminder.id);
    }
  }

  return res.status(200).json({ ok: true, checked: (reminders || []).length, emailsSent });
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

async function sendReminderEmail(resend, reminder, offsetMinutes) {
  const dueLabel = new Date(reminder.due_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const when = describeOffset(offsetMinutes);

  try {
    await resend.emails.send({
      from: `${process.env.FROM_NAME || 'TimingoTech Reminders'} <${process.env.FROM_EMAIL}>`,
      to: reminder.person_email,
      subject: offsetMinutes === 0
        ? `Due now: ${reminder.title}`
        : `Reminder (${when}): ${reminder.title}`,
      html: `<p>Hi ${reminder.person_name},</p>
        <p>This is a reminder for <strong>${reminder.company}</strong>${offsetMinutes === 0 ? ', due right now' : `, due ${when}`}:</p>
        <h3 style="margin: 8px 0;">${reminder.title}</h3>
        ${reminder.notes ? `<p>${reminder.notes}</p>` : ''}
        <p><strong>Due:</strong> ${dueLabel}</p>
        <p style="color:#888; font-size: 12px;">Sent by Timingo Tech Reminders</p>
      `,
    });
  } catch (err) {
    console.error(`Failed to send reminder email for ${reminder.id} (offset ${offsetMinutes}):`, err);
  }
}
