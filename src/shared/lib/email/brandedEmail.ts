import { WEBSITE_EMAIL, WEBSITE_REGISTERED_ADDRESS } from '@/shared/lib/constants/constants';

const WEBSITE_URL = 'https://bitvera.com';
const EMAIL_HEADER_IMAGE = `${WEBSITE_URL}/images/email-header.png`;
const EMAIL_FOOTER_LOGO_IMAGE = `${WEBSITE_URL}/images/email-foot-logo.png`;

type EmailDetail = {
  label: string;
  value: string;
};

type CreateBrandedEmailOptions = {
  previewTitle: string;
  title: string;
  bodyHtml: string;
  signoffLine1?: string;
  signoffLine2?: string;
};

export const escapeHtml = (value: string | number | null | undefined) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const renderEmailParagraph = (content: string) =>
  `<p style="margin: 0; color: #0f0f19; font-size: 16px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">${content}</p>`;

export const renderEmailDetailsList = (label: string, details: EmailDetail[]) => `
  <div style="display: block;">
    <p style="margin: 0 0 12px; color: #0f0f19; font-size: 16px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
      ${label}
    </p>
    <ul style="margin: 0; padding-left: 24px; color: #0f0f19; font-size: 16px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
      ${details
        .map(
          ({ label: detailLabel, value }) =>
            `<li style="margin: 0 0 4px;"><span>${detailLabel}: ${value}</span></li>`
        )
        .join('')}
    </ul>
  </div>
`;

export const renderEmailLink = (href: string, label: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #eb5e28; text-decoration: underline;">${label}</a>`;

export const createBrandedEmailHtml = ({
  previewTitle,
  title,
  bodyHtml,
  signoffLine1 = 'Safe travels,',
  signoffLine2 = 'Travellio Global',
}: CreateBrandedEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${previewTitle}</title>
  </head>
  <body style="margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;background-color: #ccc6ba;
    max-width: 600px;
    margin: 0 auto;">
      <tr>
        <td align="center" style="padding: 24px 0 0;">
          <table role="presentation" style="width: 595px; max-width: 595px; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 0 20px 24px;">
                <img
                  src="${EMAIL_HEADER_IMAGE}"
                  alt="Travellio Global"
                  style="display: block; width: 555px; max-width: 100%; height: auto; border: 0;"
                />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 20px 24px;">
                <table
                  role="presentation"
                  style="width: 555px; max-width: 100%; border-collapse: separate; border-spacing: 0; background-color: #f9faf5; border-radius: 24px;"
                >
                  <tr>
                    <td style="padding: 40px;">
                      <h1
                        style="margin: 0 0 40px; color: #eb5e28; font-size: 32px; line-height: 1; font-weight: 600; text-align: center; font-family: 'Syne', 'Helvetica Neue', Arial, sans-serif;"
                      >
                        ${title}
                      </h1>
                      <div>${bodyHtml}</div>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 40px;">
                        <tr>
                          <td valign="bottom" style="color: #0f0f19; font-size: 16px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
                            <div>${signoffLine1}</div>
                            <div>${signoffLine2}</div>
                          </td>
                          <td
                            valign="bottom"
                            align="right"
                            style="color: #0f0f19; font-size: 16px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;"
                          >
                            <a
                              href="${WEBSITE_URL}"
                              target="_blank"
                              rel="noopener noreferrer"
                              style="color: #0f0f19; text-decoration: underline;"
                            >
                              bitvera.com
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #eb5e28; padding: 28px 32px 24px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td valign="top" style="padding-right: 24px;">
                      <div style="margin: 0 0 4px; color: rgba(249, 250, 245, 0.5); font-size: 8px; line-height: 1.35; font-weight: 700; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
                        Email:
                      </div>
                      <a
                        href="mailto:${WEBSITE_EMAIL}"
                        style="color: #fffdf1; font-size: 12px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif; text-decoration: underline;"
                      >
                        ${WEBSITE_EMAIL}
                      </a>
                    </td>
                    <td valign="top" style="padding-right: 24px;">
                      <div style="margin: 0 0 4px; color: rgba(249, 250, 245, 0.5); font-size: 8px; line-height: 1.35; font-weight: 700; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
                        Registered address:
                      </div>
                      <div style="color: #fffdf1; font-size: 12px; line-height: 1.35; font-weight: 400; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif;">
                        ${WEBSITE_REGISTERED_ADDRESS}
                      </div>
                    </td>
                    <td align="right" valign="middle" style="width: 58px;">
                      <img
                        src="${EMAIL_FOOTER_LOGO_IMAGE}"
                        alt="Travellio Global"
                        width="57"
                        height="40"
                        style="display: block; width: 57px; height: 40px; border: 0;"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
