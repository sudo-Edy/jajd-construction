import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

// Safety check for browser environments
if (typeof window === 'undefined') {
  const app = express();
  
  // Per guidelines, use process.env.API_KEY exclusively
  const resend = new Resend(process.env.API_KEY || 'no-key-provided');

  // Flexible CORS for multiple development and production origins
  app.use(cors({
    origin: true, 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }) as any);

  app.use(express.json() as any);

  app.get('/', (_req, res) => {
    res.status(200).json({ status: 'active', service: 'JAJD Construction API' });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

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

      if (process.env.API_KEY) {
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

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JAJD Backend listening on port ${PORT}`);
  });
}
