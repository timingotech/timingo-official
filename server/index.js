require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic rate limiter to prevent abuse
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use(limiter);

// Simple transporter using SMTP credentials from env
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = (process.env.SMTP_SECURE === 'true' || port === 465);

  // Optionally allow self-signed certificates (useful for some SMTP/TLS setups or corporate proxies)
  const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === 'true';

  const transportOptions = {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  if (allowSelfSigned) {
    transportOptions.tls = { rejectUnauthorized: false };
  }

  // For explicit TLS on port 587 ensure STARTTLS is used
  if (!secure && port === 587) {
    transportOptions.requireTLS = true;
  }

  return nodemailer.createTransport(transportOptions);
}

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, service_interest, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  const transporter = createTransporter();

  const adminMailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New contact from ${name} (${email})`,
    html: `<h3>New contact submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Service Interest:</strong> ${service_interest || 'N/A'}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);

    // Optionally send auto-reply to user
    if (process.env.SEND_AUTOREPLY === 'true') {
      const replyOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: `Thanks for contacting ${process.env.FROM_NAME}`,
        text: `Hi ${name},\n\nThanks for reaching out. We'll review your message and get back to you within 24 hours.\n\nBest regards,\n${process.env.FROM_NAME}`,
      };
      transporter.sendMail(replyOptions).catch((err) => console.error('Auto-reply error:', err));
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Contact email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// Simple subscribers storage (file)
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');
function loadSubscribers() {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}
function saveSubscribers(list) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2));
}

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const subscribers = loadSubscribers();
  if (subscribers.find(s => s.email === email)) {
    return res.status(200).json({ ok: true, message: 'Already subscribed' });
  }

  const newSub = { email, created_at: new Date().toISOString() };
  subscribers.push(newSub);
  try {
    saveSubscribers(subscribers);
  } catch (e) {
    console.error('Failed to save subscriber', e);
  }

  // send welcome email
  const transporter = createTransporter();
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Thanks for subscribing to ${process.env.FROM_NAME}`,
    text: `Thanks for subscribing! We'll keep you updated with our latest news and insights.`,
  };

  transporter.sendMail(mailOptions).catch(err => console.error('Subscribe email error:', err));

  return res.json({ ok: true });
});

// Demo booking endpoint for TimingoFlow
app.post('/api/demo', async (req, res) => {
  const { name, email, phone, industry } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields: name, email' });
  }

  const transporter = createTransporter();

  const adminMailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚀 New TimingoFlow Demo Request from ${name}`,
    html: `<h3>New TimingoFlow Demo Booking</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Industry:</strong> ${industry || 'Not specified'}</p>
      <hr/>
      <p><em>Follow up with this lead to schedule their 10-minute demo!</em></p>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);

    // Send confirmation to user
    if (process.env.SEND_AUTOREPLY === 'true') {
      const replyOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: 'Your TimingoFlow Demo Request',
        html: `<p>Hi ${name},</p>
          <p>Thanks for your interest in TimingoFlow! We've received your demo request and will get back to you within 24 hours to schedule your 10-minute demo.</p>
          <p>In the meantime, feel free to reply to this email if you have any questions.</p>
          <p>Best regards,<br/>${process.env.FROM_NAME}</p>
        `,
      };
      transporter.sendMail(replyOptions).catch((err) => console.error('Demo auto-reply error:', err));
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Demo email error:', err);
    return res.status(500).json({ error: 'Failed to send demo request' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
