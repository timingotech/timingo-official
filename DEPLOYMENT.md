# Email Setup & Deployment Guide

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
     - Value: `re_JRn1Ku9c_65t4wYW4stBfhNKrjxGHksxb`
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
