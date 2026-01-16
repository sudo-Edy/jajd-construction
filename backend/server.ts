import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
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
  res.json({ status: 'Backend is running' });
});

app.post('/api/lead', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, zip, property, project, size }: LeadPayload = req.body;

    // Validate required fields
    if (!name || !email || !phone || !zip) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
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

    // Send admin notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: `New Lead: ${name} - ${property} ${project}`,
      html: adminEmailContent,
    });

    // Send customer confirmation
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Estimate Request Received - ${companyName}`,
      html: customerEmailContent,
    });

    res.status(200).json({
      success: true,
      message: 'Lead submitted successfully. Check your email for confirmation.',
    });
  } catch (error) {
    console.error('❌ Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit lead. Please try again later.',
    });
  }
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
