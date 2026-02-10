# Backend Migration Guide: Railway to Vercel

This guide helps you complete the migration of your backend from Railway (`celebrated-beauty`) to Vercel (Main Project).

## 1. Environment Variables
You must manually copy these variables from your Railway project to your Vercel project settings.

### Required
- **`RESEND_API_KEY`**: Start with `re_...` (Found in Railway or Resend dashboard)
- **`EMAIL_FROM`**: e.g., `leads@jajdconstruction.com`
- **`RECEIVER_EMAIL`**: e.g., `jajdconstruction@gmail.com` (Your admin email)
- **`COMPANY_NAME`**: e.g., `JAJD Construction`

> **Note**: `VITE_API_URL` is no longer required to point to Railway. You can leave it unset or set it to `/` in Vercel, as the frontend will automatically use the relative path `/api/lead` to talk to the backend on the same domain.

## ⚠️ CRITICAL: Avoid Downtime
The website itself will **NOT** go down, but the **Contact Form** will fail if you deploy without the Environment Variables.

### Correct Order of Operations:
1. **DO NOT PUSH** your code yet.
2. Go to Vercel Project Settings > Environment Variables.
3. Add `RESEND_API_KEY`, `EMAIL_FROM`, etc.
4. **THEN** push this code to GitHub.

This ensures that the moment the new code is live, it already has the keys it needs to send emails.

## 2. Deployment Steps
1. **Push Changes**: Commit and push the latest changes to your GitHub repository.
2. **Vercel Build**: Check the Vercel dashboard. It should automatically detect the new `api` directory and build the serverless functions.
3. **Verify**: Once deployed, test the contact form on your live site. It should successfully send emails without any CORS errors.

## 3. Cleanup
Once verified:
- You can safely **delete** the `celebrated-beauty` project on Railway to stop incurring costs.
- You can archive/delete old unused variables in Vercel related to the old backend URL.
