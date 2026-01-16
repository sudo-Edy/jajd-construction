# EXACT Vercel Deployment Instructions

## ⚠️ READ EVERYTHING EXACTLY - NO SKIPPING STEPS

Follow these instructions word-for-word.

---

## STEP 1: Open Vercel Website

1. **Open browser**
2. **Type in address bar:** `https://vercel.com`
3. **Press Enter**
4. **You see Vercel homepage**

---

## STEP 2: Sign In

1. **Look for** "Sign In" button (top right)
2. **Click** "Sign In"
3. **You see login options**
4. **Click on** "GitHub" button
5. **GitHub asks:** "Authorize Vercel to your account?"
6. **Click** "Authorize" button
7. **You're redirected to Vercel dashboard**
8. **You're now logged in**

---

## STEP 3: Import Your Project

1. **You see Vercel dashboard**
2. **Look for button** "Add New..." or "New Project"
3. **Click on it**
4. **You see options:**
   - Import Git Repository
   - Clone Template
   - Create from Scratch
5. **Click** "Import Git Repository"

---

## STEP 4: Select Your Repository

1. **Vercel shows your GitHub repositories**
2. **Look for** `sudo-edy/jajd-construction` in the list
3. **Click on** `jajd-construction`
4. **Vercel asks** about the project settings

---

## STEP 5: Configure Build Settings

**Very Important - These settings must be EXACT**

1. **You see "Import Project" form**
2. **Field 1 - Project Name:**
   - Should show: `jajd-construction`
   - Leave it as is

3. **Field 2 - Framework Preset:**
   - Look for dropdown
   - Click on it
   - Select: `Vite`
   - (If Vite is already selected, leave it)

4. **Field 3 - Root Directory:**
   - Look for this field
   - It should be empty or "."
   - Leave it as is (the root of your repo)

5. **Field 4 - Build Command:**
   - Should show: `npm run build`
   - Leave it as is

6. **Field 5 - Output Directory:**
   - Should show: `dist`
   - Leave it as is

---

## STEP 6: Add Environment Variable (CRITICAL)

**This is the MOST IMPORTANT STEP**

1. **Look for section** "Environment Variables"
2. **Click on** "Add Environment Variable" or the "+" button
3. **A new field appears**

**ADD YOUR RAILWAY BACKEND URL:**

4. **In the KEY field**, type: `VITE_API_URL` (exactly)
5. **In the VALUE field**, type: YOUR_RAILWAY_BACKEND_URL
   - Replace `YOUR_RAILWAY_BACKEND_URL` with your actual URL
   - Example: `https://jajd-production-abc123.up.railway.app`
   - DO NOT include `/api` or anything after .app
   - Just the base URL

6. **Press Enter or Tab** to confirm

**You should now see one variable listed:**
- Key: `VITE_API_URL`
- Value: `https://jajd-production-xyz.up.railway.app`

---

## STEP 7: Deploy

1. **Look for button** at bottom that says "Deploy"
2. **Click** "Deploy" button
3. **You see** "Creating deployment..."
4. **Wait 1-2 minutes** - page shows progress
5. **You should see** "Deployment Complete" with a checkmark
6. **A URL appears** that looks like:
   - `https://jajd-construction.vercel.app`
   - OR a different unique URL

**This is your frontend URL.**

---

## STEP 8: Set Up Custom Domain in Vercel

1. **After deployment completes**, you see project dashboard
2. **Look for** "Settings" button (top right)
3. **Click** "Settings"
4. **In left sidebar**, look for "Domains"
5. **Click** "Domains"
6. **You see "Add Domain" button**
7. **Click** "Add Domain"

---

## STEP 9: Add Your GoDaddy Domain

1. **A dialog box appears** asking for domain name
2. **In the text field**, type: `jajdconstruction.com` (exactly)
3. **Click** "Add" or "Continue" button
4. **Vercel shows:** "Configure a third-party domain"
5. **You see important information:**
   - Your domain: `jajdconstruction.com`
   - Configuration method: Nameservers
   - 4 Nameservers listed:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
     - `ns3.vercel-dns.com`
     - `ns4.vercel-dns.com`

**COPY THESE 4 NAMESERVERS** - you'll use them in GoDaddy.

---

## STEP 10: Come Back After GoDaddy Update

1. **After you've updated nameservers in GoDaddy** (see GODADDY_EXACT_INSTRUCTIONS.md)
2. **Come back to Vercel**
3. **The same domain page should still be open**
4. **Look for button** "Verify DNS Configuration" or "Check DNS"
5. **Click that button**
6. **Vercel checks if nameservers are updated**
7. **If successful**, you see green checkmark
8. **If not ready**, that's fine - DNS takes 24-48 hours

---

## STEP 11: Test Your Frontend

**AFTER 24-48 hours (DNS propagation):**

1. **Open new browser tab**
2. **Type in address bar:** `https://jajdconstruction.com`
3. **Press Enter**
4. **Your website should load**
5. **You see your JAJD Construction website**

---

## STEP 12: Test the Form End-to-End

1. **On your website**, look for "Get a Free Estimate" form
2. **Fill it out with test data:**
   - Name: Test
   - Email: your-email@gmail.com
   - Phone: 555-1234
   - ZIP: 10001
   - Property: Residential
   - Project: Full Remodel
   - Size: Medium
3. **Click** "Submit" or "Go" button
4. **You should get confirmation message**
5. **Check your email** (`jajdconstruction@gmail.com`)
6. **You should receive 2 emails:**
   - Admin notification (lead details)
   - Customer confirmation

**If you get both emails**, everything is working! ✅

---

## SUMMARY

1. ✅ Open Vercel.com
2. ✅ Sign in with GitHub
3. ✅ Import project from GitHub
4. ✅ Select jajd-construction
5. ✅ Vercel auto-detects Vite (leave settings as is)
6. ✅ Add environment variable `VITE_API_URL` with your Railway URL
7. ✅ Click Deploy
8. ✅ Wait 1-2 minutes
9. ✅ Add custom domain `jajdconstruction.com`
10. ✅ Copy Vercel nameservers for GoDaddy
11. ✅ Update nameservers in GoDaddy
12. ✅ Wait 24-48 hours for DNS
13. ✅ Test website at `https://jajdconstruction.com`
14. ✅ Test form submission

---

## WHEN YOU'RE DONE

Reply to me with:
- ✅ "Frontend deployed to Vercel"
- ✅ Your Vercel domain/URL
- ✅ Confirmation you added the domain to Vercel
- ✅ The 4 nameservers shown in Vercel (for GoDaddy)

Then I'll give you the GoDaddy instructions. 🚀
