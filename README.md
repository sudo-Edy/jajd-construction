<div align="center">
<img width="1200" height="475" alt="JAJD Construction" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JAJD Construction Website

Professional construction website with lead generation and email notifications.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Resend (email)
- **Deployment**: Vercel (frontend) + Railway (backend)

## Quick Start

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```bash
   VITE_API_URL=http://localhost:5001
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Backend

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```

2. Create `.env`:
   ```bash
   RESEND_API_KEY=your-api-key-here
   EMAIL_FROM=noreply@yourdomain.com
   RECEIVER_EMAIL=jajdconstruction@gmail.com
   COMPANY_NAME=JAJD Construction
   PORT=5001
   NODE_ENV=development
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Build:
   ```bash
   npm run build
   ```

5. Start:
   ```bash
   npm start
   ```

## Deployment

### Vercel (Frontend)
- Set `VITE_API_URL` to your Railway backend URL

### Railway (Backend)
- Set all env vars from `.env` example
- Backend will automatically bind to `0.0.0.0:${PORT}`

## Architecture

- **Lead Form**: Multi-step form in QuoteModal component
- **API**: Single POST endpoint `/api/lead` for lead submissions
- **Emails**: Resend service sends admin notification + customer confirmation
- **CORS**: Allows requests from Vercel, Railway, and localhost
