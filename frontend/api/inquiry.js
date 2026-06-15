const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SUBJECT = 'New Private Inquiry — Neapolitan Concierge';
const FROM_EMAIL = 'Neapolitan Concierge <inquiries@neapolitanconcierge.com>';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const normalizeField = (value, maxLength) => (
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
);

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseRequestBody = (body) => {
  if (typeof body !== 'string') {
    return body || {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const getRequestId = (request) => (
  request.headers?.['x-vercel-id']
  || request.headers?.['x-request-id']
  || `local-${Date.now()}`
);

const maskEmail = (email) => {
  const [localPart, domain] = String(email).split('@');

  if (!localPart || !domain) {
    return 'invalid-email';
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
};

const parseResendError = async (resendResponse) => {
  const responseText = await resendResponse.text();

  try {
    const parsedError = JSON.parse(responseText);
    return {
      code: parsedError.name || parsedError.code || 'resend_error',
      message: parsedError.message || 'Resend rejected the email request.',
    };
  } catch {
    return {
      code: 'resend_error',
      message: responseText || 'Resend rejected the email request.',
    };
  }
};

const buildEmailHtml = ({ name, email, interest, message }) => `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;background:#f8f6f2;color:#191816;font-family:Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:48px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e5dfd2;">
              <tr>
                <td style="padding:38px 42px 30px;border-bottom:1px solid #e5dfd2;">
                  <p style="margin:0 0 12px;color:#9b7f45;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Private Inquiry</p>
                  <h1 style="margin:0;color:#191816;font-family:Georgia,serif;font-size:32px;font-weight:normal;line-height:1.2;">Neapolitan Concierge</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:34px 42px 42px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:0 0 22px;">
                        <p style="margin:0 0 6px;color:#9b7f45;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Name</p>
                        <p style="margin:0;font-size:16px;line-height:1.6;">${escapeHtml(name)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 22px;">
                        <p style="margin:0 0 6px;color:#9b7f45;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Email</p>
                        <p style="margin:0;font-size:16px;line-height:1.6;"><a href="mailto:${escapeHtml(email)}" style="color:#191816;">${escapeHtml(email)}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 22px;">
                        <p style="margin:0 0 6px;color:#9b7f45;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Area of Interest</p>
                        <p style="margin:0;font-size:16px;line-height:1.6;">${escapeHtml(interest)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin:0 0 10px;color:#9b7f45;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Message</p>
                        <div style="padding:20px 22px;background:#f8f6f2;border-left:2px solid #c6a96b;font-size:15px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</div>
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

const buildEmailText = ({ name, email, interest, message }) => [
  'New Private Inquiry — Neapolitan Concierge',
  '',
  `Name: ${name}`,
  `Email: ${email}`,
  `Area of interest: ${interest}`,
  '',
  'Message:',
  message,
].join('\n');

module.exports = async function handler(request, response) {
  const requestId = getRequestId(request);

  if (request.method !== 'POST') {
    console.warn('[inquiry] Rejected non-POST request.', {
      requestId,
      method: request.method,
    });
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const inquiryToEmail = process.env.INQUIRY_TO_EMAIL;

  console.info('[inquiry] Request received.', {
    requestId,
    hasResendApiKey: Boolean(resendApiKey),
    hasInquiryToEmail: Boolean(inquiryToEmail),
  });

  if (!resendApiKey || !inquiryToEmail) {
    console.error('[inquiry] Required environment variables are missing.', {
      requestId,
      missingResendApiKey: !resendApiKey,
      missingInquiryToEmail: !inquiryToEmail,
    });
    return response.status(500).json({
      error: 'Private inquiries are temporarily unavailable. Please try again shortly.',
      code: 'email_configuration_missing',
      requestId,
    });
  }

  const requestBody = parseRequestBody(request.body);
  const name = normalizeField(requestBody.name, 120);
  const email = normalizeField(requestBody.email, 254);
  const interest = normalizeField(requestBody.interest, 120);
  const message = normalizeField(requestBody.message, 3000);

  console.info('[inquiry] Payload parsed.', {
    requestId,
    hasName: Boolean(name),
    hasEmail: Boolean(email),
    hasInterest: Boolean(interest),
    messageLength: message.length,
  });

  if (!name || !isValidEmail(email) || !interest || !message) {
    console.warn('[inquiry] Payload validation failed.', {
      requestId,
      validName: Boolean(name),
      validEmail: isValidEmail(email),
      validInterest: Boolean(interest),
      validMessage: Boolean(message),
    });
    return response.status(400).json({
      error: 'Please complete every field with valid information.',
      code: 'invalid_inquiry',
      requestId,
    });
  }

  try {
    console.info('[inquiry] Sending email through Resend.', {
      requestId,
      from: FROM_EMAIL,
      to: maskEmail(inquiryToEmail),
      replyTo: maskEmail(email),
    });

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [inquiryToEmail],
        reply_to: email,
        subject: SUBJECT,
        html: buildEmailHtml({ name, email, interest, message }),
        text: buildEmailText({ name, email, interest, message }),
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await parseResendError(resendResponse);
      console.error('[inquiry] Resend rejected the email.', {
        requestId,
        status: resendResponse.status,
        code: resendError.code,
        message: resendError.message,
      });
      return response.status(502).json({
        error: 'We could not deliver your inquiry. Please try again in a moment.',
        code: resendError.code,
        requestId,
      });
    }

    const resendResult = await resendResponse.json().catch(() => ({}));
    console.info('[inquiry] Email accepted by Resend.', {
      requestId,
      emailId: resendResult.id || 'not-returned',
    });

    return response.status(200).json({
      success: true,
      requestId,
    });
  } catch (error) {
    console.error('[inquiry] Resend request failed.', {
      requestId,
      message: error instanceof Error ? error.message : 'Unknown delivery error.',
    });
    return response.status(502).json({
      error: 'We could not deliver your inquiry. Please try again in a moment.',
      code: 'resend_request_failed',
      requestId,
    });
  }
};
