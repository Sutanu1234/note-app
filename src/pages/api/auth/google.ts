// pages/api/auth/google-login.ts
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { OAuth2Client } from "google-auth-library";
import { signToken } from "@/utils/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { idToken, rememberMe = false } = req.body;

  if (!idToken) return res.status(400).json({ error: "idToken required" });

  await dbConnect();

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload || {};

    if (!email) return res.status(400).json({ error: "Google token has no email" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        provider: "google",
        googleId,
      });
    }

    const token = signToken({ id: user._id }, rememberMe);

    res.status(200).json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid Google token" });
  }
}
