# Email Configuration Summary

## Where is the Receiver Email Connected?

The receiver email is configured in **two places**:

### 1. Backend Configuration (`backend/.env`)
```env
RECEIVER_EMAIL=concierge@jajdbuild.com
```
This is where emails sent from the form will be delivered.

### 2. Frontend Configuration (`config.ts`)
```typescript
EMAIL: "concierge@jajdbuild.com"
```
This is used for display purposes (phone/contact sections).

## Architecture Overview

```
Website (React/TypeScript)
        ↓
    Form Submission
        ↓
Backend (Express/Node.js)
        ↓ (Nodemailer)
    Email Service (Gmail/SendGrid/etc)
        ↓
Sends 2 Emails:
  1. Admin notification → RECEIVER_EMAIL
  2. Customer confirmation → form@example.com
```

## Quick Start

### Step 1: Install Backend Dependencies
```bash
npm run backend:install
# or manually:
cd backend && npm install
```

### Step 2: Configure Email
```bash
# Copy the example env file
cp backend/.env.example backend/.env

# Edit the .env file with your credentials
nano backend/.env
```

### Step 3: Start Backend
```bash
npm run backend:dev
# Backend runs on http://localhost:5000
```

### Step 4: Start Frontend (in another terminal)
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 5: Test
- Go to http://localhost:3000
- Fill out the quote form
- You should receive:
  - An email at your Gmail address (EMAIL_USER)
  - An email confirmation sent to the user's email
  - Admin notification at RECEIVER_EMAIL

## Email Configuration Options

### Gmail (Free, Easy Setup)
1. Enable 2-factor authentication on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `backend/.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### SendGrid (Recommended for Production)
```env
EMAIL_SERVICE=SendGrid
SENDGRID_API_KEY=your-api-key-here
```

### Mailgun
```env
EMAIL_SERVICE=Mailgun
MAILGUN_API_KEY=key-xxx
MAILGUN_DOMAIN=domain.mailgun.org
```

## Changing the Receiver Email

To change where admin notifications are sent:

**Option 1: Edit backend/.env**
```env
RECEIVER_EMAIL=newemail@yourdomain.com
```

**Option 2: Update config.ts** (for display only)
```typescript
EMAIL: "newemail@yourdomain.com"
```

**Restart the backend** after making changes:
```bash
npm run backend:dev
```

## Deployment

When deploying to production:

1. **Backend**: Deploy to Heroku, Railway, DigitalOcean, AWS, etc.
2. **Set Environment Variables** on hosting platform:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `RECEIVER_EMAIL`
   - `PORT` (if not 5000)

3. **Update Frontend** `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com
```

4. **Build and Deploy** frontend to Vercel, Netlify, or your CDN

## Troubleshooting

### Emails not sending?
- Check `backend/.env` credentials
- Verify email service is configured correctly
- Check backend console for errors: `npm run backend:dev`
- Ensure frontend `VITE_API_URL` matches backend URL

### CORS errors?
- Backend already configured with CORS
- Check `VITE_API_URL` in `.env.development`

### Port 5000 in use?
```bash
lsof -i :5000
kill -9 <PID>
```

## File Structure

```
jajd-construction/
├── backend/
│   ├── .env              ← Your email credentials
│   ├── .env.example      ← Template
│   ├── server.ts         ← Express app with email logic
│   ├── package.json      ← Backend dependencies
│   └── tsconfig.json
├── .env.development      ← Frontend dev config
├── .env.production       ← Frontend prod config
├── utils/
│   └── api.ts           ← Updated to call real backend
└── config.ts            ← Company email for display
```

## Support

For issues:
1. Check `BACKEND_SETUP.md` for detailed configuration
2. Review backend console output: `npm run backend:dev`
3. Verify `.env` file credentials
4. Test email service separately if needed
