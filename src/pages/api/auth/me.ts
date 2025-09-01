// GET — returns current user data based on Authorization: Bearer <token>
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/utils/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    await dbConnect();
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    return res
      .status(200)
      .json({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          provider: user.provider,
        },
      });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
