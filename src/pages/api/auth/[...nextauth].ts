import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import type { JWT } from "next-auth/jwt"; // ✅ correct import

// Extend JWT with a customToken
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MyToken extends JWT {
  customToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: MyToken; user?: NextAuthUser }): Promise<MyToken> {
      if (user) {
        await dbConnect();
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            fullName: user.name,
            provider: "google",
          });
        }

        token.customToken = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "7d" }
        );
      }
      return token;
    },
    async session({ session, token }: { session: any; token: MyToken }) {
      session.customToken = token.customToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
