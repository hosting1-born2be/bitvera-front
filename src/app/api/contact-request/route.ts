import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL;

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!SENDGRID_API_KEY || !ADMIN_EMAIL || !FROM_EMAIL) {
      return NextResponse.json({ message: 'Email service is not configured.' }, { status: 500 });
    }

    const formData = await request.formData();
    const fullName = (formData.get('fullName') as string) ?? '';
    const email = (formData.get('email') as string) ?? '';
    const phone = (formData.get('phone') as string) ?? '';
    const companyName = (formData.get('companyName') as string) || null;
    const website = (formData.get('website') as string) || null;
    const projectType = (formData.get('projectType') as string) ?? '';
    const projectTypeOther = (formData.get('projectTypeOther') as string) || null;
    const investmentRange = (formData.get('investmentRange') as string) ?? '';
    const goals = (formData.get('goals') as string) || null;
    const frictionPoints = (formData.get('frictionPoints') as string) || null;
    const clientContext = (formData.get('clientContext') as string) || null;
    const timing = (formData.get('timing') as string) ?? '';
    const followUp = (formData.get('followUp') as string) ?? '';
    const attachmentFiles = formData.getAll('attachments') as File[];

    if (!fullName || !email || !phone || !projectType || !investmentRange || !timing || !followUp) {
      return NextResponse.json({ message: 'Please fill in all required fields.' }, { status: 400 });
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    const attachments = await Promise.all(
      attachmentFiles
        .filter((f): f is File => f instanceof File && f.size > 0)
        .map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            content: Buffer.from(arrayBuffer).toString('base64'),
            filename: file.name,
            type: file.type || 'application/octet-stream',
            disposition: 'attachment' as const,
          };
        })
    );

    const adminHtml = `
      <h2>New Home Request</h2>
      <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${companyName ? `<p><strong>Company:</strong> ${escapeHtml(companyName)}</p>` : ''}
      ${website ? `<p><strong>Website:</strong> ${escapeHtml(website)}</p>` : ''}
      <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
      ${
        projectTypeOther
          ? `<p><strong>Project Type (Other):</strong> ${escapeHtml(projectTypeOther)}</p>`
          : ''
      }
      <p><strong>Investment Range:</strong> ${escapeHtml(investmentRange)}</p>
      ${goals ? `<p><strong>Goals:</strong> ${escapeHtml(goals)}</p>` : ''}
      ${
        frictionPoints
          ? `<p><strong>Friction Points:</strong> ${escapeHtml(frictionPoints)}</p>`
          : ''
      }
      ${clientContext ? `<p><strong>Client Context:</strong> ${escapeHtml(clientContext)}</p>` : ''}
      <p><strong>Timing:</strong> ${escapeHtml(timing)}</p>
      <p><strong>Follow Up:</strong> ${escapeHtml(followUp)}</p>
      ${
        attachments.length > 0
          ? `<p><strong>Attachments:</strong> ${attachments.length} file(s)</p>`
          : ''
      }
    `;

    const adminMsg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: 'New Home Request',
      html: adminHtml,
      attachments,
    };

    const safeFirstName = escapeHtml(fullName.split(' ')[0] || fullName);

    const userMsg = {
      to: email,
      from: FROM_EMAIL,
      subject: "We've Received Your Request",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request Received - Travellio Global</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fff; color: #333;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 640px; width: 100%; border-collapse: collapse; background-color: #fff; overflow: hidden;">
          <tr>
            <td style="padding: 0; height: 100px;">
              <img style="width: 100%; height: auto;" src="https://bitvera.com/images/email-header.png" alt="Travellio Global Logo">
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; background: #fff;">
              <p style="margin: 0 0 32px; color: #333;font-size: 24px;font-style: normal;font-weight: 400;line-height: 140%;">
                Dear ${safeFirstName},
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Thank you for contacting <b>Travellio Global</b>. We have received your inquiry, and our team is currently reviewing your request.
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                We understand that timely communication is critical to your business objectives. One of our consultants will reach out to you within <b>24–48 hours</b> to discuss how we can best support your goals.
              </p>
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                In the meantime, feel free to explore our latest insights at <a href="https://bitvera.com" style="color: #333;font-weight: 700;text-decoration: underline;" target="_blank">bitvera.com</a>.
              </p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
              <p style="margin: 0 0 24px; color: #333;font-size: 16px;font-style: normal;font-weight: 400;line-height: 140%;">
                Best regards,<br>
                <strong style="color: #333;">The Travellio Global Team</strong><br>
                <span style="font-size:16px;">
                  Strategic Solutions for Modern Business
                </span>
              </p>
              <p style="margin: 0; color: #333;font-size: 18px;font-style: normal;font-weight: 400;line-height: 140%;">
                <a href="https://bitvera.com" target="_blank" style="color: #333;font-weight: 400;text-decoration: underline;">bitvera.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0; height: 100px;">
              <img style="width: 100%; height: auto;" src="https://bitvera.com/images/email-footer.png" alt="Travellio Global Logo">
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

    await sgMail.send(adminMsg);
    await sgMail.send(userMsg);

    return NextResponse.json({ message: 'Request sent successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Contact request error:', errorMessage);
    return NextResponse.json(
      { message: 'Failed to send request.', error: errorMessage },
      { status: 500 }
    );
  }
}
