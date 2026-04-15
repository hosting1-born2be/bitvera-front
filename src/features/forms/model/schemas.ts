import { z } from 'zod';

import {
  customSolutionBudgetOptions,
  customSolutionCommunicationOptions,
  customSolutionProjectTypeOptions,
  customSolutionTimelineOptions,
} from '../lib/customSolutionOptions';

const ENABLE_RECAPTCHA = false;

const serviceSchema = z.string().optional();
const messageSchema = z.string().optional();
const recaptchaSchema = ENABLE_RECAPTCHA
  ? z.string().min(1, 'Please complete the reCAPTCHA verification')
  : z.string().optional();

const phoneSchema = z
  .string()
  .min(1, 'This field is required')
  .refine(
    (val) => /^[+]?[\d\s-]{10,}$/.test(val.replace(/\s/g, '')),
    'Please provide a valid phone number.'
  );

const websiteSchema = z.string().optional();
const emailSchema = z
  .string()
  .min(1, 'This field is required')
  .email('Please provide a valid email address.');

const firstNameSchema = z.string().min(1, 'This field is required');
const lastNameSchema = z.string().min(1, 'This field is required');

export const requestFormSchema = z.object({
  service: serviceSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  website: websiteSchema,
  message: messageSchema,
  recaptcha: recaptchaSchema,
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;

const fullNameSchema = z.string().trim().min(1, 'This field is required');
const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[+]?[\d\s-]{10,}$/.test(val.replace(/\s/g, '')),
    'Please provide a valid phone number.'
  );

export const customSolutionRequestFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  website: websiteSchema,
  projectTypes: z.array(z.enum(customSolutionProjectTypeOptions)),
  projectTypeOther: z.string().optional(),
  budget: z.enum(customSolutionBudgetOptions).optional(),
  goals: z.string().optional(),
  timeline: z.enum(customSolutionTimelineOptions).optional(),
  communicationPreferences: z.array(z.enum(customSolutionCommunicationOptions)),
  recaptcha: recaptchaSchema,
});

export type CustomSolutionRequestFormSchema = z.infer<typeof customSolutionRequestFormSchema>;
