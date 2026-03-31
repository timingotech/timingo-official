import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, service_interest, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  try {
    // Send to admin
    await resend.emails.send({
      from: 'TimingoTech <team@timingotech.com>',
      to: 'team@timingotech.com',
      subject: `New contact from ${name} (${email})`,
      html: `<h3>New contact submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service_interest || 'N/A'}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // Send auto-reply to user
    try {
      await resend.emails.send({
        from: 'TimingoTech <team@timingotech.com>',
        to: email,
        subject: 'Thanks for contacting TimingoTech',
        html: `<p>Hi ${name},</p>
          <p>Thanks for reaching out. We'll review your message and get back to you within 24 hours.</p>
          <p>Best regards,<br/>TimingoTech Team</p>
        `,
      });
    } catch (replyErr) {
      console.error('Auto-reply error:', replyErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact email error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
}
