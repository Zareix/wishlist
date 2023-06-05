import { useTranslations } from 'next-intl';

import { PageSEO } from '@/components/SEO';

export default function Page404() {
  const t = useTranslations('404');
  return (
    <>
      {/* <PageSEO title={t('pageTitle')} /> */}
      <main>
        <h1>{t('title')}</h1>
      </main>
    </>
  );
}
