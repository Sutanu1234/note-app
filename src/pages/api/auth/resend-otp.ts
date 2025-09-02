import dbConnect from "@/lib/mongodb";
import OTP from "@/models/OTP";
import { sendOTPEmail } from "@/utils/mailer";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req:any, res:any) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, purpose = "login" } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  await dbConnect();
  const otp = await OTP.findOne({ email, purpose });
  if (!otp)
    return res
      .status(400)
      .json({ error: "No OTP to resend. Request a new OTP first." });

  const limit = Number(process.env.OTP_RESEND_LIMIT || 5);
  if (otp.resendCount >= limit)
    return res.status(429).json({ error: "Resend limit reached" });

  otp.resendCount += 1;
  // refresh expiry
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  otp.expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  await otp.save();

  try {
    await sendOTPEmail(email, otp.code);
    return res.status(200).json({ ok: true, message: "OTP resent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to resend OTP" });
  }
}
