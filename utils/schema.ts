import { z } from 'zod';

export const leadSchema = z.object({
  property: z.string().min(1, "Property type is required"),
  project: z.string().min(1, "Project type is required"),
  size: z.string().min(1, "Project size is required"),
  budget: z.string().optional(),
  zip: z.string()
    .regex(/^\d{5}$/, "ZIP code must be 5 digits")
    .transform(val => val.replace(/\D/g, '')), // Sanitize: remove non-digits
  name: z.string()
    .min(2, "Name is too short")
    .max(100, "Name is too long")
    .transform(val => val.trim()), // Sanitize: trim whitespace
  email: z.string()
    .email("Invalid email address")
    .transform(val => val.toLowerCase().trim()), // Sanitize: normalize
  phone: z.string()
    .min(10, "Phone number required")
    .transform(val => val.replace(/\D/g, '')), // Sanitize: only numbers
  description: z.string()
    .max(1000, "Description is too long")
    .optional()
    .transform(val => val ? val.replace(/<[^>]*>?/gm, '').trim() : ''), // Sanitize: strip HTML tags
  attachments: z.array(z.string().url()).optional()
});

export type LeadFormValues = z.infer<typeof leadSchema>;
