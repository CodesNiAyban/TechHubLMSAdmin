import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { getUserByID } from "../data/user"
import authConfig from "./auth.config"
import prisma from "./lib/prisma"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/../data/two-factor-confirmation"

declare module "@auth/core" {
  interface Session {
    user: {
      role: "ADMIN" | "GUEST"
    } & DefaultSession["user"]
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByID(user.id! || "");

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await
          getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) {
          return false; 
        }

        const hasExpired = new Date(twoFactorConfirmation.expires) < new Date();

        if (hasExpired) {
          await prisma.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          });
          return false;
        }
      }

      return true;
    },
    async session({ token, session }) {

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      console.log(token)

      const existingUser = await getUserByID(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    }
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
})