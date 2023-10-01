import { dir } from 'i18next';
import { HomeIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { ArchiveIcon } from 'lucide-react';
import PlausibleProvider from 'next-plausible';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Providers from '@/app/[locale]/provider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { getTranslation } from '@/i18n';
import { languages } from '@/i18n/settings';
import { getServerSideAuthSession } from '@/server/auth';
import '@/styles/globals.css';

const font = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

// export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSideAuthSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const { t } = await getTranslation(locale, 'root-layout');

  return (
    <Providers>
      <html lang={locale} dir={dir(locale)} className={font.className}>
        <head>
          <PlausibleProvider domain="wishlist.raphael-catarino.fr" selfHosted />
        </head>
        <body>
          <div className="container mx-auto lg:ml-[18vw] lg:max-w-4xl xl:max-w-5xl">
            {children}
          </div>
          <nav className="fixed inset-y-4 left-2 right-auto hidden w-[15vw] flex-col border-r pl-2 lg:flex">
            <Link href={`/${locale}/`}>
              <Button variant="link">
                <HomeIcon className="mr-2" />
                {t('nav.home')}
              </Button>
            </Link>
            <Link href={`/${locale}/add`}>
              <Button variant="link">
                <PlusIcon className="mr-2" />
                {t('nav.add')}
              </Button>
            </Link>
            <Link href={`/${locale}/archive`}>
              <Button variant="link">
                <ArchiveIcon className="mr-2" />
                {t('nav.archive')}
              </Button>
            </Link>
            <Link href={`/${locale}/settings`}>
              <Button variant="link">
                <SettingsIcon className="mr-2" />
                {t('nav.settings')}
              </Button>
            </Link>
          </nav>
          <nav className="fixed inset-x-4 bottom-4 mx-auto flex max-w-sm items-center justify-center space-x-4 rounded-2xl bg-card py-2 shadow-sm dark:border dark:border-slate-700 dark:bg-slate-950 lg:hidden">
            <Link href={`/${locale}/`}>
              <Button variant="link">
                <HomeIcon />
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href={`/${locale}/add`}>
              <Button variant="link">
                <PlusIcon />
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href={`/${locale}/archive`}>
              <Button variant="link">
                <ArchiveIcon />
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href={`/${locale}/settings`}>
              <Button variant="link">
                <SettingsIcon />
              </Button>
            </Link>
          </nav>
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
