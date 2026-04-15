import { z } from 'zod';

// Set to false to disable reCAPTCHA validation (useful for development/testing)
const ENABLE_RECAPTCHA = true;

export const createContactFormNewSchema = () =>
  z.object({
    fullName: z.string().min(1, 'This field is required'),
    email: z.string().email('Invalid email address').min(1, 'This field is required'),
    phone: z.string().optional(),
    message: z.string().optional(),
    recaptcha: ENABLE_RECAPTCHA
      ? z.string().min(1, 'Please complete the reCAPTCHA verification')
      : z.string().optional(),
  });

export type ContactFormNewSchema = z.infer<ReturnType<typeof createContactFormNewSchema>>;