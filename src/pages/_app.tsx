import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AbstractIntlMessages, NextIntlProvider } from 'next-intl';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';

import Layout from '@/components/Layout';
import { AppSEO } from '@/components/SEO';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import { api } from '@/utils/api';

const font = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

const MyApp: AppType<{
  session: Session | null;
  messages: AbstractIntlMessages;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <AppSEO />
      <style jsx global>{`
        html {
          --font-sans: ${font.style.fontFamily};
        }
      `}</style>
      <NextIntlProvider messages={pageProps.messages}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
