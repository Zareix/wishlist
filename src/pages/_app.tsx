import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';

import Layout from '@/components/Layout';
import '@/styles/globals.css';
import { api } from '@/utils/api';

const font = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          --font-sans: ${font.style.fontFamily};
        }
      `}</style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
