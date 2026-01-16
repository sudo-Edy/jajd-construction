# Deployment Guide - JAJD Construction

## Overview

You'll deploy to:
- **Frontend:** Vercel (free, fast, easy)
- **Backend:** Railway or Render (free tier available)
- **Domain:** Point GoDaddy domain to both services

Total time: ~30 minutes

---

## Step 1: Prepare Your Code for Deployment

### Update Production Environment Files

Update `.env.production` with your production backend URL (we'll get this after deploying backend):

**For now, keep it as template:**
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## Step 2: Deploy Backend (Choose One)

### **Option A: Railway (Recommended - Easiest)**

1. **Create Railway Account**
   - Go to: https://railway.app
   - Sign up with GitHub account
   - Connect your GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your GitHub repo
   - Select your `jajd-construction` repository

3. **Configure Backend**
   - Select the `backend` directory as your service root
   - Railway auto-detects Node.js

4. **Add Environment Variables**
   - In Railway dashboard, go to Variables
   - Add these from your `.env`:
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=jajdconstruction@gmail.com
     EMAIL_PASSWORD=sasklujqxraipdae
     RECEIVER_EMAIL=jajdconstruction@gmail.com
     NODE_ENV=production
     COMPANY_NAME=JAJD Construction
     PORT=3000
     ```

5. **Deploy**
   - Railway automatically deploys
   - You'll get a URL like: `https://your-app-name.up.railway.app`
   - **Save this URL** - you'll need it for frontend

### **Option B: Render (Alternative)**

1. Go to: https://render.com
2. Create account
3. Click "New +"
4. Select "Web Service"
5. Connect GitHub repo
6. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
7. Add environment variables (same as above)
8. Deploy

---

## Step 3: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to: https://vercel.com
   - Sign up with GitHub
   - Connect your GitHub

2. **Import Project**
   - Click "Import Project"
   - Paste your repo URL
   - Select your `jajd-construction` repository

3. **Configure**
   - Framework: Vite
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.up.railway.app
     ```
     (Use the URL you got from Step 2)

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys
   - You get URL like: `https://jajd-construction.vercel.app`

---

## Step 4: Connect GoDaddy Domain

### **Point Domain to Vercel (Frontend)**

1. **In Vercel Dashboard:**
   - Select your project
   - Go to "Settings" → "Domains"
   - Add Domain: `jajdconstruction.com`
   - Vercel shows nameserver instructions

2. **In GoDaddy:**
   - Login to GoDaddy
   - Go to "My Products" → "Domains"
   - Select your domain
   - Go to "Manage DNS"
   - Replace nameservers with Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Wait 24-48 hours for DNS to propagate

3. **Verify in Vercel:**
   - Once DNS updates, your domain works
   - Check "Settings" → "Domains" to confirm

### **Optional: Use Custom Domain for Backend**

If you want backend on subdomain (e.g., `api.jajdconstruction.com`):
1. In Railway/Render, add custom domain
2. Get CNAME record
3. Add CNAME in GoDaddy DNS
4. Update `.env.production` with new backend URL

---

## Step 5: Final Configuration

### Update Your Production Files

1. **`.env.production`** - Add your production backend URL:
   ```env
   VITE_API_URL=https://your-backend-railway.up.railway.app
   ```

2. **`config.ts`** - Update with real company info (if not already done):
   ```typescript
   export const CONFIG = {
     COMPANY_NAME: "JAJD Construction",
     PHONE: "(555) 123-4567",
     EMAIL: "concierge@jajdconstruction.com",
     ADDRESS: "Your Address",
     // ...
   };
   ```

3. **Redeploy Frontend**
   - Commit changes to GitHub
   - Vercel automatically redeploys

---

## Step 6: Test Production

1. Go to: `https://jajdconstruction.com` (or your domain)
2. Fill out the form
3. Check your email (`jajdconstruction@gmail.com`)
4. Verify you receive 2 emails (admin + customer confirmation)

---

## Troubleshooting

### "Backend not responding"
- Check backend is deployed and running
- Verify `VITE_API_URL` in `.env.production` is correct
- Check backend environment variables are set

### "Domain not working"
- DNS changes can take 24-48 hours
- Use https://dnschecker.org to check propagation
- Clear browser cache

### "Emails not sending"
- Verify Gmail app password in backend environment variables
- Check Gmail security settings
- Try regenerating app password

### "CORS errors"
- Backend already has CORS enabled
- Make sure backend URL in frontend matches deployment URL

---

## Git Setup (Required for Deployment)

Make sure your repo is on GitHub:

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/jajd-construction.git
git push -u origin main
```

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Railway Backend | Free tier (50 hours/month) | Upgrade to $5/month for unlimited |
| Vercel Frontend | Free | Unlimited |
| GoDaddy Domain | ~$10/year | Already purchased |
| Gmail | Free | Included with Google |
| **Total** | **~$10/year** | Free tier sufficient for leads |

---

## Summary

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Railway/Render
3. ✅ Deploy frontend to Vercel
4. ✅ Point GoDaddy domain to Vercel
5. ✅ Test form submission
6. ✅ Done!

---

## Support

If issues arise:
1. Check Railway/Render/Vercel logs
2. Verify environment variables
3. Test backend separately with Postman
4. Check email credentials in `.env`

Your website will be live on your domain! 🚀
