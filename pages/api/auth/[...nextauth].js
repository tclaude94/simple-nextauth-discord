import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async (session, user) => {
      session.user.id = user.id;
      session.user.discriminator = user.discriminator;
      session.user.accessToken = user.accessToken;
      session.user.completeName = session.user.name + "#" + user.discriminator;
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        const { id, discriminator } = profile;
        token.auth_time = Math.floor(Date.now() / 1000);
        token = {
          ...token,
          id,
          discriminator,
          accessToken: account.accessToken,
        };
      }
      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
