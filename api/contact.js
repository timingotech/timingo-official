import { Resend } from 'resend';

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

  console.log('Contact API called with body:', req.body);

  const resend = new Resend('re_gbdZsVDi_LR6jmfCi3QBTXqWwbqrJi7kg');

  const { name, email, phone, company, service_interest, message } = req.body || {};

  if (!name || !email || !message) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  console.log('Attempting to send contact emails for:', { name, email });

  try {
    // Send to admin
    const adminEmail = await resend.emails.send({
      from: 'TimingoTech Contact <onboarding@resend.dev>',
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

    console.log('Admin email response:', JSON.stringify(adminEmail, null, 2));

    if (adminEmail.error) {
      console.error('Resend API error:', adminEmail.error);
      return res.status(500).json({ 
        error: 'Email service error', 
        details: adminEmail.error
      });
    }

    // Send auto-reply to user
    try {
      const userEmail = await resend.emails.send({
        from: 'TimingoTech <onboarding@resend.dev>',
        to: email,
        subject: 'Thanks for contacting TimingoTech',
        html: `<p>Hi ${name},</p>
          <p>Thanks for reaching out. We'll review your message and get back to you within 24 hours.</p>
          <p>Best regards,<br/>TimingoTech Team</p>
        `,
      });
      console.log('User auto-reply sent:', userEmail);
    } catch (replyErr) {
      console.error('Auto-reply error:', replyErr);
    }

    return res.status(200).json({ ok: true, emailId: adminEmail.id });
  } catch (err) {
    console.error('Contact email error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err.message || String(err) });
  }
}
