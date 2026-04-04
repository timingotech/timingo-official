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

  console.log('Subscribe API called with body:', req.body);

  const resend = new Resend('re_gbdZsVDi_LR6jmfCi3QBTXqWwbqrJi7kg');

  const { email } = req.body || {};
  
  if (!email) {
    console.log('Email is required');
    return res.status(400).json({ error: 'Email is required' });
  }

  console.log('Attempting to send welcome email to:', email);

  try {
    // Send welcome email
    const welcomeEmail = await resend.emails.send({
      from: 'TimingoTech Newsletter <team@timingotech.com>',
      to: email,
      subject: 'Thanks for subscribing to TimingoTech',
      html: `<p>Thanks for subscribing!</p>
        <p>We'll keep you updated with our latest news, insights, and innovations.</p>
        <p>Best regards,<br/>TimingoTech Team</p>
      `,
    });

    console.log('Welcome email sent:', welcomeEmail);

    // Also notify admin about new subscriber
    try {
      const adminEmail = await resend.emails.send({
        from: 'TimingoTech Newsletter <team@timingotech.com>',
        to: 'team@timingotech.com',
        subject: '📬 New Newsletter Subscriber',
        html: `<p>New subscriber: <strong>${email}</strong></p>
          <p>Subscribed at: ${new Date().toISOString()}</p>
        `,
      });
      console.log('Admin notification sent:', adminEmail);
    } catch (notifyErr) {
      console.error('Admin notification error:', notifyErr);
    }

    return res.status(200).json({ ok: true, message: 'Successfully subscribed', emailId: welcomeEmail.id });
  } catch (err) {
    console.error('Subscribe email error:', err);
    return res.status(500).json({ error: 'Failed to subscribe', details: err.message || String(err) });
  }
}
