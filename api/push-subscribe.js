import { createClient } from '@supabase/supabase-js';
import { requireSharedSecret } from './_security.js';

function getClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Stores/removes browser push subscriptions for the /reminders "notify this device" toggle.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Reminders-Auth, X-Internal-Auth');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireSharedSecret(req, res)) {
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Reminders storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_KEY)' });
  }

  const supabase = getClient();

  try {
    const { subscription } = req.body || {};
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'A valid push subscription is required' });
    }

    if (req.method === 'POST') {
      const { error } = await supabase.from('push_subscriptions').upsert(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        { onConflict: 'endpoint' }
      );
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('push-subscribe error:', err);
    return res.status(500).json({ error: err.message || 'Unexpected error' });
  }
}
