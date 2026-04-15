import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

import { verifyRecaptcha } from '@/shared/lib/recaptcha';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const propertyLocation = formData.get('propertyLocation') as string;
    const primaryObjective = formData.get('primaryObjective') as string;
    const inheritance = formData.get('inheritance') as string;
    const description = formData.get('description') as string;
    const recaptcha = formData.get('recaptcha') as string;
    const documents = formData.getAll('documents') as File[];

    // Set to false to disable reCAPTCHA verification (useful for development/testing)
    const ENABLE_RECAPTCHA = true;

    // Verify reCAPTCHA token (only if enabled)
    if (ENABLE_RECAPTCHA) {
      if (!recaptcha || recaptcha === 'disabled') {
        return NextResponse.json({ message: 'reCAPTCHA verification is required.' }, { status: 400 });
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

    // Process attachments
    const attachments = await Promise.all(
      documents.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
          content: Buffer.from(arrayBuffer).toString('base64'),
          filename: file.name,
          type: file.type,
          disposition: 'attachment' as const,
        };
      })
    );

    // Escape HTML to prevent XSS
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Create email content for admin
    const msg = {
      to: process.env.ADMIN_EMAIL!,
      from: process.env.FROM_EMAIL!,
      subject: 'New Property Analysis Request',
      html: `
        <h2>New Property Analysis Request</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Property Location:</strong> ${escapeHtml(propertyLocation)}</p>
        <p><strong>Primary Objective:</strong> ${escapeHtml(primaryObjective)}</p>
        <p><strong>Inheritance:</strong> ${escapeHtml(inheritance)}</p>
        <p><strong>Description:</strong> ${escapeHtml(description)}</p>
        ${documents.length > 0 ? `<p><strong>Documents:</strong> ${documents.length} file(s) attached</p>` : ''}
      `,
      attachments,
    };

    // Create confirmation email for user
    const userMsg = {
      to: email,
      from: process.env.FROM_EMAIL!,
      subject: "We've Received Your Message",
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received - bitvera </title>
</head>

<body
    style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #121212;">

        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation"
                    style="max-width: 640px; width: 100%; border-collapse: collapse; background-color: #121212;overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 0;height: 100px;">

                            <img style="width: 100%;height: auto;" src="https://bitvera .com/images/mail-header.png"
                                alt="bitvera  Logo">
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;background: #000;">
                            <p style="margin: 0 0 32px; color: rgba(204, 204, 204, 0.40);
                            font-size: 42px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;">
                                Dear Customer,
                            </p>

                            <p style="margin: 0 0 24px; 
                            color: #CCC;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 300;
                            line-height: normal;">
                               Thank you for contacting <b>bitvera </b>.
                            </p>

                            <p style="margin: 0 0 24px; 
                            color: #CCC;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 300;
                            line-height: normal;">
                               Your message has been received and forwarded to our <b>customer support team</b>. A member of our team will review your request and get back to you shortly using this email address.
                            </p>

                            <p style="margin: 0 0 24px; 
                            color: #CCC;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 300;
                            line-height: normal;">
                               If you have additional details to share, you may reply directly to this message.
                            </p>

                            <p style="margin: 0; color: #FFF;
                            font-size: 20px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;">
                                Kind regards,<br>
                                <strong style="color: #ffffff;">The bitvera  Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="border-top: 1px solid #222; padding: 24px 30px; background: #000;">
                            <a href="mailto:info@bitvera .com" style="color: #FFF;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            text-transform: uppercase;
                            float: left;
                            text-decoration: none;">
                                <img style="margin-right: 8px;margin-bottom: -2px;" width="14" height="14"
                                    src="https://bitvera .com/images/mail-icon.png" alt="bitvera  Mail Icon">
                                info@bitvera .com
                            </a>
                            <img style="width: 124.695px;height: 20px; float: right;"
                                src="https://bitvera .com/images/mail-logo.png" alt="bitvera  Mail Icon">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
      `,
    };

    // Send emails
    await sgMail.send(msg);
    await sgMail.send(userMsg);

    return NextResponse.json({ message: 'Property analysis request sent successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending fund access request:', errorMessage);
    return NextResponse.json(
      { message: 'Failed to send fund access request.', error: errorMessage },
      { status: 500 }
    );
  }
}
