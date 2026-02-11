import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'leads@jajdconstruction.com';
const RECEIVER_EMAIL = process.env.LEADS_TO_EMAIL || process.env.RECEIVER_EMAIL || 'jajdconstruction@gmail.com';
const COMPANY_NAME = process.env.COMPANY_NAME || 'JAJD Construction';

// Define Validation Schema
const leadSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short").max(20),
  zip: z.string().min(5, "Invalid ZIP code").max(10),
  property: z.string().min(1, "Property type is required"),
  project: z.string().min(1, "Project type is required"),
  size: z.string().min(1, "Project size is required"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Handle CORS Manually
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for simplicity, or restrict to your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle OPTIONS method (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Ensure strictly POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 4. Validate Input
    const validationResult = leadSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.warn('⚠️ Invalid lead submission:', validationResult.error.format());
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        errors: validationResult.error.issues,
      });
    }

    const { name, email, phone, zip, property, project, size } = validationResult.data;
    console.log('📨 Lead received:', { name, email, phone, zip });

    // 5. Send Emails
    let senderEmail = EMAIL_FROM;
    
    // Safety check for onboarding address
    if (senderEmail.includes('onboarding@resend.dev')) {
        senderEmail = 'leads@jajdconstruction.com';
    }

    if (!resend) {
      console.error('⚠️ RESEND_API_KEY missing - emails will not send');
    } else {
      try {
        // Admin Notification
        await resend.emails.send({
          from: senderEmail,
          to: RECEIVER_EMAIL,
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

        // Customer Confirmation
        await resend.emails.send({
          from: senderEmail,
          to: email,
          subject: `We received your request - ${COMPANY_NAME}`,
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
            <br />
            <p>Best regards,<br/><strong>${COMPANY_NAME}</strong></p>
          `,
        });
        console.log('✅ Emails sent successfully');
      } catch (emailErr) {
        console.error('❌ Email sending failed:', emailErr);
        // Don't fail the request if email fails, just log it
      }
    }

    // 6. Return Success
    return res.status(200).json({
      success: true,
      message: 'Lead received successfully.',
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
