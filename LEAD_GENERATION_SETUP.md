# Lead Generation Setup - Quick Start

## Your Backend is Ready! ✅

Your website backend is **already optimized** for lead generation. No login, no database, just pure lead capture.

## What Happens When a Lead Submits the Form:

```
Customer fills form → Backend receives data → 2 emails sent:
                                              ├─ Admin email (concierge@jajdbuild.com)
                                              └─ Customer confirmation email
```

---

## 3-Step Setup

### Step 1: Choose Email Service

**Option A: Gmail (Recommended - Free)**
1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left menu)
3. Enable **2-Step Verification** (if not already enabled)
4. Find **App passwords** (under 2-Step Verification)
5. Select "Mail" and "Windows Computer" (or your device)
6. Google gives you a 16-character password
7. Copy this password (remove spaces)

**Option B: SendGrid (Better for Production)**
1. Create free account: https://sendgrid.com
2. Get API key from dashboard
3. No app password needed

---

### Step 2: Create backend/.env File

```bash
cd backend
cp .env.example .env
nano .env  # or open in your editor
```

**For Gmail:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxx
RECEIVER_EMAIL=concierge@jajdbuild.com
```

**For SendGrid:**
```env
EMAIL_SERVICE=SendGrid
SENDGRID_API_KEY=SG.your-api-key-here
RECEIVER_EMAIL=concierge@jajdbuild.com
```

---

### Step 3: Install & Run

```bash
# Install dependencies (one-time)
npm run backend:install

# Start backend (Terminal 1)
npm run backend:dev

# Start frontend (Terminal 2)
npm run dev
```

Backend will be at: **http://localhost:5000**
Frontend will be at: **http://localhost:3000**

---

## Test It

1. Go to http://localhost:3000
2. Fill out the "Get a Free Estimate" form
3. You should receive 2 emails:
   - **Admin notification** at `RECEIVER_EMAIL` with all lead details
   - **Customer confirmation** at the customer's email address

---

## Changing Where Leads Are Sent

Edit `backend/.env`:
```env
RECEIVER_EMAIL=your-new-email@yourdomain.com
```

Then restart backend: `npm run backend:dev`

---

## Email Service Comparison

| Feature | Gmail | SendGrid |
|---------|-------|----------|
| Cost | Free | Free tier (100/day) |
| Setup | 2FA + App Password | Sign up + API key |
| Deliverability | Good | Excellent |
| Best For | Small volume | High volume |
| Setup Time | 5 min | 10 min |

---

## Troubleshooting

### "Email service not working"
- Check backend console output: `npm run backend:dev`
- Verify credentials in `backend/.env`
- Make sure `.env` file exists (not `.env.example`)

### "Gmail says password is wrong"
- Use **App Password** (16 chars), not your regular Gmail password
- Remove spaces from app password
- Verify 2FA is enabled

### "Still not working"
```bash
# Restart backend
npm run backend:dev

# Check console for error messages
```

---

## Production Deployment

When you deploy:

1. **Backend**: Deploy to Heroku, Railway, DigitalOcean, AWS, etc.
2. **Set Environment Variables** on your hosting platform:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD` (or `SENDGRID_API_KEY`)
   - `RECEIVER_EMAIL`
3. **Frontend**: Update `.env.production`:
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

---

## What You Don't Need

❌ Database (not needed for leads)
❌ Login system (not needed for lead generation)
❌ User accounts (customers don't need accounts)
❌ Authentication (no sensitive data to protect)

You just need emails! 📧

---

## Support

Check these files for more info:
- `BACKEND_SETUP.md` - Detailed setup guide
- `EMAIL_CONFIG.md` - Configuration reference
