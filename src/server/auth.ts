import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type GetServerSidePropsContext } from 'next';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { cookies, headers } from 'next/headers';

import { env } from '@/env.mjs';
import { db } from '@/server/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      hasAccessTo?: User[];
    } & DefaultSession['user'];
  }

  interface User {
    // ...other properties
    hasAccessTo?: User[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        hasAccessTo: (
          await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include: {
              hasAccessTo: true,
            },
          })
        )?.hasAccessTo,
      },
    }),
  },
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const getServerSideAuthSession = () => {
  return getServerSession(authOptions);
};

export const getServerActionSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await getServerSession(req, res, authOptions);
  return session;
};
