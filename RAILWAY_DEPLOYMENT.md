# Railway Deployment Guide for JAJD Construction

**Status:** Ready for deployment  
**Last Updated:** January 22, 2026

## Critical Information

This project runs the Express backend directly from `backend/server.ts` using `tsx`. It does NOT compile to a `dist/server.js` file.

## Railway Configuration

### Build Command
```
npm ci
```

### Start Command
```
npx tsx backend/server.ts
```

**IMPORTANT:** Do NOT use:
- ❌ `cd backend && npm run build`
- ❌ `node dist/server.js`
- ❌ `npm run build` (this runs Vite for frontend only)

The frontend assets are built separately during deployment if needed. The backend runs directly with tsx.

## Environment Variables Required in Railway

Set these in Railway → Settings → Environment Variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx    (Your Resend API key)
EMAIL_FROM=noreply@yourdomain.com   (Sender email)
RECEIVER_EMAIL=your-email@company.com (Recipient email)
PORT=3000                            (Will be auto-set by Railway)
GEMINI_API_KEY=xxxxxxxxxxxxx        (Optional: for frontend features)
```

## Expected Startup Logs

When Railway deploys, you should see:

```
🚀 Server listening on http://0.0.0.0:3000
🔎 process.env.PORT = 3000
📧 Resend initialized with API key
```

## Health Check Verification

After deployment completes, externally test:

```bash
curl -i https://jajd-construction-production.up.railway.app/health
```

Expected response:
```
HTTP/2 200
Content-Type: application/json

{"ok":true}
```

## Root Endpoint

```bash
curl -i https://jajd-construction-production.up.railway.app/
```

Expected response:
```
HTTP/2 200
OK
```

## Lead Submission Endpoint

```bash
curl -X POST https://jajd-construction-production.up.railway.app/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "zip": "10001",
    "property": "Commercial",
    "project": "Renovation",
    "size": "Large"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Lead captured successfully."
}
```

## Troubleshooting

### 502 Error on /health
- Check Railway logs for startup errors
- Verify `RESEND_API_KEY` is set (or not set, which is fine)
- Ensure Start Command is: `npx tsx backend/server.ts`

### npm install fails
- Ensure `package.json` includes `tsx` in dependencies (not just devDependencies)
- Check that `npm ci` completes without errors in build logs

### Email not sending
- Verify `RESEND_API_KEY` is a valid Resend API key
- Check `EMAIL_FROM` and `RECEIVER_EMAIL` are valid email addresses
- Emails will not send without a valid key, but the endpoint will return 200

## Key Points for Railway

1. **tsx must be in dependencies** - Already fixed in package.json
2. **No dist/ compilation needed** - Backend runs directly with tsx
3. **Health endpoint is simple** - Returns `{"ok":true}` instantly
4. **Graceful degradation** - Server starts even if Resend is not configured
5. **All errors are caught** - No silent crashes, all errors logged

## Quick Checklist

- ✅ Backend runs with: `npx tsx backend/server.ts`
- ✅ Health endpoint returns 200
- ✅ tsx is in dependencies (not devDependencies)
- ✅ No hardcoded ports (uses process.env.PORT with default 3000)
- ✅ Binds to 0.0.0.0 for public accessibility
- ✅ Error handlers prevent silent crashes
- ✅ No email verification on boot

Ready to deploy!
