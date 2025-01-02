export const MESSAGE_SEND_OTP = (email: string, otp: number) => ({
  to: email,
  from: process.env.GMAIL_USERNAME || '',
  attachDataUrls: true,
  generateTextFromHTML: true,
  subject: `【FixChocolate】Your OTP for Verification`,
  html: `<p>Hello,</p>
    <p>You are receiving this email because you requested an OTP for verification on FixChocolate.</p>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,<br />The FixChocolate Team</p>`,
});
