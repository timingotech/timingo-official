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
  const { name, email, phone, industry } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields: name, email' });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone || 'Not provided'),
    industry: escapeHtml(industry || 'Not specified'),
  };

  try {
    const adminResult = await resend.emails.send({
      from: `TimingoFlow <${fromEmail}>`,
      to: adminEmail,
      subject: `New TimingoFlow demo request from ${safe.name}`,
      html: `<h3>New TimingoFlow Demo Booking</h3>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Industry:</strong> ${safe.industry}</p>
        <hr/>
        <p><em>Follow up with this lead to schedule their 10-minute demo.</em></p>
      `,
    });

    if (adminResult.error) {
      console.error('Resend API error:', adminResult.error);
      return res.status(500).json({ error: 'Email service error' });
    }

    try {
      const userEmail = await resend.emails.send({
        from: `TimingoFlow <${fromEmail}>`,
        to: email,
        subject: 'Your TimingoFlow demo request',
        html: `<p>Hi ${safe.name},</p>
          <p>Thanks for your interest in TimingoFlow. We've received your demo request and will get back to you within 24 hours to schedule your 10-minute demo.</p>
          <p>In the meantime, feel free to reply to this email if you have any questions.</p>
          <p>Best regards,<br/>${escapeHtml(fromName)} Team</p>
        `,
      });
      console.log('User confirmation sent:', userEmail?.id);
    } catch (replyErr) {
      console.error('Demo auto-reply error:', replyErr);
    }

    return res.status(200).json({
      ok: true,
      emailId: adminResult.id,
      message: 'Demo request submitted successfully',
    });
  } catch (err) {
    console.error('Demo email error:', err);
    return res.status(500).json({ error: 'Failed to send demo request' });
  }
}
