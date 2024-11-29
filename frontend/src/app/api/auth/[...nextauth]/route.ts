import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          console.log("credentials > ", credentials);
          const {
            data: { user, token },
          } = await axios.post<{
            token: string;
            user: {
              id: string;
              email: string;
            };
          }>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            ...credentials,
          });

          return { ...user, token };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
            throw new Error(error.response?.data?.message);
          }
          throw new Error(undefined);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      //@ts-ignore
      session.user = token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
