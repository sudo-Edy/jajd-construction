# Quick Deployment Start (15 Minutes)

Follow these exact steps in order.

## Step 1: Push to GitHub (2 minutes)

```bash
cd /Users/zeroday/Documents/jajd-construction

# If not already set up:
git init
git add .
git commit -m "Initial JAJD Construction website with email backend"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/jajd-construction.git
git branch -M main
git push -u origin main
```

**Don't have GitHub?** 
- Go to https://github.com/join
- Create account (free)
- Create new repository named `jajd-construction`
- Follow instructions to push

---

## Step 2: Deploy Backend to Railway (5 minutes)

1. Go to: https://railway.app
2. Click "Start New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub
5. Select your `jajd-construction` repo
6. Railway detects Node.js
7. Click "Deploy"
8. Wait ~2 minutes for deployment
9. Click on your project
10. Find your backend URL (looks like: `https://jajd-production-abc123.up.railway.app`)
11. In Railway, add variables:
    ```
    EMAIL_SERVICE=gmail
    EMAIL_USER=jajdconstruction@gmail.com
    EMAIL_PASSWORD=sasklujqxraipdae
    RECEIVER_EMAIL=jajdconstruction@gmail.com
    NODE_ENV=production
    COMPANY_NAME=JAJD Construction
    PORT=3000
    ```
12. **Save your backend URL** - you need it next

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Authorize GitHub
5. Select your `jajd-construction` repo
6. Vercel detects Vite
7. Before deploying, add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** Your backend URL from Step 2 (e.g., `https://jajd-production-abc123.up.railway.app`)
8. Click "Deploy"
9. Wait ~1 minute
10. You get URL like: `https://jajd-construction.vercel.app`

---

## Step 4: Connect Domain (3 minutes)

1. **In Vercel:**
   - Go to your project
   - Click "Settings"
   - Click "Domains"
   - Add domain: `jajdconstruction.com`
   - Copy the nameservers shown

2. **In GoDaddy:**
   - Login: https://godaddy.com
   - Go to "My Products"
   - Find your domain, click "Manage"
   - Click "Manage DNS"
   - Replace nameservers with Vercel's:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - Save

3. **Wait:** DNS takes 24-48 hours to propagate
   - Check status: https://dnschecker.org

---

## Step 5: Test (2 minutes after DNS updates)

When DNS is ready:

1. Visit: `https://jajdconstruction.com`
2. Fill out form with:
   - Name: Test
   - Email: your-email@gmail.com
   - Phone: 555-1234
   - ZIP: 10001
3. Submit
4. Check your email for 2 messages:
   - Admin notification
   - Customer confirmation

---

## Done! 🎉

Your website is now live!

### What's Running

- **Frontend:** https://jajdconstruction.com (your domain!)
- **Backend:** Railway server receiving leads
- **Emails:** Gmail sending notifications
- **Domain:** GoDaddy pointing to Vercel

### Next Steps

- Monitor Railroad backend logs
- Check Vercel analytics
- Share your website!
- Wait for leads to come in

---

## Troubleshooting

### "Domain not working yet"
DNS changes take 24-48 hours. Check status at dnschecker.org

### "Backend not responding"
1. Check Railway dashboard - is it running?
2. Verify VITE_API_URL is correct in Vercel
3. Check backend environment variables in Railway

### "Emails not sending"
1. Check Railway logs for email errors
2. Verify Gmail credentials in Railway
3. Regenerate Gmail app password if needed

### "Page not loading"
1. Check Vercel deployment logs
2. Check browser console for errors
3. Clear cache and try again

---

## Quick Links

- Your domain (after DNS updates): https://jajdconstruction.com
- Railway backend: https://railway.app/dashboard
- Vercel frontend: https://vercel.com/dashboard
- GoDaddy domain: https://godaddy.com/account

---

**Estimated total time: 15 minutes setup + 24-48 hours for DNS**

Your business is about to get leads! 🚀
