import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const SHORT = process.env.JWT_EXPIRES_IN_SHORT || "7d";
const LONG = process.env.JWT_EXPIRES_IN_LONG || "30d";

if (!JWT_SECRET) throw new Error("JWT_SECRET not set in env");

export function signToken(payload, remember = false) {
  const expiresIn = remember ? LONG : SHORT;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
