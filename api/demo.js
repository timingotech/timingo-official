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

  console.log('Demo API called with body:', req.body);

  const resend = new Resend('re_gbdZsVDi_LR6jmfCi3QBTXqWwbqrJi7kg');

  const { name, email, phone, industry } = req.body || {};

  if (!name || !email) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields: name, email' });
  }

  console.log('Attempting to send emails for:', { name, email, phone, industry });

  try {
    // Send to admin
    const adminEmail = await resend.emails.send({
      from: 'TimingoFlow <team@timingotech.com>',
      to: 'team@timingotech.com',
      subject: `🚀 New TimingoFlow Demo Request from ${name}`,
      html: `<h3>New TimingoFlow Demo Booking</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Industry:</strong> ${industry || 'Not specified'}</p>
        <hr/>
        <p><em>Follow up with this lead to schedule their 10-minute demo!</em></p>
      `,
    });

    console.log('Admin email response:', JSON.stringify(adminEmail, null, 2));

    if (adminEmail.error) {
      console.error('Resend API error:', adminEmail.error);
      return res.status(500).json({ 
        error: 'Email service error', 
        details: adminEmail.error,
        debug: { name, email, phone, industry }
      });
    }

    // Send confirmation to user
    try {
      const userEmail = await resend.emails.send({
        from: 'TimingoFlow <team@timingotech.com>',
        to: email,
        subject: 'Your TimingoFlow Demo Request',
        html: `<p>Hi ${name},</p>
          <p>Thanks for your interest in TimingoFlow! We've received your demo request and will get back to you within 24 hours to schedule your 10-minute demo.</p>
          <p>In the meantime, feel free to reply to this email if you have any questions.</p>
          <p>Best regards,<br/>TimingoTech Team</p>
        `,
      });
      console.log('User confirmation sent:', userEmail);
    } catch (replyErr) {
      console.error('Demo auto-reply error:', replyErr);
    }

    console.log('Returning success response with emailId:', adminEmail.id);
    return res.status(200).json({ 
      ok: true, 
      emailId: adminEmail.id,
      message: 'Demo request submitted successfully',
      debug: {
        adminEmailSent: !!adminEmail.id,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Demo email error:', err);
    console.error('Error details:', JSON.stringify(err, null, 2));
    return res.status(500).json({ 
      error: 'Failed to send demo request', 
      details: err.message || String(err),
      stack: err.stack
    });
  }
}
