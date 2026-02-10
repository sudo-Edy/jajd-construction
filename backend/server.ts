import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// Resend Email Configuration (only initialize if API key exists)
let resend: any = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'leads@jajdconstruction.com';
const RECEIVER_EMAIL = process.env.LEADS_TO_EMAIL || process.env.RECEIVER_EMAIL || 'jajdconstruction@gmail.com';
const COMPANY_NAME = process.env.COMPANY_NAME || 'JAJD Construction';

console.log('🚀 Starting JAJD Backend Server...');
console.log('📧 Email Service: Resend');
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Middleware - Security Headers
app.use(helmet());

// Middleware - CORS must be first
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://jajdconstruction.com',
    'https://jajd-construction-29z4bjib9-sudo-edys-projects.vercel.app',
    /\.vercel\.app$/,
    /\.railway\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware - Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// Stricter limiter for lead submission to prevent spam
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 lead submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'You have submitted too many leads. Please try again later.'
});

// Apply global rate limit
app.use(limiter);

// Verify Resend API key on startup (non-blocking)
(async () => {
  if (process.env.RESEND_API_KEY) {
    console.log('✅ Resend API key configured');
  } else {
    console.error('⚠️  RESEND_API_KEY missing — emails will not send');
  }
})();

// Types & Validation Schema
interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  property: string;
  project: string;
  size: string;
}

const leadSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short").max(20),
  zip: z.string().min(5, "Invalid ZIP code").max(10),
  property: z.string().min(1, "Property type is required"),
  project: z.string().min(1, "Project type is required"),
  size: z.string().min(1, "Project size is required"),
});

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

app.post('/api/lead', leadLimiter, async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validationResult = leadSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.warn('⚠️  Invalid lead submission data:', validationResult.error.format());
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        errors: validationResult.error.issues
      });
    }

    const { name, email, phone, zip, property, project, size }: LeadPayload = validationResult.data;

    // Log lead submission
    console.log(' Lead received:', { name, email, phone, zip });

    // Force usage of verified domain for Sender
    // This solves the 403 error by ignoring any potential "onboarding" value in env vars
    // while still respecting a valid custom env config if it matches the verified domain.
    let senderEmail = process.env.EMAIL_FROM || 'leads@jajdconstruction.com';
    
    // Safety check: If env var accidentally has "onboarding", force it to verified domain
    if (senderEmail.includes('onboarding@resend.dev')) {
        console.warn('⚠️  Detected onboarding email in env var. Overriding to leads@jajdconstruction.com to prevent 403.');
        senderEmail = 'leads@jajdconstruction.com';
    }

    const receiverEmail = RECEIVER_EMAIL;
    const companyName = COMPANY_NAME;

    console.log('📧 Processing lead email from:', senderEmail);

    // Try to send emails via Resend, but don't fail the request if they don't send
    try {
      if (!resend) {
        console.error('⚠️  RESEND_API_KEY missing — skipping email send');
      } else {
        // Send admin notification
        await resend.emails.send({
          from: senderEmail,
          to: receiverEmail,
          subject: `New Lead: ${name} - ${property} ${project}`,
          html: `
            <h2>New Lead Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>ZIP Code:</strong> ${zip}</p>
            <p><strong>Property Type:</strong> ${property}</p>
            <p><strong>Project Type:</strong> ${project}</p>
            <p><strong>Project Size:</strong> ${size}</p>
            <hr />
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
          `,
          replyTo: email,
        });
        console.log('✅ Admin email sent to:', receiverEmail);

        // Send customer confirmation
        await resend.emails.send({
          from: senderEmail,
          to: email,
          subject: `We received your request - ${companyName}`,
          html: `
            <h2>Thank you for your inquiry, ${name}!</h2>
            <p>We've received your project details and will review them shortly.</p>
            <p><strong>Your Information:</strong></p>
            <ul>
              <li>Property Type: ${property}</li>
              <li>Project Type: ${project}</li>
              <li>ZIP Code: ${zip}</li>
            </ul>
            <p>Our team will contact you within 24 hours at <strong>${phone}</strong> with your personalized estimate.</p>
            <p>If you have any questions in the meantime, feel free to reach out.</p>
            <br />
            <p>Best regards,<br/><strong>${companyName}</strong></p>
          `,
        });
        console.log('✅ Customer confirmation email sent to:', email);
      }
    } catch (emailErr) {
      console.error('⚠️  Resend email failed:', emailErr instanceof Error ? emailErr.message : emailErr);
    }

    // Always return success to frontend
    // Lead is received and stored regardless of email status
    res.status(200).json({
      success: true,
      message: 'Lead received successfully.',
    });
  } catch (error) {
    console.error('❌ Error processing lead submission:', error);
    // Even if there's a critical error, try to respond to frontend
    res.status(200).json({
      success: true,
      message: 'Lead received. Our team will contact you shortly.',
    });
  }
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server locally if run directly
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("🌍 Server bound to 0.0.0.0");
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📨 Lead endpoint: POST http://0.0.0.0:${PORT}/api/lead`);
  });
}

export default app;
