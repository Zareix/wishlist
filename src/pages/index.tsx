import { TabsContent } from '@radix-ui/react-tabs';
import Head from 'next/head';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import CurrencyIcon from '@/components/ui/CurrencyIcon';
import { LoadingFullPage } from '@/components/ui/Loading';
import { ScrollAreaHorizontal } from '@/components/ui/ScrollArea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { type RouterOutputs, api } from '@/utils/api';

const HomePage = () => {
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
        <title>Wishlist</title>
        <meta name="description" content="Your new favorite wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Wishlist</h1>
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
  category:
    | RouterOutputs['categories']['getAllComplete'][0]
    | RouterOutputs['categories']['getAllComplete'][0]['subCategories'][0];
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
    <div className="mt-2 rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700">
      <h4 className="flex items-center">
        {item.name}
        {item.price && (
          <>
            <span className="subtle ml-auto">{item.price}</span>
            <CurrencyIcon
              currency={item.currency}
              className="subtle ml-1 h-4 w-4"
            />
          </>
        )}
      </h4>
      <div>
        <ScrollAreaHorizontal className="ml-auto h-24 w-1/3 bg-slate-800">
          <div className="flex h-full items-center">
            {item.images.length > 0 &&
              item.images.map((image, index) => (
                /* eslint-disable-next-line @next/next/no-img-element*/
                <img
                  key={image.id}
                  src={image.image}
                  alt={`${index} of ${item.name}`}
                />
              ))}
          </div>
        </ScrollAreaHorizontal>
      </div>
    </div>
  );
};

export default HomePage;
