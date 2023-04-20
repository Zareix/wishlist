import { LogOut } from 'lucide-react';
import { type GetStaticPropsContext } from 'next';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { PageSEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const t = useTranslations('Settings');
  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('title')}</h1>
        <Separator className="my-4" />
        <div className="flex justify-center">
          <Button onClick={() => signOut().catch(console.error)}>
            <LogOut className="mr-2" />
            {t('logout')}
          </Button>
        </div>
      </main>
    </>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // eslint-disable-next-line
      messages: (await import(`@/messages/${context.locale}.json`)).default,
    },
  };
}

export default SettingsPage;
