import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';

import ItemCard from '@/components/ItemCard';
import { PageSEO } from '@/components/SEO';
import { api } from '@/utils/api';

const ArchivePage = () => {
  const t = useTranslations('Archive');
  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('title')}</h1>
        <ArchiveContent />
      </main>
    </>
  );
};

const ArchiveContent = () => {
  const itemsQuery = api.wishlist.getAll.useQuery({
    states: ['BOUGHT', 'CANCELED'],
    includeCategory: true,
  });

  if (itemsQuery.isLoading) return <></>;
  if (!itemsQuery.isSuccess || !itemsQuery.data) return <></>;
  if (itemsQuery.data.length === 0) return <></>;

  const items = itemsQuery.data.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <section className="mt-4 grid gap-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} canEdit />
      ))}
    </section>
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
