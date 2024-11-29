import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => false,
  },
  pages: {
    signIn: "/login",
  },
});
