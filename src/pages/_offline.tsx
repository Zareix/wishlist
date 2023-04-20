import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';

import { PageSEO } from '@/components/SEO';

const OfflinePage = () => {
  const t = useTranslations('Offline');
  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('message')}</h1>
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

export default OfflinePage;
