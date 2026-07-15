# Email Setup & Deployment Guide

## 🚨 CRITICAL: Fix 500 Errors

If you're seeing **500 errors** on `/api/demo`, `/api/contact`, or `/api/subscribe`, it means:

### ❌ Problem: Environment Variable Not Set

**YOU MUST ADD THE API KEY TO VERCEL:**

1. Go to https://vercel.com/your-project/settings/environment-variables
2. Click **Add New**
3. Enter:
   - **Key:** `RESEND_API_KEY`
   - **Value:** your newly rotated Resend API key
   - **Environments:** Check ALL (Production, Preview, Development)
4. Click **Save**
5. **REQUIRED:** Go to **Deployments** tab → Click **Redeploy** on latest deployment

### ❌ Problem: 404 Errors on Page Reload

**FIXED:** Updated `vercel.json` to handle React Router properly. After your next deployment, reloading pages will work.

---

## ✅ Email Configuration Completed

Your website now uses **Resend** for all email sending with `team@timingotech.com`.

### API Endpoints Created:
- ✅ `/api/contact` - Contact form submissions
- ✅ `/api/subscribe` - Newsletter subscriptions  
- ✅ `/api/demo` - TimingoFlow demo bookings

All emails are sent to: **team@timingotech.com**

---

## 🚀 Deployment Instructions

### For Vercel (Recommended):

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add Vercel API routes with Resend"
   git push
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add Environment Variable:
     - Key: `RESEND_API_KEY`
     - Value: your newly rotated Resend API key
   - Deploy!

4. **Verify Resend Domain:**
   - Go to [resend.com/domains](https://resend.com/domains)
   - Add domain: `timingotech.com`
   - Follow DNS verification instructions
   - Once verified, you can send from `team@timingotech.com`

---

## 🧪 Testing Locally

### Option 1: Test Frontend + API Routes
```bash
npm install
npm start
```
Frontend runs on http://localhost:3000
API routes won't work locally (they need Vercel runtime)

### Option 2: Test Backend Server
```bash
cd server
npm install
npm start
```
Backend runs on http://localhost:5000

Then start frontend:
```bash
npm start
```
Frontend will proxy API calls to backend via `"proxy": "http://localhost:5000"`

---

## 🔔 Internal Reminders Page (`/reminders`)

A simple internal tool for creating reminders tied to a person/company, with
automatic email nudges sent ahead of the due date (e.g. 1 day before, 1 hour
before, 10 minutes before, etc).

It's gated by a basic login screen — **not real authentication**, just a
soft barrier so it isn't open to the public. Both the login and password are
the server-side `REMINDERS_AUTH_TOKEN`. Do not put sensitive data behind the
old client-only gate; it has been replaced with a server-enforced shared secret.

### 1. Create the database (Supabase, free tier)
1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](../supabase/schema.sql), and run it. This creates the `reminders` and `push_subscriptions` tables.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **`service_role` secret key** → `SUPABASE_SERVICE_KEY` (keep this secret — it bypasses row-level security, which is fine here since only your serverless functions use it)

### 2. Add environment variables to Vercel
In your Vercel project settings → Environment Variables, add:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `REMINDERS_AUTH_TOKEN` — a random secret required by `/api/reminders` and `/api/push-subscribe`. Use the same random generation approach as `CRON_SECRET`.
- `CRON_SECRET` — any random string. Generate one locally with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
  ```
  This protects `/api/reminders-check` so random visitors can't trigger emails.

Make sure `RESEND_API_KEY`, `FROM_NAME`, and `FROM_EMAIL` are also set (used for the contact/demo/subscribe flows already, and reused here for reminder emails).

Redeploy after adding the variables.

### 3. Schedule the reminder checker
`/api/reminders-check` looks for due reminders and sends emails, but it only
runs when something pings it — it doesn't run on its own. Use a free external
cron service so it gets checked every few minutes regardless of your Vercel plan:

1. Sign up at [cron-job.org](https://cron-job.org) (free).
2. Create a new cron job:
   - **URL:** `https://www.timingotech.com/api/reminders-check?token=YOUR_CRON_SECRET`
   - **Schedule:** every 5 minutes (this gives roughly 5-minute precision on "X minutes before" reminders)
3. Save and enable it.

That's it — reminders created on `/reminders` will now email the attached
person automatically as their due time approaches.

### 4. (Optional) Browser push notifications

In addition to email, `/reminders` can send a native-style push notification
straight to your phone or laptop — useful if you've added the page to your iOS
home screen (Settings → Share → Add to Home Screen). It's powered by the
standard, **free** Web Push API (no third-party push service or paid plan
needed — it routes through Apple/Google/Mozilla's own free push infrastructure).

1. Generate a VAPID keypair (one-time):
   ```bash
   node -e "const wp=require('web-push'); const k=wp.generateVAPIDKeys(); console.log('PUBLIC:',k.publicKey); console.log('PRIVATE:',k.privateKey);"
   ```
2. Add these to Vercel's Environment Variables:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT` — e.g. `mailto:team@timingotech.com`
   - `REACT_APP_VAPID_PUBLIC_KEY` — **same value as `VAPID_PUBLIC_KEY`**. The `REACT_APP_` prefix is required so Create React App bakes the public key into the browser bundle at build time.
3. Redeploy. Then open `/reminders` on your device, sign in, and tap **"Enable notifications"** in the header — your browser will ask for permission, and the device will start receiving push alerts at the same offsets as the emails (1 day / 1 hour / 10 min before, etc).

Notes:
- iOS only supports this for sites **added to the home screen** (iOS 16.4+) — a normal Safari tab can't receive push notifications.
- If you ever want to turn it off, tap the same button again ("Notifications on" → off) — this removes the subscription from the database too.
- Expired/unsubscribed devices are pruned automatically the next time a send fails.

---

## 📧 Email Flows

### Contact Form:
- User fills contact form → Email sent to `team@timingotech.com`
- Auto-reply sent to user confirming receipt

### Newsletter Subscribe:
- User subscribes → Welcome email sent to user
- Notification email sent to `team@timingotech.com`

### Demo Booking:
- User books demo → Email sent to `team@timingotech.com`
- Confirmation email sent to user

---

## 🔧 Troubleshooting

### 405 Errors in Production:
- **Cause:** API routes not deployed or environment variable missing
- **Fix:** 
  1. Ensure `/api` folder is committed to git
  2. Add `RESEND_API_KEY` to Vercel environment variables
  3. Redeploy

### Emails Not Sending:
- **Cause:** Domain not verified in Resend
- **Fix:** Verify `timingotech.com` in Resend dashboard

### Testing Email Locally:
- Backend server method works with any environment
- Vercel API routes only work when deployed to Vercel

---

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Test locally with backend server (see above)
3. ✅ Commit and push to GitHub
4. ✅ Deploy to Vercel
5. ✅ Add RESEND_API_KEY environment variable
6. ✅ Verify domain in Resend
7. ✅ Test all forms on production site
