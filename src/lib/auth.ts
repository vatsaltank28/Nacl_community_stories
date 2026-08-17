import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "nacl_community_super_secure_jwt_secret_key_2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const db = await connectToDatabase();
          if (db) {
            const existingUser = await User.findOne({ email: user.email.toLowerCase() });

            if (existingUser) {
              // Update profile picture or name if changed in Google
              let needsUpdate = false;
              if (user.image && existingUser.image !== user.image) {
                existingUser.image = user.image;
                needsUpdate = true;
              }
              if (user.name && existingUser.name !== user.name) {
                existingUser.name = user.name;
                needsUpdate = true;
              }
              if (needsUpdate) {
                await existingUser.save();
              }
            } else {
              // Create new MongoDB user document on first login
              await User.create({
                name: user.name || user.email.split("@")[0],
                email: user.email.toLowerCase(),
                image: user.image || "",
                provider: "google",
                role: "user",
              });
            }
          }
          return true;
        } catch (error) {
          console.error("MongoDB signIn sync notification:", error);
          return true;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user && user.email) {
        try {
          const db = await connectToDatabase();
          if (db) {
            const dbUser = await User.findOne({ email: user.email.toLowerCase() });
            if (dbUser) {
              token.id = dbUser._id.toString();
              token.role = dbUser.role || "user";
              token.picture = dbUser.image || user.image;
            } else {
              token.role = "user";
            }
          } else {
            token.role = "user";
          }
        } catch (e) {
          token.role = "user";
        }
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "user";
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
