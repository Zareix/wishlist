import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';

const ArchivePage = () => {
  const t = useTranslations('Archive');
  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
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

export default ArchivePage;
