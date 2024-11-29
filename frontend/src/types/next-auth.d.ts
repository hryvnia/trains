import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      //
      id: string;
      email: string;
      username: string;
    };
  }
}
