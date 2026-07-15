import { Resend } from 'resend';
import { escapeHtml, getMailConfig } from './_security.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { fromName, fromEmail, adminEmail } = getMailConfig();
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const safeEmail = escapeHtml(email);

  try {
    const welcomeEmail = await resend.emails.send({
      from: `${fromName} Newsletter <${fromEmail}>`,
      to: email,
      subject: `Thanks for subscribing to ${fromName}`,
      html: `<p>Thanks for subscribing.</p>
        <p>We'll keep you updated with our latest news, insights, and product updates.</p>
        <p>Best regards,<br/>${escapeHtml(fromName)} Team</p>
      `,
    });

    try {
      const adminResult = await resend.emails.send({
        from: `${fromName} Newsletter <${fromEmail}>`,
        to: adminEmail,
        subject: 'New newsletter subscriber',
        html: `<p>New subscriber: <strong>${safeEmail}</strong></p>
          <p>Subscribed at: ${escapeHtml(new Date().toISOString())}</p>
        `,
      });
      console.log('Admin notification sent:', adminResult?.id);
    } catch (notifyErr) {
      console.error('Admin notification error:', notifyErr);
    }

    return res.status(200).json({ ok: true, message: 'Successfully subscribed', emailId: welcomeEmail.id });
  } catch (err) {
    console.error('Subscribe email error:', err);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
