# JAJD Construction Backend Setup

## Overview
This backend handles email submissions from your construction website form. It uses Express.js and Nodemailer to send emails to both the company and the customer.

## Prerequisites
- Node.js 16+ installed
- npm or yarn
- Gmail account (or another email service)

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

**Create a `.env` file in the `backend` folder:**

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
RECEIVER_EMAIL=concierge@jajdbuild.com

# Server Configuration
PORT=5000
NODE_ENV=development

# Company Info
COMPANY_NAME=JAJD Construction
```

### 3. Gmail Setup (Recommended for Testing)

If using Gmail:

1. Enable 2-Factor Authentication on your Google Account
2. Generate an **App Password**:
   - Go to [Google Account](https://myaccount.google.com/)
   - Select **Security** from the left menu
   - Enable 2-Step Verification if not already enabled
   - Find "App passwords" option
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password to `EMAIL_PASSWORD` in `.env`

3. Set `EMAIL_USER` to your Gmail address

### 4. Alternative Email Services

For production, consider these services for better deliverability:

#### SendGrid
```env
EMAIL_SERVICE=SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

Modify `backend/server.ts` to use SendGrid:
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
```

#### Mailgun
```env
EMAIL_SERVICE=Mailgun
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

## Running the Backend

### Development
```bash
cd backend
npm run dev
```

This starts the server at `http://localhost:5000`

### Production
```bash
cd backend
npm run build
npm start
```

## Frontend Configuration

The frontend automatically looks for the backend at `http://localhost:5000` during development.

To change the API URL, edit `.env.development` or `.env.production`:

```env
VITE_API_URL=http://localhost:5000  # Development
# or
VITE_API_URL=https://api.yourdomain.com  # Production
```

## Testing

1. Start the backend: `npm run dev` (in `/backend`)
2. Start the frontend: `npm run dev` (in root)
3. Fill out the quote form on the website
4. Check:
   - Your email inbox for the customer confirmation
   - The `RECEIVER_EMAIL` inbox for the admin notification

## API Endpoint

### POST `/api/lead`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "zip": "10001",
  "property": "Residential",
  "project": "Full Remodel / Renovation",
  "size": "Medium"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Lead submitted successfully. Check your email for confirmation."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to submit lead. Please try again later."
}
```

## Deployment

### Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Run: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-password
   heroku config:set RECEIVER_EMAIL=concierge@jajdbuild.com
   ```
5. Deploy: `git push heroku main`

### DigitalOcean / AWS / Azure
Similar process - set environment variables in your hosting panel and deploy.

## Troubleshooting

### "Cannot find module" errors
```bash
cd backend
npm install
```

### Emails not sending
1. Check your `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. Enable "Less secure app access" in Gmail (if not using App Passwords)
3. Check the backend console for error messages
4. For Gmail: Verify 2FA is enabled and you're using an App Password

### CORS errors
The backend is configured with CORS enabled. Make sure your frontend URL is correct in environment variables.

### Port already in use
Change `PORT` in `.env` or kill the process using port 5000:
```bash
lsof -i :5000
kill -9 <PID>
```

## Next Steps

1. Set up your email service credentials
2. Update `RECEIVER_EMAIL` in backend `.env`
3. Test the form submission
4. Deploy backend to your hosting provider
5. Update `VITE_API_URL` in production `.env` file
