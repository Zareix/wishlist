import { TabsContent } from '@radix-ui/react-tabs';
import { Edit } from 'lucide-react';
import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CurrencyIcon from '@/components/ui/currency-icon';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingFullPage } from '@/components/ui/loading';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type RouterOutputs, api } from '@/utils/api';

const HomePage = () => {
  const t = useTranslations('Index');
  const {
    data: categories,
    isLoading,
    isSuccess,
    refetch,
  } = api.categories.getAllComplete.useQuery();

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
        <title>{t('title')}</title>
        <meta name="description" content="Your new favorite wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                <CategoryContent category={category} />
                {category.subCategories.length > 0 && (
                  <Accordion type="multiple" className="mt-4">
                    {category.subCategories
                      .filter((x) => x.wishlistItems.length > 0)
                      .map((subCategory) => (
                        <AccordionItem
                          key={subCategory.id}
                          value={subCategory.id}
                        >
                          <AccordionTrigger>
                            {subCategory.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <CategoryContent category={subCategory} />
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

const CategoryContent = ({
  category,
}: {
  category: Pick<
    RouterOutputs['categories']['getAllComplete'][0],
    'id' | 'wishlistItems'
  >;
}) => {
  if (category.wishlistItems.length === 0) return <></>;

  return (
    <ul className="space-y-2">
      {category.wishlistItems.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
};

const ItemCard = ({
  item,
}: {
  item: RouterOutputs['categories']['getAllComplete'][0]['wishlistItems'][0];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {item.name}
          {item.price && (
            <>
              <span className="muted ml-auto">{item.price}</span>
              <CurrencyIcon
                currency={item.currency}
                className="muted h-4 w-4"
              />
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {item.images.length > 0 && (
          <ScrollAreaHorizontal className="ml-auto w-1/3">
            <div className="flex h-full items-center gap-2">
              {item.images.map((image, index) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={image.image}
                      alt={`${index} of ${item.name}`}
                      className="max-h-28 rounded-sm"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={image.image}
                      alt={`${index} of ${item.name}`}
                      className="max-h-[70vh] rounded-sm"
                    />
                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button>Close</Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollAreaHorizontal>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
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
