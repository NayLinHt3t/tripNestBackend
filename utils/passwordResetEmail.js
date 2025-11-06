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

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Here is your token: ${resetToken}`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};
