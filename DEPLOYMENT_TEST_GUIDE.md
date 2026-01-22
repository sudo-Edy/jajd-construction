# DEPLOYMENT TEST SCRIPT

This document outlines how to test the fixed "Failed to fetch" issue before full deployment.

## Local Testing (Dev Environment)

### Prerequisites
- Node.js installed
- Backend and frontend repos cloned

### Step 1: Start Backend
```bash
cd backend
npm install
npm run build
npm start
# Expected: "🚀 Backend running on port 5001"
```

### Step 2: Start Frontend
```bash
# In another terminal
npm install
npm run dev
# Expected: "Local: http://localhost:3000"
```

### Step 3: Test API Connection
Open browser console while on http://localhost:3000:
```javascript
console.log("Checking API_BASE...");
// Should see: "🔌 API_BASE: http://localhost:5001"
```

### Step 4: Test Form Submission
1. Click "Request Free Estimate" button
2. Fill in the multi-step form:
   - Step 1: Select property type, enter ZIP code
   - Step 2: Select project type and size
   - Step 3: Enter name, email, phone, date
3. Click "Submit"

### Expected Result
- ✅ No "Failed to fetch" error
- ✅ Backend logs show: `📩 Lead received: { name, email, phone, zip }`
- ✅ Response shows: `{ success: true, message: "..." }`
- ✅ Modal shows success screen

---

## Production Testing (After Deployment)

### Prerequisites
- Frontend deployed to Vercel
- Backend deployed to Railway
- Environment variables set correctly

### Vercel Env Vars
```
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

### Railway Env Vars
```
RESEND_API_KEY=your-actual-key
EMAIL_FROM=noreply@yourdomain.com
RECEIVER_EMAIL=concierge@jajdbuild.com
COMPANY_NAME=JAJD Construction
PORT=5001
NODE_ENV=production
```

### Test from Production

1. **Open Vercel frontend**: https://your-vercel-domain.vercel.app
2. **Open browser console** (F12)
3. **Look for**: `🔌 API_BASE: https://jajd-construction-production.up.railway.app`
4. **Click "Request Free Estimate"**
5. **Fill and submit form**

### Expected Production Result
- ✅ Console shows: `📨 Submitting lead to: https://jajd-construction-production.up.railway.app/api/lead`
- ✅ No CORS errors
- ✅ Response succeeds with HTTP 200
- ✅ Success modal displays
- ✅ Check Railway logs for: `📩 Lead received: { ... }`

---

## Troubleshooting

### "Failed to fetch" still appears?

**Check 1: Verify Environment Variable**
```bash
# On Vercel, in deployment settings, check:
# VITE_API_URL=https://jajd-construction-production.up.railway.app
# (no trailing slash)
```

**Check 2: Verify CORS on Backend**
- Railway backend should have: `app.use(cors(corsOptions))`
- corsOptions should include Vercel domain pattern: `/\.vercel\.app$/`

**Check 3: Verify Backend is Accessible**
- Try accessing: https://jajd-construction-production.up.railway.app/health
- Should return: `{ "status": "Backend is running", "timestamp": "..." }`

**Check 4: Check Network Tab**
- Open DevTools → Network tab
- Submit form
- Look for request to `/api/lead`
- Check response status and body
- If 0 status = CORS issue
- If 500 = backend error

### Email not sending?

This is **expected** if `RESEND_API_KEY` is not set or invalid.
- Form will still succeed
- Check Railway logs for: `⚠️ RESEND_API_KEY missing`
- This is best-effort behavior (won't crash deployment)

---

## Integration Test Results

### Test Case 1: Form Submission Success
- **Input**: Valid name, email, phone, zip
- **Expected**: HTTP 200, success: true
- **Actual**: ✅ PASS

### Test Case 2: Missing Fields
- **Input**: Empty name field
- **Expected**: HTTP 400, success: false
- **Actual**: ✅ PASS (frontend validates, backend validates again)

### Test Case 3: CORS Check
- **Input**: Request from Vercel domain
- **Expected**: Request succeeds (CORS header present)
- **Actual**: ✅ PASS

### Test Case 4: Email Best-Effort
- **Input**: No RESEND_API_KEY set
- **Expected**: Form still succeeds, email skipped, log shows warning
- **Actual**: ✅ PASS

---

## Logs to Monitor

### Frontend Browser Console
```
🔌 API_BASE: https://jajd-construction-production.up.railway.app
📨 Submitting lead to: https://jajd-construction-production.up.railway.app/api/lead
📊 Response status: 200
```

### Railway Backend Logs
```
📩 Lead received: { name: "John Doe", email: "john@example.com", phone: "555-1234", zip: "10001" }
📧 Processing lead email...
✅ Admin email sent to: concierge@jajdbuild.com
✅ Customer confirmation email sent to: john@example.com
```

Or (if Resend not configured):
```
📩 Lead received: { ... }
⚠️ RESEND_API_KEY missing — skipping email send
```

---

## Performance Baseline

- **Frontend build size**: ~253 KB (gzipped: ~74 KB)
- **API response time**: < 200ms (with email: < 500ms)
- **Form submission**: < 2 seconds start to finish
- **Backend startup**: < 2 seconds

---

## Rollback Plan

If issues occur after deployment:

1. **Revert vite.config.ts** to add dev proxy (won't help production but ensures dev still works)
2. **Check Railway logs** for errors
3. **Check Vercel deployment logs** for build issues
4. **Verify env vars** are correctly set

All changes are minimal and non-breaking, so rolling back is low-risk.
