import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});


export async function sendOTPEmail(to, code) {
const from = process.env.EMAIL_FROM || 'no-reply@example.com';
const subject = `Your OTP code`;
const text = `Your verification code is: ${code}. It will expire shortly.`;
const html = `<p>Your verification code is: <b>${code}</b></p><p>If you didn't request this, ignore this email.</p>`;


await transporter.sendMail({ from, to, subject, text, html });
}