import Head from 'next/head';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Loading, LoadingFullPage } from '@/components/ui/Loading';
import { api } from '@/utils/api';
import { protectedRoute } from '@/utils/routes';

const HomePage = () => {
  const { data, isLoading, isSuccess, refetch } =
    api.categories.getAll.useQuery();

  if (isLoading) {
    return <LoadingFullPage />;
  }

  if (!isSuccess) {
    return (
      <main>
        <h1 className="text-red-600">Something went wrong</h1>
        <Button
          onClick={() => {
            refetch().catch(console.error);
          }}
        >
          Refresh
        </Button>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Wishlist</title>
        <meta name="description" content="Your new favorite wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Wishlist</h1>
        <Accordion type="multiple" className="mt-2 space-y-2">
          {data
            .filter((x) => x._count.wishlistItems > 0)
            .map((category) => (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <CategoryContent categoryId={category.id} />
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </main>
    </>
  );
};

const CategoryContent = ({ categoryId }: { categoryId: string }) => {
  const { data, isLoading, isSuccess } =
    api.wishlist.getAll.useQuery(categoryId);

  if (isLoading) {
    return <Loading className="mx-auto h-6 w-6" />;
  }

  if (!isSuccess) {
    return <></>;
  }

  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export const getServerSideProps = protectedRoute();

export default HomePage;
