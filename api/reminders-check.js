import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import webpush from 'web-push';

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

async function sendReminderEmail(resend, reminder, offsetMinutes) {
  // Note: `dateStyle`/`timeStyle` can't be combined with `timeZoneName` (Intl throws), so spell out the parts.
  const dueLabel = new Date(reminder.due_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const when = describeOffset(offsetMinutes);
  const emails = reminder.person_emails || [];
  const names = reminder.person_names || [];

  await Promise.all(
    emails.map(async (email, i) => {
      const name = names[i] || email;
      try {
        await resend.emails.send({
          from: `${process.env.FROM_NAME || 'TimingoTech Reminders'} <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: offsetMinutes === 0
            ? `Due now: ${reminder.title}`
            : `Reminder (${when}): ${reminder.title}`,
          html: `<p>Hi ${name},</p>
            <p>This is a reminder for <strong>${reminder.company}</strong>${offsetMinutes === 0 ? ', due right now' : `, due ${when}`}:</p>
            <h3 style="margin: 8px 0;">${reminder.title}</h3>
            ${reminder.notes ? `<p>${reminder.notes}</p>` : ''}
            <p><strong>Due:</strong> ${dueLabel}</p>
            <p style="color:#888; font-size: 12px;">Sent by Timingo Tech Reminders</p>
          `,
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
