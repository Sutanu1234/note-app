import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import OTP from "@/models/OTP";
import User from "@/models/User";
import { sendOTPEmail } from "@/utils/mailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, purpose = "login" } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email" });
    }

    await dbConnect();

    if (purpose === "signup") {
      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Email already registered. Please login." });
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP code:", code);
    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email, purpose },
      { $set: { code, expiresAt, attempts: 0 } },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, code);

    return res.status(200).json({ ok: true, message: "OTP sent" });
  } catch (err: any) {
    console.error("request-otp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
