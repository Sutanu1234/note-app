import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const SHORT = process.env.JWT_EXPIRES_IN_SHORT || "7d";
const LONG = process.env.JWT_EXPIRES_IN_LONG || "30d";

if (!JWT_SECRET) throw new Error("JWT_SECRET not set in env");

export interface SignTokenPayload {
  [key: string]: unknown;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function signToken(payload: SignTokenPayload, remember: boolean = false): string {
  const expiresIn = (remember ? LONG : SHORT) as any; // <-- cast to any
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export interface JwtPayload {
  [key: string]: unknown;
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
