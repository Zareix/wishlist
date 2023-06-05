import { useLocale } from 'next-intl';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

const font = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();

  if (params.locale !== locale) {
    notFound();
  }

  return (
    <html lang={locale} className={font.className}>
      {/* <AppSEO /> */}
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
