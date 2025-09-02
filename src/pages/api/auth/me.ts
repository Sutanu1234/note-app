import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, JwtPayload } from "@/utils/jwt";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();

  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    // Ensure decoded is an object with `id`
    if (typeof decoded === "string" || !("id" in decoded)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    await dbConnect();
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        provider: user.provider,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
