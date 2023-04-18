import { type GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import AddEditItem from '@/components/AddEditItem';
import { LoadingFullPage } from '@/components/ui/loading';
import Page404 from '@/pages/404';
import { api } from '@/utils/api';

const EditItem = () => {
  const router = useRouter();
  const itemId = router.query.id as string;
  const itemQuery = api.wishlist.getOne.useQuery(itemId);
  const item = itemQuery.data;

  if (itemQuery.isLoading) {
    return <LoadingFullPage />;
  }

  if (itemQuery.isError || !item) {
    return <Page404 />;
  }

  return (
    <main>
      <h1>
        Editing{' '}
        <span className="font-semibold text-secondary-foreground">
          &apos;{item.name}&apos;
        </span>
      </h1>
      <AddEditItem
        item={item}
        onFinish={() => {
          itemQuery.refetch().catch(console.error);
        }}
      />
    </main>
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
