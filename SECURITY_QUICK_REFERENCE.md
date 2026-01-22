# 🔐 SECURITY REFERENCE CARD
## Quick Guide for JAJD Construction

**Last Updated:** January 22, 2026  
**Status:** ✅ Production Ready

---

## 🚀 ONE-PAGE SECURITY SUMMARY

### ✅ WHAT WE PROTECT

| Area | Protection | Status |
|------|-----------|--------|
| **XSS Attacks** | HTML escaping all user input | ✅ |
| **Spam/DDoS** | Rate limiting (5 requests/15 min per IP) | ✅ |
| **Invalid Data** | Email & phone validation | ✅ |
| **Injection Attacks** | Input length limits & validation | ✅ |
| **CORS Attacks** | Origin whitelist (production only) | ✅ |
| **Silent Crashes** | Process error handlers | ✅ |
| **Data Leaks** | No sensitive data in logs | ✅ |
| **API Abuse** | Rate limiting + validation | ✅ |

---

## 🔑 SECRET MANAGEMENT

### Production (Railway)
```bash
RESEND_API_KEY=re_xxxxx              # ← Your actual key
EMAIL_FROM=sender@domain.com          # ← Sender address  
RECEIVER_EMAIL=you@company.com        # ← Lead recipient
NODE_ENV=production                   # ← Important!
ALLOWED_ORIGINS=your-domain.com       # ← Your domain
```

### Local Development (.env.local)
```bash
RESEND_API_KEY=re_test_local_key
EMAIL_FROM=onboarding@resend.dev
RECEIVER_EMAIL=test@example.com
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### ⚠️ NEVER COMMIT
- `.env` files
- `.env.local` files
- API keys in code
- Passwords anywhere

**Status:** ✅ `.gitignore` protects all `.env` files

---

## 🛡️ SECURITY FEATURES

### 1. Rate Limiting
```
Limit: 5 requests per IP per 15 minutes
Returns: HTTP 429 if exceeded
Purpose: Prevent spam and DoS
```

### 2. Input Validation
```
Name:     Required, 1-100 chars
Email:    Valid format, max 254 chars
Phone:    Minimum 10 digits
ZIP:      1-10 chars
Property: 1-50 chars
Project:  1-50 chars
Size:     1-50 chars
```

### 3. XSS Prevention
```
All user input is HTML-escaped before emails
<script> → &lt;script&gt;
& → &amp;
" → &quot;
```

### 4. CORS Protection
```
Only these origins allowed:
✅ https://jajd-construction-production.up.railway.app
✅ http://localhost:3000 (dev only)
✅ http://localhost:3001 (dev only)

Any other origin: BLOCKED
```

### 5. Error Handling
```
Server Crashes:        ❌ Won't happen (handled)
Sensitive Data Logged: ❌ Never happens
User Sees Errors:      ✅ Generic messages
Dev Sees Errors:       ✅ Full details in console
```

---

## 🧪 QUICK TESTS

### Test Rate Limiting
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/lead \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","phone":"5551234567"}'
done
# 6th request returns HTTP 429
```

### Test Email Validation
```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid","phone":"5551234567"}'
# Returns HTTP 400 - invalid email
```

### Test Phone Validation
```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"123"}'
# Returns HTTP 400 - phone too short
```

### Test XSS Prevention
```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","phone":"5551234567"}'
# Email shows: &lt;script&gt;alert(1)&lt;/script&gt; (safe)
```

---

## 📋 DEPLOYMENT CHECKLIST

Before each deployment:

```
□ git status                        (no uncommitted changes)
□ npm audit                         (no vulnerabilities)
□ All environment variables set     (in Railway)
□ ./health endpoint tested          (returns 200)
□ Test lead submission              (email received)
□ Logs reviewed                     (no errors)
□ git push origin main              (latest code)
```

---

## ⚡ PERFORMANCE vs SECURITY NOTES

### Rate Limiting Trade-off
```
Settings:
- 5 requests per IP per 15 minutes
- Blocks 6+ requests from same IP

If users complain: Increase limits
RATE_LIMIT_MAX = 10  (instead of 5)
RATE_LIMIT_WINDOW = 30 * 60 * 1000  (30 min instead of 15)
```

### CORS Trade-off
```
Current: Whitelist only known origins
Trade: Slightly more setup, much more secure

To add origin:
ALLOWED_ORIGINS=domain1.com,domain2.com,domain3.com
```

---

## 🚨 INCIDENT RESPONSE

### If you see HTTP 429 errors
```
Meaning: Rate limit exceeded
Cause: >5 submissions from same IP in 15 min
Action: Wait 15 minutes or increase limit
```

### If you see CORS errors
```
Meaning: Request from unauthorized origin
Cause: Different domain than whitelist
Action: Add domain to ALLOWED_ORIGINS
```

### If email not sending
```
Check: Is RESEND_API_KEY set?
Check: Is RECEIVER_EMAIL correct?
Check: Are credentials valid?
Fallback: Leads still captured, just no email
```

### If seeing 429 in production
```
Either:
1. Site is very popular! 🎉
2. Someone is attacking

Check Railway logs:
- High volume = success, increase limits
- Targeted = block that IP (contact Railway)
```

---

## 📊 SECURITY METRICS

```
Before Hardening     →  After Hardening
────────────────────────────────────────
No rate limiting     →  5/15min per IP
No input validation  →  Email/phone checked
Unescaped HTML       →  All escaped
Allow all CORS       →  Whitelist only
Basic validation     →  Comprehensive checks
```

---

## 🔄 REGULAR MAINTENANCE

### Weekly
```bash
# Check logs in Railway for attacks/errors
# Review error patterns
```

### Monthly
```bash
npm audit                 # Security vulnerabilities
npm update               # Update dependencies (if safe)
```

### Quarterly
```bash
# Full security review
# Test all security features
# Review CORS whitelist
```

### Yearly
```bash
# Complete security reassessment
# Penetration testing (optional)
# Update security documentation
```

---

## 📞 TROUBLESHOOTING

### "Too many lead submissions" error
- **Meaning:** Rate limit exceeded
- **Fix:** Wait 15 minutes or use different IP

### "Please provide a valid email" error
- **Meaning:** Email format invalid
- **Fix:** Check email format (user@domain.com)

### "Please provide a valid phone" error
- **Meaning:** Phone < 10 digits
- **Fix:** Enter at least 10 digits

### Email not received (but form submitted)
- **Check:** RESEND_API_KEY in Railway
- **Check:** RECEIVER_EMAIL correct
- **Check:** Spam folder
- **Status:** Lead still captured, just no email

### CORS error in browser
- **Meaning:** Request from non-whitelisted origin
- **Fix:** Set ALLOWED_ORIGINS for your domain

---

## 📚 FULL DOCUMENTATION

Read these for complete details:

1. **SECURITY_AUDIT.md** - Full security analysis
2. **SECURITY_HARDENING.md** - Implementation details
3. **SECURITY_FINAL_REPORT.md** - Complete report
4. **backend/server.ts** - Source code comments

---

## ✅ SECURITY SIGN-OFF

✅ All security measures implemented  
✅ Tested and verified  
✅ Production ready  
✅ Enterprise-grade protection  

**Status: SECURE** 🔒

---

**Need help?** Review the full security documents or check Railway logs.
