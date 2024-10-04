import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authorizedEmails = [process.env.GENERIC_LOGIN];
const authorizedDomain = process.env.AUTHORIZED_DOMAIN;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (
        user.email &&
        (authorizedEmails.includes(user.email) ||
          user.email.endsWith(`@${authorizedDomain}`))
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  pages: {
    error: "/",
  },
};
