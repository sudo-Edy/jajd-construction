# QUICK DEPLOYMENT REFERENCE

## What Was Fixed
- ❌ Frontend was calling `/lead` instead of `/api/lead`
- ❌ Frontend was using dev proxy that doesn't work in production
- ✅ Now uses explicit full URL from `VITE_API_URL` environment variable

## Key Changes
1. **`utils/api.ts`** — Fixed endpoint to use `/api/lead`
2. **`vite.config.ts`** — Removed dev proxy and unused config
3. **Backend logging** — Added explicit lead submission logs
4. **Documentation** — Updated for Resend, not Gmail/Gemini

## Deployment Steps

### 1. Deploy Frontend to Vercel
```bash
git add .
git commit -m "Fix API endpoint and debloat project"
git push
```

In Vercel dashboard, set environment variable:
```
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

### 2. Deploy Backend to Railway
In Railway dashboard, set environment variables:
```
RESEND_API_KEY=sk_live_xxx
EMAIL_FROM=noreply@yourdomain.com
RECEIVER_EMAIL=concierge@jajdbuild.com
COMPANY_NAME=JAJD Construction
PORT=5001
NODE_ENV=production
```

### 3. Verify
- Frontend: Submit form from Vercel domain
- Expected: Form succeeds with success modal
- Backend logs: Should show "📩 Lead received: { ... }"

## Files Modified
```
✏️  utils/api.ts                    (Critical: Fixed endpoint)
✏️  vite.config.ts                  (Debloat: Removed proxy)
✏️  components/Services.tsx          (Debloat: Consolidated imports)
✏️  backend/server.ts                (Enhanced logging)
✏️  .env.production                  (Removed unused vars)
✏️  backend/.env.example             (Updated to match code)
✏️  README.md                         (Updated docs)

📄 Created: DEBLOAT_AND_FIX_SUMMARY.md
📄 Created: DEPLOYMENT_TEST_GUIDE.md
📄 Created: DETAILED_CHANGES.md
```

## Build Status
```bash
npm run build           # ✅ PASS
cd backend && npm run build  # ✅ PASS
```

## Environment Variables

### Vercel (Frontend)
```
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

### Railway (Backend)
```
RESEND_API_KEY=sk_live_xxx
EMAIL_FROM=noreply@yourdomain.com
RECEIVER_EMAIL=concierge@jajdbuild.com
COMPANY_NAME=JAJD Construction
PORT=5001
NODE_ENV=production
```

## Testing
1. Submit form from production Vercel domain
2. Check browser console for: `🔌 API_BASE: https://...`
3. Check Railway logs for: `📩 Lead received: { ... }`
4. Form should show success message

## Troubleshooting

### "Failed to fetch" still shows?
- Check Vercel env var: `VITE_API_URL=https://jajd-construction-production.up.railway.app` (no trailing slash)
- Check browser console Network tab for CORS errors
- Try accessing `https://jajd-construction-production.up.railway.app/health` in browser

### Form succeeds but no email?
- This is expected if RESEND_API_KEY is missing
- Form still works (best-effort emails)
- Add real Resend key to Railway env vars to enable emails

### Build fails?
- Run: `npm run build` (frontend) and `cd backend && npm run build` (backend)
- Both should pass with no errors
- Check for TypeScript errors

## No Breaking Changes
- UI is unchanged
- All components still work
- Form submission flow unchanged
- Just fixed the endpoint URL

## Rollback Plan
If needed, you can:
1. Temporarily add back dev proxy in vite.config.ts
2. But production still won't work (proxy is dev-only)
3. Better to fix root cause (which we did)

---

**Status**: ✅ Ready for deployment
**Date**: January 21, 2026
**Tested**: Both frontend and backend build and run successfully
