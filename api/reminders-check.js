import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import webpush from 'web-push';
import { escapeHtml, nl2br } from './_security.js';

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:team@timingotech.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

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

  let pushSubscriptions = [];
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    const { data: subs, error: subsError } = await supabase.from('push_subscriptions').select('*');
    if (subsError) {
      console.error('Failed to load push subscriptions:', subsError);
    } else {
      pushSubscriptions = subs || [];
    }
  }

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

  let notificationsSent = 0;

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
        await Promise.all([
          sendReminderEmail(resend, reminder, offsetMinutes),
          sendPushNotifications(supabase, pushSubscriptions, reminder, offsetMinutes),
        ]);
        newlySent.push(offsetMinutes);
        notificationsSent += 1;
      }
    }

    // Past the due time and never notified at "0" — send one final "this is due now" email.
    if (now > dueAt && !sentOffsets.includes(0) && !newlySent.includes(0)) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.all([
        sendReminderEmail(resend, reminder, 0),
        sendPushNotifications(supabase, pushSubscriptions, reminder, 0),
      ]);
      newlySent.push(0);
      notificationsSent += 1;
    }

    if (newlySent.length) {
      // eslint-disable-next-line no-await-in-loop
      await supabase
        .from('reminders')
        .update({ sent_offsets: [...sentOffsets, ...newlySent] })
        .eq('id', reminder.id);
    }
  }

  return res.status(200).json({ ok: true, checked: (reminders || []).length, notificationsSent });
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

function buildEmailHtml({ reminder, name, dueLabel, offsetMinutes }) {
  const when        = describeOffset(offsetMinutes);
  const accentColor = offsetMinutes === 0 ? '#e53e3e' : '#F7666F';
  const safeTitle = escapeHtml(reminder.title);
  const safeCompany = escapeHtml(reminder.company);
  const safeCategory = escapeHtml(reminder.category || '');
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(reminder.url || '');
  const badgeText   = offsetMinutes === 0 ? '⚡ Due Right Now' : `⏰ Due ${when}`;

  const messageHtml = reminder.custom_email_body
    ? `<p style="margin:0 0 16px;color:#374151;line-height:1.6;">${nl2br(reminder.custom_email_body)}</p>`
    : `<p style="margin:0 0 16px;color:#374151;line-height:1.6;">This is your reminder for <strong style="color:#111827;">${safeCompany}</strong>${offsetMinutes === 0 ? ' - it is due <strong>right now</strong>' : `, due <strong>${when}</strong>`}.</p>`;

  const notesHtml = reminder.notes
    ? `<div style="margin:16px 0;padding:14px 16px;background:#F9FAFB;border-left:3px solid #D1D5DB;border-radius:4px;">
        <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">${nl2br(reminder.notes)}</p>
       </div>`
    : '';

  const urlHtml = reminder.url
    ? `<p style="margin:12px 0 0;"><a href="${safeUrl}" style="color:#6675F7;font-size:13px;text-decoration:none;">View reference link</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${safeTitle}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <tr><td style="background:linear-gradient(135deg,#F7666F,#6675F7);border-radius:12px 12px 0 0;padding:24px 32px;">
          <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.05em;color:rgba(255,255,255,0.8);text-transform:uppercase;">Timingo Tech Reminders</p>
          <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;">${safeTitle}</p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:28px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
          <p style="margin:0 0 20px;">
            <span style="display:inline-block;padding:6px 14px;background:${accentColor}18;color:${accentColor};font-size:13px;font-weight:600;border-radius:20px;border:1px solid ${accentColor}33;">${badgeText}</span>
          </p>
          <p style="margin:0 0 4px;font-size:15px;color:#111827;">Hi <strong>${safeName}</strong>,</p>
          <div style="margin:16px 0;">${messageHtml}${notesHtml}</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr><td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 18px;">
              <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Due date &amp; time</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${dueLabel}</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Company</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${safeCompany}</p>
              </td>
              ${reminder.category ? `<td width="4px"></td>
              <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.06em;color:#9CA3AF;text-transform:uppercase;">Category</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${safeCategory}</p>
              </td>` : ''}
            </tr>
          </table>
          ${urlHtml}
        </td></tr>

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

async function sendReminderEmail(resend, reminder, offsetMinutes) {
  const dueLabel = new Date(reminder.due_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const when   = describeOffset(offsetMinutes);
  const emails = reminder.person_emails || [];
  const names  = reminder.person_names || [];

  await Promise.all(
    emails.map(async (email, i) => {
      const name = names[i] || email;
      try {
        await resend.emails.send({
          from: `${process.env.FROM_NAME || 'TimingoTech Reminders'} <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: offsetMinutes === 0 ? `Due now: ${reminder.title}` : `Reminder (${when}): ${reminder.title}`,
          html: buildEmailHtml({ reminder, name, dueLabel, offsetMinutes }),
        });
      } catch (err) {
        console.error(`Failed to send reminder email to ${email} for ${reminder.id} (offset ${offsetMinutes}):`, err);
      }
    })
  );
}

async function sendPushNotifications(supabase, subscriptions, reminder, offsetMinutes) {
  if (!subscriptions.length) return;

  const when = describeOffset(offsetMinutes);
  const payload = JSON.stringify({
    title: offsetMinutes === 0 ? `Due now: ${reminder.title}` : `Reminder (${when}): ${reminder.title}`,
    body: `${reminder.company} — ${reminder.title}`,
    tag: `reminder-${reminder.id}-${offsetMinutes}`,
    url: '/reminders',
  });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (err) {
        // 404/410 = the browser unsubscribed or the subscription expired — clean it up.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        } else {
          console.error(`Failed to send push notification to ${sub.endpoint}:`, err.body || err.message);
        }
      }
    })
  );
}
