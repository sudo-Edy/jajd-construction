# Resend Email API Integration - Complete Checklist

## ✅ Backend Ready for Resend Integration

### 1. Resend Package Installation
- [x] `resend` npm package installed in `backend/package.json`
- [x] Version: `^6.8.0`
- [x] Proper import: `import { Resend } from 'resend'`

### 2. Backend Configuration (`backend/server.ts`)
- [x] **Initialization**: `let resend = new Resend(process.env.RESEND_API_KEY)`
- [x] **Graceful Fallback**: Resend only initializes if API key exists
- [x] **Error Handling**: Email failures don't crash the application (best-effort pattern)
- [x] **Startup Log**: Logs confirmation when API key is configured
- [x] **Error Logs**: Logs error messages when email sending fails

### 3. Environment Variables Required

#### Development (.env.development)
```bash
# Frontend config
VITE_API_URL=http://localhost:5001
```

#### Production (.env.production)
```bash
# Frontend config
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

#### Railway Backend Required Env Vars (Set in Railway Dashboard)
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx  # Required for email sending
EMAIL_FROM=noreply@yourdomain.com   # Verified sender email
RECEIVER_EMAIL=jajdconstruction@gmail.com  # Recipient for admin notifications
COMPANY_NAME=JAJD Construction      # Company name for email templates
NODE_ENV=production                 # Set to production
PORT=5001                           # Match Railway port binding
```

### 4. API Endpoint: `/api/lead`

#### Request Payload
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "zip": "string",
  "property": "Residential|Commercial",
  "project": "string",
  "size": "Small|Medium|Large"
}
```

#### Validation
- [x] Required fields: `name`, `email`, `phone`, `zip`
- [x] Returns 400 status if required fields missing
- [x] Email format validation (basic regex check in frontend)

#### Response
```json
{
  "success": true,
  "message": "Lead received successfully."
}
```

### 5. Email Functionality

#### Two Emails Sent (via Resend)
1. **Admin Notification Email**
   - To: `RECEIVER_EMAIL` (company inbox)
   - Subject: `New Lead: {name} - {property} {project}`
   - Contains: Full lead details, submission timestamp
   - Reply-To: Customer's email address

2. **Customer Confirmation Email**
   - To: Customer's email
   - Subject: `We received your request - {COMPANY_NAME}`
   - Contains: Confirmation message, lead details, follow-up timeline
   - Auto-responder style message

#### Error Handling
- [x] Email sending failures are logged but don't fail the request
- [x] Frontend always receives 200 OK with success message
- [x] Missing `RESEND_API_KEY` logs warning but continues operation
- [x] Supports fallback (online demo without email capability)

### 6. Frontend Configuration

#### API Utility (`utils/api.ts`)
- [x] `submitLead()` function sends POST to `/api/lead`
- [x] Full URL construction: `${API_BASE_URL}/api/lead`
- [x] Correct fallback: `http://localhost:5001` for local dev
- [x] Proper error handling with user-friendly messages
- [x] Logs API base URL on page load for debugging

#### Quote Modal (`components/QuoteModal.tsx`)
- [x] Collects all required form data
- [x] Client-side validation before submission
- [x] Shows loading state during submission
- [x] Displays success confirmation message with customer name
- [x] Displays user-friendly error messages if submission fails

### 7. CORS Configuration

#### Origins Allowed
- Local development: `http://localhost:3000`, `http://localhost:5173`
- Production domains: All `*.vercel.app` domains, All `*.railway.app` domains
- Custom domain: `https://jajdconstruction.com`

#### Configuration
- [x] CORS middleware initialized FIRST (before routes)
- [x] `credentials: true` for cookie support
- [x] Regex patterns for wildcard domain matching
- [x] OPTIONS requests handled for preflight

### 8. Build & Deployment Ready

#### Frontend Build
```bash
npm ci && npm run build
# Result: dist/ folder with optimized production build
```

#### Backend Build
```bash
cd backend && npm ci && npm run build
# Result: dist/ folder with compiled TypeScript
```

#### Environment Variables
- [x] Production API URL must match Railway backend domain
- [x] No secrets hardcoded in code
- [x] All sensitive data stored in `.env` (not in git)
- [x] `.env` file added to `.gitignore`

### 9. Deployment Checklist

#### Vercel (Frontend)
- [ ] Set `VITE_API_URL` in Vercel Environment Variables
- [ ] Value: Railway backend production URL
- [ ] Deploy frontend
- [ ] Verify form submission works end-to-end

#### Railway (Backend)
- [ ] Set all required environment variables in Railway dashboard:
  - `RESEND_API_KEY` (from Resend.com)
  - `EMAIL_FROM` (verified Resend sender)
  - `RECEIVER_EMAIL` (admin inbox)
  - `COMPANY_NAME`
  - `NODE_ENV=production`
  - `PORT=5001` (or Railway-assigned port)
- [ ] Deploy backend
- [ ] Test health endpoint: `/health`
- [ ] Test form submission from Vercel frontend
- [ ] Check email received in admin inbox
- [ ] Check customer confirmation email

### 10. Resend Setup (Required)

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up for free account

2. **Add Domain**
   - Verify your domain (if using custom domain for emails)
   - Or use Resend's default domain for testing

3. **Get API Key**
   - Navigate to API Keys section
   - Copy API key
   - Set as `RESEND_API_KEY` in Railway

4. **Verified Email**
   - Use verified email as `EMAIL_FROM`
   - For testing: use default Resend email (`onboarding@resend.dev`)
   - For production: verify your domain's email

### 11. Testing Sequence

#### Local Testing (Development)
```bash
# Terminal 1: Backend
cd backend
npm run dev  # Runs on http://localhost:5001

# Terminal 2: Frontend
npm run dev  # Runs on http://localhost:3000

# Test form submission in browser
# Check backend console for logs:
# - "📩 Lead received: ..."
# - "📧 Processing lead email..."
# - "✅ Admin email sent to: ..." (if RESEND_API_KEY set)
```

#### Production Testing (After Deployment)
1. Open Vercel frontend URL
2. Fill out and submit quote form
3. Check browser console for success message
4. Wait a few seconds for email
5. Check admin email inbox
6. Check customer confirmation email

### 12. Troubleshooting Guide

#### "Failed to fetch" Error
- [ ] Check Vercel environment variable `VITE_API_URL` is set correctly
- [ ] Verify Railway backend is running and publicly accessible
- [ ] Check CORS allows Vercel domain in Railway backend
- [ ] Open browser DevTools → Network → inspect failing request

#### Email Not Received
- [ ] Check `RESEND_API_KEY` is set in Railway
- [ ] Verify `EMAIL_FROM` is Resend-verified email
- [ ] Check `RECEIVER_EMAIL` is correct
- [ ] Check backend logs for email error messages
- [ ] Test with `onboarding@resend.dev` temporarily

#### Form Submission Hangs
- [ ] Check Network tab in DevTools (is request being sent?)
- [ ] Verify backend `/api/lead` endpoint is reachable
- [ ] Check backend server logs for errors
- [ ] Verify request payload includes all required fields

### 13. Production Status

**Current State**: ✅ **READY FOR RESEND INTEGRATION**

**What Works**:
- Frontend form collects all required data
- API endpoint receives and validates leads
- CORS properly configured
- Email templates ready
- Error handling in place
- Graceful fallback for missing API key

**What's Needed**:
- Resend API key (get from resend.com)
- Verified sender email
- Set environment variables in Railway dashboard

**Next Steps**:
1. Create Resend account → get API key
2. Set Railway environment variables
3. Deploy and test

---

## File Reference

### Frontend Files
- `utils/api.ts` - API communication
- `components/QuoteModal.tsx` - Form submission
- `vite.config.ts` - Build configuration
- `.env.development` - Local env vars
- `.env.production` - Production env vars

### Backend Files
- `backend/server.ts` - Main server & email logic
- `backend/package.json` - Dependencies
- `backend/tsconfig.json` - TypeScript config

---

Generated: January 22, 2026
Status: Ready for Resend Integration ✅
