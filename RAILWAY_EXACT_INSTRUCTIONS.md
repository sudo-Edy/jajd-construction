# EXACT Railway Deployment Instructions

## ⚠️ READ EVERYTHING EXACTLY - NO SKIPPING STEPS

Follow these instructions word-for-word.

---

## STEP 1: Open Railway Website

1. **Open browser**
2. **Type in address bar:** `https://railway.app`
3. **Press Enter**
4. **You see Railway homepage**

---

## STEP 2: Sign Up / Sign In

1. **Look for button that says** "Sign In" or "Get Started"
2. **Click on it**
3. **You see login options**
4. **Click on** "GitHub" button (it's the OAuth option)
5. **You're redirected to GitHub**
6. **GitHub asks:** "Authorize Railway.app to your account?"
7. **Click** "Authorize" button
8. **You're redirected back to Railway**
9. **Railway is setting up your account** (wait 5-10 seconds)
10. **You see Railway dashboard** - you're now logged in

---

## STEP 3: Create New Project

1. **Look at top of screen**, you should see:
   - "Dashboard" button
   - "Create New" or "New Project" button
2. **Click** "New Project" button (or "Create" button)
3. **You see options:**
   - Deploy from GitHub
   - Deploy from Docker
   - Create Template
   - Etc.
4. **Click** "Deploy from GitHub"

---

## STEP 4: Select Your Repository

1. **Railroad shows your GitHub repositories**
2. **Look for** `jajd-construction` in the list
3. **Click on** `jajd-construction` (click the exact name)
4. **You see dropdown that asks** "Which branch to deploy?"
5. **Make sure** `main` branch is selected
6. **Click on** `jajd-construction` to deploy it

---

## STEP 5: Configure Service

1. **Railway auto-detects** your project is Node.js
2. **It shows a screen** "Configure your Railway project"
3. **Look for** "Service" or "Backend" service
4. **Click on** the service named "server" or "backend" or "jajd-construction"
5. **You see service configuration page**

---

## STEP 6: Set Root Directory (IMPORTANT)

1. **Look for setting** "Root Directory"
2. **Current value** should be empty or "/"
3. **You MUST change this to:** `backend`
4. **Click on the root directory field**
5. **Delete current value**
6. **Type:** `backend` (exactly, lowercase)
7. **Press Tab or click elsewhere** to save

---

## STEP 7: Add Environment Variables

1. **On the same page, look for** "Variables" tab or "Environment" section
2. **Click on** "Variables"
3. **You see a place to add variables**
4. **Look for button that says** "Add Variable" or "New Variable"

**Now add EACH variable one by one:**

### Variable 1:
5. **Click** "Add Variable"
6. **In KEY field**, type: `EMAIL_SERVICE` (exactly)
7. **In VALUE field**, type: `gmail` (exactly)
8. **Press Enter or Tab**

### Variable 2:
9. **Click** "Add Variable" again
10. **In KEY field**, type: `EMAIL_USER` (exactly)
11. **In VALUE field**, type: `jajdconstruction@gmail.com` (exactly)
12. **Press Enter or Tab**

### Variable 3:
13. **Click** "Add Variable"
14. **In KEY field**, type: `EMAIL_PASSWORD` (exactly)
15. **In VALUE field**, type: `sqaxsobaysqkulme` (EXACTLY as in your .env file)
16. **Press Enter or Tab**

### Variable 4:
17. **Click** "Add Variable"
18. **In KEY field**, type: `RECEIVER_EMAIL` (exactly)
19. **In VALUE field**, type: `jajdconstruction@gmail.com` (exactly)
20. **Press Enter or Tab**

### Variable 5:
21. **Click** "Add Variable"
22. **In KEY field**, type: `NODE_ENV` (exactly)
23. **In VALUE field**, type: `production` (exactly)
24. **Press Enter or Tab**

### Variable 6:
25. **Click** "Add Variable"
26. **In KEY field**, type: `COMPANY_NAME` (exactly)
27. **In VALUE field**, type: `JAJD Construction` (exactly)
28. **Press Enter or Tab**

### Variable 7:
29. **Click** "Add Variable"
30. **In KEY field**, type: `PORT` (exactly)
31. **In VALUE field**, type: `3000` (exactly)
32. **Press Enter or Tab**

**All 7 variables should now be visible in the list.**

---

## STEP 8: Deploy

1. **Look for button** "Deploy" or "Create"
2. **Click** "Deploy" button
3. **You see screen** "Deploying..."
4. **Wait 2-3 minutes** - don't close the page
5. **You should see** "Deployment Successful" or green checkmark
6. **Status changes to** "Online" or "Active"

---

## STEP 9: Get Your Backend URL

1. **You see Railway dashboard for your project**
2. **Look for section** "Deployments" or "Service URL"
3. **You should see a URL** that looks like:
   - `https://jajd-production-abc123.up.railway.app`
   - OR `https://something.railway.app`
4. **Copy this URL** - you need it for Vercel
5. **Keep this URL saved** in a text file or notes

---

## STEP 10: Test Backend is Running

1. **Copy your backend URL**
2. **Open a new browser tab**
3. **Type in address bar:** `YOUR_BACKEND_URL/health`
   - Example: `https://jajd-production-abc123.up.railway.app/health`
4. **Press Enter**
5. **You should see:**
   ```json
   {"status":"Backend is running"}
   ```
6. **If you see this**, backend is working! ✅
7. **If you see error**, backend is not ready yet - wait 1 minute and try again

---

## STEP 11: Check Logs (If Something Goes Wrong)

1. **In Railway dashboard**, look for "Logs" tab
2. **Click on** "Logs"
3. **You see your deployment logs**
4. **Look for** `✅ Email service ready: true`
5. **If you see this**, email is configured correctly
6. **If you see error**, check your PASSWORD in variables is correct

---

## SUMMARY

1. ✅ Open Railway.app
2. ✅ Sign in with GitHub
3. ✅ Create New Project from GitHub
4. ✅ Select jajd-construction repo
5. ✅ Set root directory to "backend"
6. ✅ Add 7 environment variables (exactly as shown)
7. ✅ Click Deploy
8. ✅ Wait 2-3 minutes
9. ✅ Get your backend URL
10. ✅ Test /health endpoint

---

## WHEN YOU'RE DONE

Reply to me with:
- ✅ "Backend deployed to Railway"
- ✅ Your backend URL (example: `https://jajd-production-xyz.up.railway.app`)
- ✅ Confirmation that `/health` endpoint works

Then I'll give you the NEXT step (Vercel deployment). 🚀
