export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function nl2br(value) {
  return escapeHtml(value).replace(/\r?\n/g, '<br/>');
}

export function requireSharedSecret(req, res, envName = 'REMINDERS_AUTH_TOKEN') {
  const configured = process.env[envName] || process.env.CRON_SECRET;
  const provided =
    req.headers['x-reminders-auth'] ||
    req.headers['x-internal-auth'] ||
    req.query?.token;

  if (!configured || provided !== configured) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

export function getMailConfig() {
  return {
    fromName: process.env.FROM_NAME || 'TimingoTech',
    fromEmail: process.env.FROM_EMAIL || 'team@timingotech.com',
    adminEmail: process.env.ADMIN_EMAIL || 'team@timingotech.com',
  };
}
