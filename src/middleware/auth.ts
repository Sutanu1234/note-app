import { verifyToken } from "@/utils/jwt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const auth = req.headers.authorization || "";
      if (!auth.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });
      const token = auth.split(" ")[1];
      const decoded = verifyToken(token);
      await dbConnect();
      const user = await User.findById(decoded.id).lean();
      if (!user) return res.status(401).json({ error: "User not found" });
      req.user = user;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
