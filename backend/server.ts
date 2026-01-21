import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

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

console.log('🚀 Starting JAJD Backend Server...');
console.log('📧 Email Service:', process.env.EMAIL_SERVICE || 'gmail');
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Email Transporter Configuration
let transporter: any;

if (process.env.EMAIL_SERVICE === 'SendGrid') {
  // SendGrid Configuration
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
} else {
  // Default: Gmail or standard SMTP
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Verify email connection on startup
transporter.verify((error: any, success: any) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
    console.error('⚠️  Please check your .env file:');
    console.error('  - EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
    console.error('  - EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Missing');
    console.error('  - EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail');
  } else {
    console.log('✅ Email service ready:', success);
  }
});

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

    const receiverEmail = process.env.RECEIVER_EMAIL || 'concierge@jajdbuild.com';
    const companyName = process.env.COMPANY_NAME || 'JAJD Construction';

    // Email to Company (Admin)
    const adminEmailContent = `
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
    `;

    // Email to Customer
    const customerEmailContent = `
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
    `;

    console.log('📧 Sending admin email to:', receiverEmail);
    // Send admin notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: `New Lead: ${name} - ${property} ${project}`,
      html: adminEmailContent,
    });
    console.log('✅ Admin email sent');

    console.log('📧 Sending customer confirmation to:', email);
    // Send customer confirmation
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Estimate Request Received - ${companyName}`,
      html: customerEmailContent,
    });
    console.log('✅ Customer email sent');

    res.status(200).json({
      success: true,
      message: 'Lead submitted successfully. Check your email for confirmation.',
    });
  } catch (error) {
    console.error('❌ Error submitting lead:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      message: `Failed to submit lead: ${errorMessage}. Please check backend logs.`,
    });
  }
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📨 Lead endpoint: POST http://localhost:${port}/api/lead`);
});
