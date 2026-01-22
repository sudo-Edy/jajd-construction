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

// HTML escape utility to prevent XSS in emails
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

// Email validation utility
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Phone validation utility (10+ digits)
const isValidPhone = (phone: string): boolean => {
  const phoneDigits = phone.replace(/\D/g, '');
  return phoneDigits.length >= 10;
};

// Configure CORS with restricted origins (security best practice)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 
  'https://jajd-construction-production.up.railway.app,http://localhost:3000,http://localhost:3001'
).split(',').map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS request blocked from origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}) as any);

app.use(express.json() as any);

// Simple in-memory rate limiting (IP-based)
// For production, use Redis or similar persistent store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // 5 requests per window

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
    return false;
  }

  record.count++;
  return true;
};

// Health check - simplest proof of life
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.status(200).send('OK'));

app.post('/api/lead', async (req, res) => {
  const clientIp = req.ip || 'unknown';
  
  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      message: 'Too many lead submissions. Please try again in 15 minutes.'
    });
  }

  console.log('📝 Lead submission received from IP:', clientIp);
  
  try {
    const { name, email, phone, zip, property, project, size } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, Email, and Phone are required.' 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Validate phone format (10+ digits)
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.'
      });
    }

    // Escape HTML to prevent XSS in email body
    const escapedName = escapeHtml(name.substring(0, 100));
    const escapedEmail = escapeHtml(email.substring(0, 254));
    const escapedPhone = escapeHtml(phone.substring(0, 20));
    const escapedZip = escapeHtml(zip?.substring(0, 10) || '');
    const escapedProperty = escapeHtml(property?.substring(0, 50) || '');
    const escapedProject = escapeHtml(project?.substring(0, 50) || '');
    const escapedSize = escapeHtml(size?.substring(0, 50) || '');

    const adminHtml = `
      <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; color: #0f172a;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #facc15; padding-bottom: 10px;">New Construction Lead</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Phone:</strong> ${escapedPhone}</p>
        <p><strong>ZIP Code:</strong> ${escapedZip}</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Property Type:</strong> ${escapedProperty}</p>
          <p style="margin: 10px 0;"><strong>Project Type:</strong> ${escapedProject}</p>
          <p style="margin: 0;"><strong>Project Size:</strong> ${escapedSize}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This lead was captured via JAJD Construction Landing Page.</p>
      </div>
    `;

    if (process.env.RESEND_API_KEY && resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: process.env.RECEIVER_EMAIL || 'jajdconstruction@gmail.com',
          subject: `NEW LEAD: ${escapedName} (${escapedProject})`,
          html: adminHtml,
          replyTo: escapedEmail
        });
        console.log('✅ Email sent successfully for lead:', escapedName);
      } catch (emailError) {
        console.error('❌ Email service failed:', emailError);
        // Lead is still captured, so we return 200 but log the error
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured or Resend unavailable');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead captured successfully.' 
    });
  } catch (error) {
    console.error('❌ API Error:', error);
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
