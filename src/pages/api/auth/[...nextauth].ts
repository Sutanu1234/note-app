import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        // Check if user exists in DB
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            fullName: user.name,
            provider: "google",
          });
        }
        // Generate a custom JWT to use in /me
        token.customToken = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "7d" }
        );
      }
      return token;
    },
    async session({ session, token }) {
      session.customToken = token.customToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
