import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

import {
  createBrandedEmailHtml,
  escapeHtml,
  renderEmailParagraph,
} from '@/shared/lib/email/brandedEmail';
import { verifyRecaptcha } from '@/shared/lib/recaptcha';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string;
    const recaptcha = formData.get('recaptcha') as string;

    // Set to false to disable reCAPTCHA verification (useful for development/testing)
    const ENABLE_RECAPTCHA = true;

    // Verify reCAPTCHA token (only if enabled)
    if (ENABLE_RECAPTCHA) {
      if (!recaptcha || recaptcha === 'disabled') {
        return NextResponse.json(
          { message: 'reCAPTCHA verification is required.' },
          { status: 400 }
        );
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptcha);
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Initialize SendGrid with API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    // Create email content for admin
    const msg = {
      to: process.env.ADMIN_EMAIL!,
      from: process.env.FROM_EMAIL!,
      subject: 'New Contact Request',
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Message:</strong> ${escapeHtml(message)}</p>
      `,
    };

    // Create confirmation email for user
    const userMsg = {
      to: email,
      from: process.env.FROM_EMAIL!,
      subject: "We've Received Your Message",
      html: createBrandedEmailHtml({
        previewTitle: 'Thank you for reaching out to Travellio Global!',
        title: 'Thank you for reaching out to Travellio Global!',
        bodyHtml: [
          renderEmailParagraph(
            'Your message has been successfully received. Our team will review your inquiry carefully and respond shortly.'
          ),
          renderEmailParagraph('We appreciate your interest and look forward to assisting you.'),
        ].join('<div style="height: 24px; line-height: 24px;">&nbsp;</div>'),
      }),
    };

    // Send emails
    await sgMail.send(msg);
    await sgMail.send(userMsg);

    return NextResponse.json({ message: 'Contact request sent successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending contact request:', errorMessage);
    return NextResponse.json(
      { message: 'Failed to send contact request.', error: errorMessage },
      { status: 500 }
    );
  }
}
