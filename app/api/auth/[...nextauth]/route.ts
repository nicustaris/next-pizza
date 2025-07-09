import NextAuth, { Account, Session, SessionStrategy, User } from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { JWT } from "next-auth/jwt";

// TODO: Fix callback types different way.

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          findUser.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        // if (!findUser.verified) {
        //   return null;
        // }

        return {
          id: String(findUser.id),
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }

        if (!user.email) {
          return false;
        }
        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId as string,
              },
              { email: user.email },
            ],
          },
        });

        if (findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId as string,
            },
          });

          return true;
        }

        await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name || "User #" + user.id,
            password: hashSync(user.id.toString(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerId as string,
          },
        });

        return true;
      } catch (error) {
        console.log("[SIGNIN] Error", error);
        return false;
      }
    },
    async jwt({ token }: { token: JWT }) {
      if (!token.email) {
        return token;
      }

      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        (token.id = String(findUser.id)),
          (token.email = findUser.email),
          (token.fullName = findUser.fullName),
          (token.role = findUser.role);
      }

      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
