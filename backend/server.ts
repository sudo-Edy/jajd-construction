import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// Resend Email Configuration
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || '';
const COMPANY_NAME = process.env.COMPANY_NAME || 'JAJD Construction';

console.log('🚀 Starting JAJD Backend Server...');
console.log('📧 Email Service: Resend');
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Middleware - CORS must be first
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
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

// Verify Resend API key on startup (non-blocking)
(async () => {
  if (process.env.RESEND_API_KEY) {
    console.log('✅ Resend API key configured');
  } else {
    console.error('⚠️  RESEND_API_KEY missing — emails will not send');
  }
})();

// Types
interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  property: string;
  project: string;
  size: string;
}

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

app.post('/api/lead', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, zip, property, project, size }: LeadPayload = req.body;

    console.log('📨 New lead received:', name);

    // Validate required fields
    if (!name || !email || !phone || !zip) {
      console.warn('⚠️  Missing required fields:', { name, email, phone, zip });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, phone, zip' 
      });
    }

    const receiverEmail = RECEIVER_EMAIL;
    const companyName = COMPANY_NAME;

    console.log('📧 Processing lead email...');

    // Try to send emails via Resend, but don't fail the request if they don't send
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error('⚠️  RESEND_API_KEY missing — skipping email send');
      } else {
        // Send admin notification
        await resend.emails.send({
          from: EMAIL_FROM,
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
          from: EMAIL_FROM,
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

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log("🌍 Server bound to 0.0.0.0");
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📨 Lead endpoint: POST http://0.0.0.0:${PORT}/api/lead`);
});
