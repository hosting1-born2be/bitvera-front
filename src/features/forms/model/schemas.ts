import { z } from 'zod';

import {
  customSolutionBudgetOptions,
  customSolutionCommunicationOptions,
  customSolutionProjectTypeOptions,
  customSolutionTimelineOptions,
} from '../lib/customSolutionOptions';

const ENABLE_RECAPTCHA = false;
const AFFILIATE_REQUIRED_MESSAGE = 'This field is required.';
const AFFILIATE_INVALID_EMAIL_MESSAGE = 'Please provide a valid email address.';
const AFFILIATE_INVALID_WEBSITE_MESSAGE = 'Please provide a valid website address.';

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

const normalizeWebsite = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const isValidWebsite = (value: string) => {
  try {
    const url = new URL(normalizeWebsite(value.trim()));
    return url.hostname.includes('.') && !/\s/.test(value);
  } catch {
    return false;
  }
};

type AffiliateMessageGetter = (
  key:
    | 'errors.required'
    | 'errors.emailInvalid'
    | 'errors.websiteInvalid',
  fallback: string
) => string;

const getAffiliateMessage = (
  getMessage: AffiliateMessageGetter | undefined,
  key: Parameters<AffiliateMessageGetter>[0],
  fallback: string
) => getMessage?.(key, fallback) ?? fallback;

export const createAffiliateFormSchema = (getMessage?: AffiliateMessageGetter) => {
  const requiredMessage = getAffiliateMessage(
    getMessage,
    'errors.required',
    AFFILIATE_REQUIRED_MESSAGE
  );
  const emailInvalidMessage = getAffiliateMessage(
    getMessage,
    'errors.emailInvalid',
    AFFILIATE_INVALID_EMAIL_MESSAGE
  );
  const websiteInvalidMessage = getAffiliateMessage(
    getMessage,
    'errors.websiteInvalid',
    AFFILIATE_INVALID_WEBSITE_MESSAGE
  );

  const requiredString = z.string().trim().min(1, requiredMessage);

  return z.object({
    name: requiredString,
    username: requiredString,
    email: z.string().trim().min(1, requiredMessage).email(emailInvalidMessage),
    website: z
      .string()
      .trim()
      .min(1, requiredMessage)
      .refine((value) => isValidWebsite(value), websiteInvalidMessage),
    password: requiredString,
    companyName: requiredString,
    companyCountry: requiredString,
    geoOfCustomers: requiredString,
    positionInCompany: requiredString,
    businessActivity: requiredString,
    yearsOnMarket: z.string().trim().optional(),
    plannedVolume: z.string().trim().optional(),
    recaptcha: recaptchaSchema,
  });
};

export type AffiliateFormSchema = z.infer<ReturnType<typeof createAffiliateFormSchema>>;

const SUPPORT_REQUIRED_MESSAGE = 'This field is required.';
const SUPPORT_INVALID_EMAIL_MESSAGE = 'Please provide a valid email address.';

type SupportMessageGetter = (
  key: 'errors.required' | 'errors.emailInvalid',
  fallback: string
) => string;

const getSupportMessage = (
  getMessage: SupportMessageGetter | undefined,
  key: Parameters<SupportMessageGetter>[0],
  fallback: string
) => getMessage?.(key, fallback) ?? fallback;

export const createSupportFormSchema = (getMessage?: SupportMessageGetter) => {
  const requiredMessage = getSupportMessage(
    getMessage,
    'errors.required',
    SUPPORT_REQUIRED_MESSAGE
  );
  const emailInvalidMessage = getSupportMessage(
    getMessage,
    'errors.emailInvalid',
    SUPPORT_INVALID_EMAIL_MESSAGE
  );

  return z.object({
    name: z.string().trim().min(1, requiredMessage),
    email: z.string().trim().min(1, requiredMessage).email(emailInvalidMessage),
    message: z.string().trim().optional(),
    recaptcha: recaptchaSchema,
  });
};

export type SupportFormSchema = z.infer<ReturnType<typeof createSupportFormSchema>>;
