# Resend Setup - Quick Reference Guide

## Step 1: Get Resend API Key (5 minutes)

1. Go to https://resend.com
2. Click "Sign Up"
3. Create account (free plan available)
4. Navigate to **Dashboard → API Keys**
5. Click **"Create API Key"**
6. Choose **Access Level: "Full"**
7. Copy the key (looks like: `re_xxxxxxxxxxxxxxxxxxxxx`)
8. Keep this safe! ✅

---

## Step 2: Verify Sender Email (5 minutes)

### Option A: Use Default (for testing)
- Use: `onboarding@resend.dev`
- No verification needed
- Good for testing only
- Set in Railway as `EMAIL_FROM`

### Option B: Verify Custom Domain (for production)
1. In Resend dashboard → **Domains**
2. Click **"Add Domain"**
3. Enter your verified domain (e.g., `leads@jajdconstruction.com`)
4. Add DNS records Resend provides
5. Wait for verification (usually instant)
6. Use verified email as `EMAIL_FROM`

---

## Step 3: Configure Railway Backend

1. Open Railway dashboard → Your jajd-construction-backend project
2. Click **Variables**
3. Add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_xxxxx...` | From Step 1 |
| `EMAIL_FROM` | `leads@jajdconstruction.com` | Verified domain sender |
| `RECEIVER_EMAIL` | `jajdconstruction@gmail.com` | Your inbox (receives admin notifications) |
| `COMPANY_NAME` | `JAJD Construction` | Optional (for email templates) |
| `NODE_ENV` | `production` | Recommended for clarity |

4. Click **Deploy** to apply changes

---

## Step 4: Test Form Submission

### Test Flow
1. Open Vercel frontend URL
2. Fill out quote form:
   - Property: Residential or Commercial
   - ZIP: 10001 (or your ZIP)
   - Project Size: Small/Medium/Large
   - Project Type: (any option)
   - Name: Test User
   - Phone: (555) 123-4567
   - Email: your-test-email@gmail.com
3. Click **Submit Request**
4. Should see **"Project Logged!"** success message
5. Check your inbox (might take 10-30 seconds)

### Expected Emails

**Email 1: Admin Notification**
- From: Your EMAIL_FROM
- To: RECEIVER_EMAIL (your inbox)
- Subject: `New Lead: Test User - Residential Full Remodel / Renovation`
- Contains: All lead details

**Email 2: Customer Confirmation**
- From: Your EMAIL_FROM
- To: your-test-email@gmail.com
- Subject: `We received your request - JAJD Construction`
- Contains: Confirmation message, timeline expectation

---

## Step 5: Verify Everything Works

### Backend Logs Check
1. Open Railway → Backend project
2. Click **Deployments → Current**
3. Scroll to **Logs**
4. Look for:
   ```
   🚀 Starting JAJD Backend Server...
   ✅ Resend API key configured
   🌍 Server bound to 0.0.0.0
   🚀 Backend running on port 5001
   ```

### After Form Submission, Look For:
```
📩 Lead received: { name: 'Test User', email: 'test@example.com', phone: '(555) 123-4567', zip: '10001' }
📧 Processing lead email...
✅ Admin email sent to: jajdconstruction@gmail.com
✅ Customer confirmation email sent to: test@example.com
```

### Frontend Logs Check
1. Open Vercel frontend in browser
2. Open **DevTools → Console**
3. Should see:
   ```
   🔌 API_BASE: https://jajd-construction-production.up.railway.app
   📨 Submitting lead to: https://jajd-construction-production.up.railway.app/api/lead
   📊 Response status: 200 Data: { success: true, message: 'Lead received successfully.' }
   ```

---

## Troubleshooting

### "Failed to Fetch" Error
```
Problem: Frontend can't reach backend
Solution:
1. Verify VITE_API_URL in Vercel is set to your Railway URL
2. Check Railway backend is running (green status)
3. Try URL directly in browser: https://your-railway-url/health
4. Should see: { "status": "Backend is running", "timestamp": "..." }
```

### Email Not Received
```
Problem: Form submits but no email arrives
Solution:
1. Check Railway logs for email error messages
2. Verify RESEND_API_KEY is set in Railway variables
3. Verify EMAIL_FROM is valid Resend email
4. Check RECEIVER_EMAIL is correct (should be your real email)
5. Wait 30 seconds (Resend sometimes slow)
6. Check spam/junk folder
```

### Email Sends to Admin But Not Customer
```
Problem: Admin gets notification, but customer doesn't get confirmation
Solution:
1. Check customer email in form (typo?)
2. Check Resend logs in Resend dashboard
3. Verify RESEND_API_KEY is still valid (not rate-limited)
4. Test with different email address
```

### "Missing required fields" Error
```
Problem: Form submission returns error
Solution:
1. Check all fields filled (name, email, phone, zip)
2. Verify email format is correct
3. Verify ZIP is exactly 5 digits
4. Check browser console for payload being sent
```

---

## Monitoring & Next Steps

### Check Email Delivery
- Resend Dashboard → **Emails**
- See all sent emails, delivery status, bounces
- Monitor for issues

### Set Up Email Domain
- If using custom domain, configure SPF/DKIM/DMARC for deliverability
- Guide: https://resend.com/docs/domains

### Scale & Limits
- Free Resend account: 100 emails/day
- After that: move to paid plan (pay-as-you-go)
- No setup fees, very affordable

### Analytics
- Track email opens, clicks, bounces
- Set up webhooks for real-time notifications
- See Resend docs for implementation

---

## Quick Command Reference

### Test Health Endpoint
```bash
curl https://your-railway-url/health
# Expected: { "status": "Backend is running", "timestamp": "..." }
```

### Test Lead Endpoint (requires correct headers)
```bash
curl -X POST https://your-railway-url/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"5551234567","zip":"10001","property":"Residential","project":"Full Remodel","size":"Medium"}'
# Expected: { "success": true, "message": "Lead received successfully." }
```

---

## Support Resources

- **Resend Docs**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference
- **Email Templates**: https://react.email (for future improvements)
- **Our Codebase**: See `backend/server.ts` for implementation

---

## Summary Checklist

```
✅ Resend account created
✅ API key generated
✅ Email verified (or using onboarding@resend.dev)
✅ Railway variables set (RESEND_API_KEY, EMAIL_FROM, RECEIVER_EMAIL)
✅ Backend deployed with new variables
✅ Frontend deployed (connected to Railway backend)
✅ Test form submission completed
✅ Admin email received
✅ Customer confirmation email received
✅ Logs show successful email sends
✅ Ready for production!

Next: Monitor inbox for real leads, scale as needed! 🚀
```

---

**Setup Time**: ~15 minutes
**Difficulty**: Easy
**Status**: Ready to Go! ✅
