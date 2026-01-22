import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();

// Initialize Resend with API key (allow test mode for development)
let resend: any = null;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('📧 Resend initialized with API key');
  } catch (err) {
    console.warn('⚠️ Resend initialization failed:', err);
  }
} else {
  console.log('📧 Resend not configured (RESEND_API_KEY missing)');
}

// Flexible CORS for multiple development and production origins
app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}) as any);

app.use(express.json() as any);

// Health check - simplest proof of life
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.status(200).send('OK'));

app.post('/api/lead', async (req, res) => {
  console.log('Received lead request:', req.body);
  
  try {
    const { name, email, phone, zip, property, project, size } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, Email, and Phone are required.' 
      });
    }

    const adminHtml = `
      <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; color: #0f172a;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #facc15; padding-bottom: 10px;">New Construction Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>ZIP Code:</strong> ${zip}</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Property Type:</strong> ${property}</p>
          <p style="margin: 10px 0;"><strong>Project Type:</strong> ${project}</p>
          <p style="margin: 0;"><strong>Project Size:</strong> ${size}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This lead was captured via JAJD Construction Landing Page.</p>
      </div>
    `;

    if (process.env.RESEND_API_KEY && resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: process.env.RECEIVER_EMAIL || 'jajdconstruction@gmail.com',
          subject: `NEW LEAD: ${name} (${project})`,
          html: adminHtml,
          replyTo: email
        });
        console.log('Email sent successfully for lead:', name);
      } catch (emailError) {
        console.error('Email service failed:', emailError);
        // Lead is still logged, so we return 200 but keep record of error
      }
    } else {
      console.warn('RESEND_API_KEY not configured or Resend unavailable');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead captured successfully.' 
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error.' 
    });
  }
});

// Handle uncaught errors and keep server alive
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled rejection:", reason);
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  console.log("🔎 process.env.PORT =", process.env.PORT);
});

server.on("error", (err) => {
  console.error("❌ Server listen error:", err);
});
