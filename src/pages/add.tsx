import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import AddEditItem from '@/components/AddEditItem';
import { PageSEO } from '@/components/SEO';
import { Loading } from '@/components/ui/loading';
import { api } from '@/utils/api';

const AddPage = () => {
  const router = useRouter();
  const { url } = router.query;
  const crawlerQuery = api.crawler.crawl.useQuery(
    { url: url as string },
    {
      enabled: url !== undefined && url !== '' && typeof url === 'string',
    },
  );
  const t = useTranslations('Add');

  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('title')}</h1>
        {url !== undefined && url !== '' && typeof url === 'string' ? (
          crawlerQuery.isLoading ? (
            <p className="flex items-center gap-2">
              <Loading />
              Crawling url
            </p>
          ) : (
            <AddEditItem item={crawlerQuery.data} />
          )
        ) : (
          <AddEditItem />
        )}
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

export default AddPage;
