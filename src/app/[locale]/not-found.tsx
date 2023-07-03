import { useTranslations } from 'next-intl';

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
