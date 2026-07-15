import { Resend } from 'resend';
import { escapeHtml, nl2br, getMailConfig } from './_security.js';

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

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { fromName, fromEmail, adminEmail: contactRecipient } = getMailConfig();

  const { name, email, phone, company, service_interest, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone || 'N/A'),
    company: escapeHtml(company || 'N/A'),
    serviceInterest: escapeHtml(service_interest || 'N/A'),
    message: nl2br(message),
  };

  try {
    // Send to admin
    const adminResult = await resend.emails.send({
      from: `${fromName} Contact <${fromEmail}>`,
      to: contactRecipient,
      reply_to: email,
      subject: `New contact from ${safe.name} (${safe.email})`,
      html: `<h3>New contact submission</h3>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Company:</strong> ${safe.company}</p>
        <p><strong>Service Interest:</strong> ${safe.serviceInterest}</p>
        <p><strong>Message:</strong><br/>${safe.message}</p>
      `,
    });

    if (adminResult.error) {
      console.error('Resend API error:', adminResult.error);
      return res.status(500).json({ error: 'Email service error' });
    }

    // Send auto-reply to user
    try {
      const userEmail = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        reply_to: contactRecipient,
        subject: `Thanks for contacting ${fromName}`,
        html: `<p>Hi ${safe.name},</p>
          <p>Thanks for reaching out. We'll review your message and get back to you within 24 hours.</p>
          <p>Best regards,<br/>${escapeHtml(fromName)} Team</p>
        `,
      });
      console.log('User auto-reply sent:', userEmail?.id);
    } catch (replyErr) {
      console.error('Auto-reply error:', replyErr);
    }

    return res.status(200).json({ ok: true, emailId: adminResult.id });
  } catch (err) {
    console.error('Contact email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
