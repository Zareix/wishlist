import { TabsContent } from '@radix-ui/react-tabs';
import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';

import CategoryContent from '@/components/CategoryContent';
import { PageSEO } from '@/components/SEO';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LoadingFullPage } from '@/components/ui/loading';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/utils/api';

const HomePage = () => {
  const t = useTranslations('Index');
  const {
    data: categories,
    isLoading,
    isSuccess,
    refetch,
  } = api.categories.getAll.useQuery();

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
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('title')}</h1>
        {categories.length > 0 && (
          <Tabs defaultValue={categories[0]?.id} className="mt-4">
            <ScrollAreaHorizontal>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollAreaHorizontal>
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <CategoryContent categoryId={category.id} />
                {category.subCategories.length > 0 && (
                  <Accordion type="multiple" className="mt-4">
                    {category.subCategories
                      .filter((x) => x._count.wishlistItems > 0)
                      .map((subCategory) => (
                        <AccordionItem
                          key={subCategory.id}
                          value={subCategory.id}
                        >
                          <AccordionTrigger>
                            {subCategory.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <CategoryContent categoryId={subCategory.id} />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                )}
              </TabsContent>
            ))}
          </Tabs>
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

export default HomePage;
