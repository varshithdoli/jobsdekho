import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { query, queryOne } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const existing = await queryOne<{ id: string }>(
          "SELECT id FROM profiles WHERE email = $1",
          [user.email]
        );

        if (!existing) {
          const role = adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase() ? "admin" : "user";
          await query(
            `INSERT INTO profiles (id, email, full_name, avatar_url, role, creator_status, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, 'none', NOW(), NOW())`,
            [user.email, user.name || "", user.image || "", role]
          );
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const profile = await queryOne<{
          id: string;
          role: string;
          creator_status: string;
          full_name: string;
        }>(
          "SELECT id, role, creator_status, full_name FROM profiles WHERE email = $1",
          [user.email]
        );

        if (profile) {
          token.userId = profile.id;
          token.role = profile.role;
          token.creatorStatus = profile.creator_status;
          token.fullName = profile.full_name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        (session as unknown as SessionWithRole).user.role = token.role as string;
        (session as unknown as SessionWithRole).user.creatorStatus = token.creatorStatus as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

interface SessionWithRole {
  user: {
    id: string;
    role: string;
    creatorStatus: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export type { SessionWithRole };
