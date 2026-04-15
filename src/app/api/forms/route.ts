import { NextResponse } from 'next/server';

import type { MailDataRequired } from '@sendgrid/mail';
import sgMail from '@sendgrid/mail';

import { verifyRecaptcha } from '@/shared/lib/recaptcha';

export const runtime = 'nodejs';

const ENABLE_RECAPTCHA = false;

type RequestPayload = {
  service: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  message: string;
};

type CustomSolutionPayload = {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  projectTypes: string[];
  projectTypeOther: string;
  budget: string;
  goals: string;
  timeline: string;
  communicationPreferences: string[];
  attachmentNames: string[];
};

type Attachment = {
  content: string;
  filename: string;
  type: string;
  disposition: 'attachment';
};

const escapeHtml = (text: string | undefined | null) => {
  if (text == null) return '';

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatList = (items: string[]) =>
  items.filter(Boolean).map((item) => escapeHtml(item)).join(', ') || 'Not specified';

const parseEmailList = (value: string | undefined) =>
  (value ?? '')
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(Boolean);

const getEmailConfig = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const adminEmails = parseEmailList(process.env.ADMIN_EMAIL);
  const fromEmail = process.env.FROM_EMAIL?.trim();

  if (!apiKey || adminEmails.length === 0 || !fromEmail) {
    throw new Error('Email configuration is missing.');
  }

  sgMail.setApiKey(apiKey);

  return { adminEmails, fromEmail };
};

const sendEmail = async (message: MailDataRequired, label: string) => {
  try {
    await sgMail.send(message);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'body' in error.response
    ) {
      console.error(`SendGrid ${label} error:`, error.response.body);
    }

    throw error;
  }
};

const getSafeFirstName = (fullName: string) => {
  const [firstName] = fullName.trim().split(/\s+/);
  return escapeHtml(firstName || fullName);
};

const buildRequestUserEmailHtml = (payload: RequestPayload) => {
  const safeFirstName = getSafeFirstName(payload.fullName);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request Received - Netspire Dev</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fff; color: #333;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 640px; width: 100%; border-collapse: collapse; background-color: #fff; overflow: hidden;">
          <tr>
            <td style="padding: 32px; background: #fff;">
              <p style="margin: 0 0 32px; color: #333;font-size: 24px;font-style: normal;font-weight: 400;line-height: 140%;">
                Dear ${safeFirstName},
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Thank you for reaching out to Netspire Dev. We have successfully received your request and our team is already reviewing the details.
              </p>
              <span style="display: block;padding: 20px;background:#384CE3;margin: 32px 0;color: #FFF;font-size: 14px;font-style: normal;font-weight: 400;line-height: 140%;">
                Request Summary:<br><br>
                <ul style="margin: 0;padding-left: 16px;">
                  <li>
                    Service: <strong>${escapeHtml(payload.service)}</strong>
                  </li>
                </ul>
              </span>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                We will contact you shortly to confirm the next steps and discuss the best way forward for your project.
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Best regards,<br>
                <strong style="color: #333;">The Netspire Dev Team</strong>
              </p>
              <p style="margin: 0; color: #333;font-size: 18px;font-style: normal;font-weight: 400;line-height: 140%;">
                <a href="https://bitvera.com" target="_blank" style="color: #333;font-weight: 400;text-decoration: underline;">bitvera.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const buildCustomSolutionUserEmailHtml = (payload: CustomSolutionPayload) => {
  const safeFirstName = getSafeFirstName(payload.fullName);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Solution Request Received - Netspire Dev</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fff; color: #333;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 640px; width: 100%; border-collapse: collapse; background-color: #fff; overflow: hidden;">
          <tr>
            <td style="padding: 32px; background: #fff;">
              <p style="margin: 0 0 32px; color: #333;font-size: 24px;font-style: normal;font-weight: 400;line-height: 140%;">
                Dear ${safeFirstName},
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Thank you for sharing your project idea with Netspire Dev. We have received your custom solution request and will review it carefully.
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Our team will contact you soon to clarify the details, discuss the scope, and recommend the best next steps.
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Best regards,<br>
                <strong style="color: #333;">The Netspire Dev Team</strong>
              </p>
              <p style="margin: 0; color: #333;font-size: 18px;font-style: normal;font-weight: 400;line-height: 140%;">
                <a href="https://bitvera.com" target="_blank" style="color: #333;font-weight: 400;text-decoration: underline;">bitvera.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const parseJsonBody = async (request: Request) => {
  const body = (await request.json()) as {
    formType: 'request';
    data: RequestPayload & { recaptcha?: string };
  };

  return {
    formType: body.formType,
    payload: body.data,
    attachments: [] as Attachment[],
  };
};

const parseMultipartBody = async (request: Request) => {
  const formData = await request.formData();
  const attachments: Attachment[] = [];
  const files = formData.getAll('attachments');

  for (const value of files) {
    if (!(value instanceof File) || value.size === 0) {
      continue;
    }

    const buffer = Buffer.from(await value.arrayBuffer());

    attachments.push({
      content: buffer.toString('base64'),
      filename: value.name,
      type: value.type || 'application/octet-stream',
      disposition: 'attachment',
    });
  }

  return {
    formType: String(formData.get('formType') ?? ''),
    payload: {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      website: String(formData.get('website') ?? ''),
      projectTypes: formData.getAll('projectTypes').map(String),
      projectTypeOther: String(formData.get('projectTypeOther') ?? ''),
      budget: String(formData.get('budget') ?? ''),
      goals: String(formData.get('goals') ?? ''),
      timeline: String(formData.get('timeline') ?? ''),
      communicationPreferences: formData.getAll('communicationPreferences').map(String),
      attachmentNames: attachments.map((attachment) => attachment.filename),
      recaptcha: String(formData.get('recaptcha') ?? ''),
    },
    attachments,
  };
};

async function handleRequestForm(
  payload: RequestPayload & { recaptcha?: string },
  attachments: Attachment[]
) {
  const { adminEmails, fromEmail } = getEmailConfig();

  const { recaptcha: _recaptcha, ...requestData } = payload;
  void _recaptcha;
  void attachments;

  const html = `
    <h2>Request</h2>
    <p><strong>Service:</strong> ${escapeHtml(requestData.service)}</p>
    <p><strong>Company name:</strong> ${escapeHtml(requestData.companyName)}</p>
    <p><strong>Website:</strong> ${escapeHtml(requestData.website)}</p>
    <p><strong>Message:</strong> ${escapeHtml(requestData.message)}</p>
    <p><strong>Full name:</strong> ${escapeHtml(requestData.fullName)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(requestData.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(requestData.email)}</p>
  `;

  await sendEmail({
    to: adminEmails,
    from: fromEmail,
    replyTo: requestData.email,
    subject: `New Service Request: ${requestData.service || 'Unknown service'}`,
    html,
  }, 'admin request notification');

  await sendEmail({
    to: requestData.email,
    from: fromEmail,
    subject: "We've Received Your Request",
    html: buildRequestUserEmailHtml(requestData),
  }, 'request confirmation');
}

async function handleCustomSolutionForm(
  payload: (CustomSolutionPayload & { recaptcha?: string }) | Record<string, unknown>,
  attachments: Attachment[]
) {
  const { adminEmails, fromEmail } = getEmailConfig();
  const customPayload = payload as CustomSolutionPayload & { recaptcha?: string };
  const { recaptcha: _recaptcha, ...requestData } = customPayload;
  void _recaptcha;

  const html = `
    <h2>Custom Solution Request</h2>
    <p><strong>Full name:</strong> ${escapeHtml(requestData.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(requestData.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(requestData.phone) || 'Not provided'}</p>
    <p><strong>Website:</strong> ${escapeHtml(requestData.website) || 'Not provided'}</p>
    <p><strong>Project types:</strong> ${formatList(requestData.projectTypes)}</p>
    <p><strong>Other project type:</strong> ${escapeHtml(requestData.projectTypeOther) || 'Not specified'}</p>
    <p><strong>Estimated budget:</strong> ${escapeHtml(requestData.budget) || 'Not specified'}</p>
    <p><strong>Main goals:</strong> ${escapeHtml(requestData.goals) || 'Not specified'}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(requestData.timeline) || 'Not specified'}</p>
    <p><strong>Preferred communication:</strong> ${formatList(requestData.communicationPreferences)}</p>
    <p><strong>Attachments:</strong> ${formatList(requestData.attachmentNames)}</p>
  `;

  await sendEmail({
    to: adminEmails,
    from: fromEmail,
    replyTo: requestData.email,
    subject: 'Custom Solution Request',
    html,
    attachments,
  }, 'admin custom solution notification');

  await sendEmail({
    to: requestData.email,
    from: fromEmail,
    subject: "We've Received Your Custom Solution Request",
    html: buildCustomSolutionUserEmailHtml(requestData),
  }, 'custom solution confirmation');
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    const parsed = contentType.includes('multipart/form-data')
      ? await parseMultipartBody(request)
      : await parseJsonBody(request);

    const rawData = parsed.payload as Record<string, unknown> & { recaptcha?: string };
    const recaptcha = rawData.recaptcha;

    if (ENABLE_RECAPTCHA) {
      if (!recaptcha || recaptcha === 'disabled') {
        return NextResponse.json(
          { message: 'reCAPTCHA verification is required.' },
          { status: 400 }
        );
      }

      const isValid = await verifyRecaptcha(recaptcha);

      if (!isValid) {
        return NextResponse.json(
          { message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    if (parsed.formType === 'request') {
      await handleRequestForm(parsed.payload as RequestPayload & { recaptcha?: string }, parsed.attachments);
    } else if (parsed.formType === 'custom-solution') {
      await handleCustomSolutionForm(parsed.payload, parsed.attachments);
    } else {
      return NextResponse.json({ message: 'Unsupported form type.' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Email configuration is missing.') {
      console.error('SENDGRID_API_KEY, ADMIN_EMAIL or FROM_EMAIL is not set');
      return NextResponse.json({ message: 'Email configuration is missing.' }, { status: 500 });
    }

    console.error('Error submitting request:', error);
    return NextResponse.json({ message: 'Failed to submit request' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Request submitted successfully' }, { status: 200 });
}
