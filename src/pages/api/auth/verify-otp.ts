// POST { email, code, purpose: 'login'|'signup', fullName?, dob?, rememberMe? }

import dbConnect from "@/lib/mongodb";
import OTP from "@/models/OTP";
import User from "@/models/User";
import { signToken } from "@/utils/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const {
    email,
    code,
    purpose = "login",
    fullName,
    dob,
    rememberMe = false,
  } = req.body || {};
  if (!email || !code)
    return res.status(400).json({ error: "email and code required" });

  await dbConnect();
  const otp = await OTP.findOne({ email, purpose });
  if (!otp)
    return res.status(400).json({ error: "No OTP found. Request a new one." });

  if (new Date() > otp.expiresAt)
    return res.status(400).json({ error: "OTP expired" });
  if (otp.code !== String(code)) {
    otp.attempts += 1;
    await otp.save();
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // OTP is valid — remove it
  await OTP.deleteOne({ _id: otp._id });

  if (purpose === "signup") {
    // create user
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ error: "Email already registered" });
    user = await User.create({
      fullName,
      dob: dob ? new Date(dob) : undefined,
      email,
      provider: "email",
    });

    const token = signToken({ id: user._id }, rememberMe);
    return res
      .status(200)
      .json({
        ok: true,
        token,
        user: { id: user._id, email: user.email, fullName: user.fullName },
      });
  }

  // purpose === 'login'
  let user = await User.findOne({ email });
  if (!user) {
    // user not found — maybe they should sign up
    return res
      .status(400)
      .json({ error: "No user found for this email. Please register." });
  }

  const token = signToken({ id: user._id }, rememberMe);
  return res
    .status(200)
    .json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
}
