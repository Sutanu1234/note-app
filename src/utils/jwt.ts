import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET as string;
const SHORT = process.env.JWT_EXPIRES_IN_SHORT || "7d";
const LONG = process.env.JWT_EXPIRES_IN_LONG || "30d";

if (!JWT_SECRET) throw new Error("JWT_SECRET not set in env");

export interface SignTokenPayload {
  [key: string]: unknown;
}

export function signToken(payload: SignTokenPayload, remember: boolean = false): string {
  const expiresIn: string = remember ? LONG : SHORT;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export interface JwtPayload {
  [key: string]: unknown;
}

export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, JWT_SECRET as string);
}
