# Deployment Checklist

## Pre-Deployment

- [ ] Code is on GitHub (git push)
- [ ] All environment variables are set in `.env` files
- [ ] `config.ts` has your company info
- [ ] Local testing works (form submits, emails send)
- [ ] You have access to your GoDaddy domain

## Backend Deployment (Railway)

- [ ] Create Railway account (https://railway.app)
- [ ] Connect GitHub
- [ ] Create new project from your repo
- [ ] Select `backend` directory
- [ ] Add environment variables:
  - [ ] EMAIL_SERVICE=gmail
  - [ ] EMAIL_USER=your-email@gmail.com
  - [ ] EMAIL_PASSWORD=your-app-password
  - [ ] RECEIVER_EMAIL=your-email@gmail.com
  - [ ] NODE_ENV=production
  - [ ] COMPANY_NAME=JAJD Construction
  - [ ] PORT=3000
- [ ] Deploy and get your backend URL
- [ ] Test backend health: `https://your-url/health`

## Frontend Deployment (Vercel)

- [ ] Create Vercel account (https://vercel.com)
- [ ] Connect GitHub
- [ ] Import your repository
- [ ] Add environment variable:
  - [ ] VITE_API_URL=https://your-railway-backend-url.com
- [ ] Deploy
- [ ] Get your frontend URL

## Domain Setup (GoDaddy)

- [ ] Login to GoDaddy
- [ ] Go to Manage DNS for your domain
- [ ] Update nameservers to Vercel's:
  - [ ] ns1.vercel-dns.com
  - [ ] ns2.vercel-dns.com
- [ ] Wait 24-48 hours for DNS to propagate
- [ ] Verify domain in Vercel dashboard

## Post-Deployment Testing

- [ ] Visit your domain: https://jajdconstruction.com
- [ ] Fill out the form
- [ ] Submit it
- [ ] Check email for admin notification
- [ ] Check email for customer confirmation
- [ ] Test on mobile devices
- [ ] Check page speed (https://pagespeed.web.dev)

## Monitoring

- [ ] Check Railway backend logs regularly
- [ ] Monitor Vercel deployment status
- [ ] Set up email alerts (optional)
- [ ] Keep Gmail app password safe

---

## Quick Links

- Railway Dashboard: https://railway.app
- Vercel Dashboard: https://vercel.com
- GoDaddy Domain Management: https://godaddy.com/account
- Gmail App Passwords: https://myaccount.google.com/apppasswords

---

## Notes

Deployment time: ~30 minutes
DNS propagation: 24-48 hours
First revenue-producing lead: Priceless! 🎉
