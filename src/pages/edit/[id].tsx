import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import AddEditItem from '@/components/AddEditItem';
import { PageSEO } from '@/components/SEO';
import { LoadingFullPage } from '@/components/ui/loading';
import Page404 from '@/pages/404';
import { api } from '@/utils/api';

const EditItem = () => {
  const t = useTranslations('Edit');
  const router = useRouter();
  const itemId = router.query.id as string;
  const itemQuery = api.wishlist.getOne.useQuery(itemId, {
    enabled: !(!itemId || itemId === ''),
  });
  const item = itemQuery.data;

  if (itemQuery.isLoading) {
    return <LoadingFullPage />;
  }

  if (itemQuery.isError || !item) {
    return <Page404 />;
  }

  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>
          {t('title', {
            name: item.name,
          })}
        </h1>
        <AddEditItem
          editing
          item={item}
          onFinish={() => {
            itemQuery.refetch().catch(console.error);
          }}
        />
      </main>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  console.log('getStaticProps', context);

  return {
    props: {
      // eslint-disable-next-line
      messages: (await import(`@/messages/${context.locale}.json`)).default,
    },
  };
}

export default EditItem;
