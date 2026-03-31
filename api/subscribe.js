import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// For Vercel, we'll use environment variable or temp storage
// In production, you'd want to use a database
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email } = req.body || {};
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Send welcome email
    await resend.emails.send({
      from: 'TimingoTech <team@timingotech.com>',
      to: email,
      subject: 'Thanks for subscribing to TimingoTech',
      html: `<p>Thanks for subscribing!</p>
        <p>We'll keep you updated with our latest news, insights, and innovations.</p>
        <p>Best regards,<br/>TimingoTech Team</p>
      `,
    });

    // Also notify admin about new subscriber
    try {
      await resend.emails.send({
        from: 'TimingoTech <team@timingotech.com>',
        to: 'team@timingotech.com',
        subject: '📬 New Newsletter Subscriber',
        html: `<p>New subscriber: <strong>${email}</strong></p>
          <p>Subscribed at: ${new Date().toISOString()}</p>
        `,
      });
    } catch (notifyErr) {
      console.error('Admin notification error:', notifyErr);
    }

    return res.status(200).json({ ok: true, message: 'Successfully subscribed' });
  } catch (err) {
    console.error('Subscribe email error:', err);
    return res.status(500).json({ error: 'Failed to subscribe', details: err.message });
  }
}
