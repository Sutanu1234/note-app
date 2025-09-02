import { verifyToken, JwtPayload } from "@/utils/jwt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const auth = req.headers.authorization || "";
      if (!auth.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });

      const token = auth.split(" ")[1];
      const decoded = verifyToken(token);

      // Narrow the type to JwtPayload
      if (typeof decoded !== "object" || !("id" in decoded)) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const userId = (decoded as JwtPayload).id;
      await dbConnect();
      const user = await User.findById(userId).lean();

      if (!user) return res.status(401).json({ error: "User not found" });

      req.user = user;
      return handler(req, res);
    } catch (err: unknown) {
      console.error(err);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
