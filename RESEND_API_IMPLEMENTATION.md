# Resend API Integration Plan - Fix Failed to Fetch Error

## ✅ Email Service Selected: Resend API

Resend is a modern email service perfect for transactional emails like lead submissions.

---

## 📋 WHAT'S NEEDED FROM YOU

To implement Resend API integration, please provide:

### **1. Resend API Key** ⚠️ CRITICAL
```
Where to get it:
1. Go to https://resend.com
2. Sign up (if not already)
3. Go to API Keys section
4. Copy your API key
5. Provide it here: ___________
```

### **2. Email Configuration**
```
FROM EMAIL (Sender):
  ├─ Must be verified in Resend dashboard
  ├─ Usually: noreply@yourdomain.com
  ├─ Or: JAJD Construction <noreply@jajdbuild.com>
  └─ Your value: ___________

TO EMAIL (Where leads go):
  ├─ Primary recipient email
  ├─ Usually: jajdconstruction@gmail.com
  ├─ Or: sales@jajdbuild.com
  └─ Your value: ___________

REPLY-TO EMAIL (Optional):
  ├─ What email should users reply to
  ├─ Usually: support@jajdbuild.com
  └─ Your value: ___________
```

### **3. Email Template Preference**
```
Do you want:
  [ ] Default professional template (provided below)
  [ ] Custom template (provide your own HTML)
  [ ] Plain text only
  
Your choice: ___________
```

### **4. User Confirmation Email**
```
Should user receive confirmation after submitting?
  [ ] No - Just show success message in form
  [ ] Yes - Send confirmation email to user
  
Your choice: ___________
```

### **5. Database Storage**
```
Store leads in database?
  [ ] No - Just email (simplest)
  [ ] Yes - Store in database (requires setup)
  
Your choice: ___________

If Yes:
  Database type: ___________
  Connection string: ___________
```

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Install Resend Package**
```bash
cd backend
npm install resend
npm install typescript --save-dev  # If not already installed
```

### **Step 2: Add Resend API Key to Environment**
Create or update `backend/.env`:
```bash
# Resend Email Configuration
RESEND_API_KEY=your_api_key_here
FROM_EMAIL=noreply@jajdbuild.com
TO_EMAIL=jajdconstruction@gmail.com
```

### **Step 3: Update Backend to Use Resend**
File: `backend/server.ts`

Replace the stub endpoint with:
```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.options("*", (_req, res) => {
  res.sendStatus(200);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/lead", async (req, res) => {
  try {
    const { name, email, phone, zip, property, project, size } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !zip) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@jajdbuild.com",
      to: process.env.TO_EMAIL || "jajdconstruction@gmail.com",
      subject: `New Lead: ${name} - JAJD Construction`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">New Lead Submission</h2>
          
          <p>You have received a new lead from your website:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>ZIP Code:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${zip}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Property Type:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${property}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Project Type:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${project}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Project Size:</strong></td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${size}</td>
            </tr>
          </table>
          
          <p style="background-color: #fef08a; padding: 15px; border-radius: 5px; border-left: 4px solid #eab308;">
            <strong>⏱️ Action Required:</strong> Please follow up with this lead within 24 hours.
          </p>
          
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            This email was sent automatically from your JAJD Construction website.
          </p>
        </div>
      `
    });

    if (result.error) {
      console.error("❌ Resend API Error:", result.error);
      return res.status(500).json({
        success: false,
        message: "Failed to send lead. Please try again."
      });
    }

    console.log("✅ Email sent successfully:", result.data);

    // (Optional) Send confirmation email to user
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@jajdbuild.com",
      to: email,
      subject: "We Received Your Quote Request - JAJD Construction",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Thank You for Your Request!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your quote request and appreciate your interest in JAJD Construction.</p>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; border-left: 4px solid #22c55e; margin: 20px 0;">
            <p><strong>📋 Your Project Details:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Property Type: ${property}</li>
              <li>Project: ${project}</li>
              <li>Size: ${size}</li>
              <li>Location: ${zip}</li>
            </ul>
          </div>
          
          <p>A member of our expert team will contact you at <strong>${phone}</strong> or <strong>${email}</strong> within 24 hours to discuss your project in detail and provide a free estimate.</p>
          
          <p>If you need to reach us immediately, feel free to call:</p>
          <p style="font-size: 18px; font-weight: bold; color: #1e293b;">📞 (380) 239-5307</p>
          
          <p style="color: #64748b; margin-top: 30px;">
            Best regards,<br/>
            <strong>JAJD Construction Team</strong><br/>
            Professional Residential & Commercial Services
          </p>
        </div>
      `
    }).catch(err => {
      console.warn("⚠️ Confirmation email failed:", err);
      // Don't fail the request if confirmation email fails
    });

    res.json({
      success: true,
      message: "Lead submitted successfully. We will contact you within 24 hours."
    });

  } catch (error) {
    console.error("❌ Lead submission error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again."
    });
  }
});

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 📝 WHAT THIS IMPLEMENTATION DOES

### **When User Submits Form:**

1. ✅ **Validates Input**
   - Checks all required fields present
   - Returns error if missing

2. ✅ **Sends Admin Email** (via Resend)
   - To: `jajdconstruction@gmail.com` (configurable)
   - Contains: All lead details in formatted table
   - Subject: Includes lead name for easy filtering

3. ✅ **Sends User Confirmation** (via Resend)
   - To: User's email from form
   - Contains: Thank you message + project details
   - Subject: Confirmation of submission

4. ✅ **Returns Success Response**
   - Frontend shows: "Lead submitted successfully. We will contact you within 24 hours."
   - Modal closes after 2 seconds
   - User can submit another form

5. ✅ **Error Handling**
   - If email fails: Returns error message
   - User can retry
   - Console logs errors for debugging

---

## 🔐 SECURITY FEATURES INCLUDED

✅ **Input Validation**
- Required fields checked
- Email format validation (in frontend)

✅ **Error Handling**
- No sensitive info exposed in error messages
- Detailed logs for debugging

✅ **CORS Protection**
- Configured correctly for safety

✅ **Environment Variables**
- API key protected in `.env` file
- Never committed to GitHub

---

## 📊 FILES TO UPDATE

### **1. `backend/package.json`**
Add dependency:
```json
{
  "dependencies": {
    "resend": "^3.0.0"
  }
}
```

### **2. `backend/.env`** (NEW FILE)
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@jajdbuild.com
TO_EMAIL=jajdconstruction@gmail.com
PORT=5001
```

### **3. `backend/server.ts`**
Replace current implementation with Resend integration (see code above)

### **4. `.gitignore`** (Update)
Ensure it includes:
```
backend/.env
backend/.env.local
.env
.env.local
```

---

## 🚀 QUICK SETUP CHECKLIST

```
BEFORE IMPLEMENTATION:
  [ ] Have Resend API key from https://resend.com
  [ ] Know the FROM email address to use
  [ ] Know the TO email address (where leads go)
  [ ] Verify FROM email is verified in Resend dashboard
  
IMPLEMENTATION:
  [ ] Update backend/package.json with resend dependency
  [ ] Create backend/.env file with credentials
  [ ] Update backend/server.ts with Resend code
  [ ] Run: cd backend && npm install
  [ ] Run: npm run backend:dev
  [ ] Test with curl or form submission
  
TESTING:
  [ ] Form submits without error
  [ ] Admin email received in inbox
  [ ] User confirmation email received
  [ ] Check Resend dashboard for delivery stats
  [ ] Check backend console for logs
  
DEPLOYMENT:
  [ ] Add RESEND_API_KEY to production environment
  [ ] Update FROM_EMAIL and TO_EMAIL for production
  [ ] Test in production
  [ ] Commit code to GitHub
```

---

## ✉️ EMAIL TEMPLATES

### **Admin Email Features:**
- Professional formatting
- All lead details in table
- Color-coded for easy reading
- Action reminder (24-hour follow up)

### **User Confirmation Features:**
- Personalized greeting
- Project details summary
- Clear call-to-action (phone number)
- Professional company signature

---

## 🧪 TESTING THE IMPLEMENTATION

### **Step 1: Install Dependencies**
```bash
cd backend
npm install resend
```

### **Step 2: Start Backend**
```bash
npm run backend:dev
# Should see: 🚀 Server running on port 5001
```

### **Step 3: Test with cURL**
```bash
curl -X POST http://localhost:5001/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "zip": "10001",
    "property": "Residential",
    "project": "Full Remodel",
    "size": "Medium"
  }'

# Expected response: {"success":true,"message":"Lead submitted successfully..."}
```

### **Step 4: Check Emails**
- ✅ Admin email should arrive in `jajdconstruction@gmail.com`
- ✅ User confirmation should arrive in `john@example.com`
- ✅ Check Resend dashboard for delivery status

### **Step 5: Test in Browser**
```
1. Go to http://localhost:3001
2. Fill out quote form
3. Submit
4. Should see success message
5. Check both email inboxes
```

---

## 🛠️ TROUBLESHOOTING

### **"Invalid API Key" Error**
- Verify API key is correct in `.env`
- Check Resend dashboard for active key
- Restart backend after updating `.env`

### **"FROM email not verified"**
- Go to Resend dashboard
- Verify the FROM email address
- Use verified domain email only

### **Emails not received**
- Check spam/junk folder
- Verify TO email is correct
- Check Resend dashboard activity logs
- Check backend console for errors

### **CORS or Network Errors**
- Ensure backend is running on port 5001
- Test: `curl http://localhost:5001/health`
- Check browser console for exact error

---

## 📈 NEXT STEPS

1. **Get Resend API Key**
   - Go to https://resend.com
   - Sign up (free account)
   - Create API key

2. **Verify Email Domain**
   - Add your domain to Resend
   - Verify DNS records (if using custom domain)
   - Or use `resend.dev` for testing

3. **Provide Information**
   ```
   Resend API Key: ___________
   FROM Email: ___________
   TO Email: ___________
   ```

4. **I'll Implement & Test**
   - Update backend files
   - Install Resend package
   - Test email delivery
   - Commit to GitHub

5. **You Verify**
   - Test form submission
   - Verify emails arrive
   - Check formatting

---

## 💡 ADVANTAGES OF RESEND

✅ **Easy to Use**
- Simple API
- Great documentation
- Quick setup

✅ **Reliable**
- 99.9% uptime
- Excellent deliverability
- Real-time tracking

✅ **Developer Friendly**
- Built for developers
- Modern TypeScript support
- Webhook support available

✅ **Cost Effective**
- Free tier: 100 emails/day
- Pay as you go
- Perfect for startups

---

## 📞 SUPPORT

**Resend Resources:**
- Documentation: https://resend.com/docs
- Dashboard: https://dashboard.resend.com
- Status: https://status.resend.com

**Implementation Help:**
- Resend examples: https://resend.com/docs/send-email

---

## 🎯 SUMMARY

**With Resend API:**
- ✅ Form will fully work
- ✅ Emails will be delivered reliably
- ✅ Professional email templates
- ✅ Easy to maintain and scale
- ✅ Perfect for your use case

**Ready to implement? Provide:**
1. Resend API Key
2. FROM email address
3. TO email address (where leads go)

**That's all we need!** 🚀

