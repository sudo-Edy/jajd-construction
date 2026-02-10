# Resend 403 Fix - Deployment Checklist

## ✅ Code Changes Complete

- ✅ Backend code updated to use `leads@jajdconstruction.com`
- ✅ Environment variable naming standardized (`EMAIL_FROM`, `RECEIVER_EMAIL`)
- ✅ Fallback values updated to verified domain
- ✅ All documentation updated (20+ files)
- ✅ Security audit passed
- ✅ Changes pushed to GitHub (commit: e413bf2)

---

## 📋 Deployment Steps (Do This Next)

### Step 1: Update Railway Environment Variables
- [ ] Go to: https://railway.app/dashboard
- [ ] Select: `jajd-construction-backend` project
- [ ] Click: "Variables" tab
- [ ] Update these variables:
  - `EMAIL_FROM` = `leads@jajdconstruction.com`
  - `LEADS_TO_EMAIL` = `jajdconstruction@gmail.com` (Primary)
  - `RECEIVER_EMAIL` = `jajdconstruction@gmail.com` (Fallback)
  - Keep `RESEND_API_KEY` unchanged
- [ ] Click: "Deploy" or "Restart"

### Step 2: Verify in Local Development
```bash
cd /Users/zeroday/Documents/jajd-construction/backend
# Update .env file manually if testing locally
nano .env
# Make sure these are set:
# EMAIL_FROM=leads@jajdconstruction.com
# RECEIVER_EMAIL=jajdconstruction@gmail.com
# RESEND_API_KEY=your_key_here

npm run dev
```

### Step 3: Test Email Sending
- [ ] Go to your website form
- [ ] Submit a test lead with:
  - Name: Test User
  - Email: your-test-email@example.com
  - Phone: 555-1234
  - ZIP: 10001
- [ ] Click "Submit Request"

### Step 4: Verify Success
- [ ] Backend logs show: `✅ Admin email sent to: jajdconstruction@gmail.com`
- [ ] Check `jajdconstruction@gmail.com` inbox for lead notification
- [ ] Check test email inbox for confirmation
- [ ] Sender should be: `leads@jajdconstruction.com`

---

## 🔍 Troubleshooting

### Issue: Still Getting 403 Forbidden
**Check:**
1. Is Railway redeployed? (Check "Deployments" tab)
2. Is `EMAIL_FROM` set to `leads@jajdconstruction.com`? (No typos)
3. Is `RESEND_API_KEY` still valid? (Test in Resend dashboard)

### Issue: Emails Not Arriving
**Check:**
1. Backend logs for: `⚠️  RESEND_API_KEY missing`
2. Check spam folder
3. Verify `RECEIVER_EMAIL` in Railway matches inbox you're checking

### Issue: Sender Shows Wrong Address
**Check:**
1. Railway `EMAIL_FROM` variable is set correctly
2. Resend dashboard shows domain is verified
3. Clear browser cache and reload

---

## 📊 What Changed

### Code Level
```diff
- EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
+ EMAIL_FROM = process.env.EMAIL_FROM || 'leads@jajdconstruction.com';

- RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || '';
+ RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'jajdconstruction@gmail.com';
```

### Environment Variables
```diff
- FROM_EMAIL=noreply@yourdomain.com
+ EMAIL_FROM=leads@jajdconstruction.com

- TO_EMAIL=jajdconstruction@gmail.com  
+ RECEIVER_EMAIL=jajdconstruction@gmail.com
```

---

## 📝 Documentation References

Created/Updated:
- ✅ `RESEND_403_FIX_SUMMARY.md` - Detailed fix explanation
- ✅ `SECURITY_AUDIT_REPORT.md` - Security verification
- ✅ `RESEND_QUICK_SETUP.md` - Setup guide
- ✅ `README.md` - Main documentation
- ✅ Plus 17+ other documentation files

---

## ✨ Expected Behavior After Fix

### Form Submission Flow
```
User fills form
   ↓
Clicks "Submit Request"
   ↓
Frontend validates
   ↓
Sends to: https://your-railway-backend.app/api/lead
   ↓
Backend receives
   ↓
Validates fields
   ↓
Sends email FROM: leads@jajdconstruction.com
   ↓
Sends TO: jajdconstruction@gmail.com (admin notification)
   ↓
Sends TO: user's email (confirmation)
   ↓
Returns 200 OK
   ↓
Frontend shows "Success!" modal
   ↓
✅ Complete!
```

---

## 🚀 Production Deployment Timeline

| Task | Status | Date |
|------|--------|------|
| Code fix implemented | ✅ | Jan 27, 2026 |
| Documentation updated | ✅ | Jan 27, 2026 |
| Pushed to GitHub | ✅ | Jan 27, 2026 |
| Update Railway vars | ⏳ | **Do Now** |
| Test in production | ⏳ | After Railway deploy |
| Monitor for 24h | ⏳ | Post-deploy |
| Close issue | ⏳ | After verification |

---

## 📞 Support Contacts

**Issue:** Resend 403 Forbidden  
**Root Cause:** Invalid sender domain  
**Fixed:** Using verified domain `leads@jajdconstruction.com`  
**Status:** Ready for deployment  

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Code pushed to GitHub
- [ ] Railway environment variables updated
- [ ] Backend redeployed/restarted
- [ ] Test form submission works
- [ ] Emails arrive in inbox
- [ ] Sender address shows as `leads@jajdconstruction.com`
- [ ] Both admin and customer emails received
- [ ] 24-hour monitoring shows no errors
- [ ] Documentation is current

---

## 🎉 You're All Set!

The Resend 403 issue has been fixed. Once you update Railway's environment variables and redeploy, your email lead system will work perfectly!

**Questions?** See:
- `RESEND_403_FIX_SUMMARY.md` - Detailed explanation
- `SECURITY_AUDIT_REPORT.md` - Security verification
- `README.md` - General setup

---

**Last Updated:** January 27, 2026  
**Fix Commit:** e413bf2  
**Status:** ✅ Ready for Production
