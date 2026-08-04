import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) return null;

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...session.user, role: token.role, id: token.id } as any;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_please_change_in_prod",
});

export { handler as GET, handler as POST };