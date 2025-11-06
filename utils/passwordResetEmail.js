import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (email, resetToken) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  // Build reset URL - prefer CLIENT_URL/FRONTEND_URL env var, fallback to localhost (dev)
  const clientBase =
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.BASE_URL ||
    "http://localhost:5173";
  const resetUrl = `${clientBase.replace(
    /\/$/,
    ""
  )}/resetPassword/${resetToken}`;

  // Email options (include HTML link for convenience)
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Open the following link to reset your password:\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    html: `
      <!doctype html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="margin:0;padding:0;background:#f6f9fc;font-family:Helvetica,Arial,sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding:20px 10px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:24px;text-align:center;background:linear-gradient(90deg,#667eea,#764ba2);color:#fff;">
                    <h2 style="margin:0;font-size:20px;">Reset your TripNest password</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;color:#333;">
                    <p style="font-size:16px;line-height:1.5;margin:0 0 16px;">We received a request to reset the password for your account. Tap the button below to set a new password.</p>
                    <p style="text-align:center;margin:18px 0;">
                      <a href="${resetUrl}" style="display:inline-block;padding:14px 22px;background:#667eea;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">Reset password</a>
                    </p>
                    <p style="font-size:14px;color:#666;line-height:1.4;margin:0 0 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break:break-all;font-size:13px;color:#1a73e8;margin:0 0 8px;"><a href="${resetUrl}" style="color:#1a73e8;text-decoration:none;">${resetUrl}</a></p>
                    <p style="font-size:13px;color:#999;margin-top:18px;">If you didn't request this, you can safely ignore this email. This link will expire soon.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px;text-align:center;font-size:12px;color:#999;background:#f7fafc;">TripNest • Support</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  // Log reset URL in development to make testing easier
  if (process.env.NODE_ENV === "development") {
    console.info(`Password reset URL for ${email}: ${resetUrl}`);
  }

  // Send email
  await transporter.sendMail(mailOptions);
};
