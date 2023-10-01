'use client';

import { TabsContent } from '@radix-ui/react-tabs';
import { EyeOffIcon } from 'lucide-react';
import Link from 'next/link';

import CategoryContent from '@/components/CategoryContent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type getCategories } from '@/utils/data';

const HomePageContent = ({
  categories,
  categoriesNonEmpty,
  itemMessages,
  userId,
  selectedCategoryId,
}: {
  categories: Awaited<ReturnType<typeof getCategories>>;
  categoriesNonEmpty: Awaited<ReturnType<typeof getCategories>>;
  itemMessages: Parameters<typeof CategoryContent>[0]['messages'];
  userId?: string;
  selectedCategoryId?: string;
}) => {
  return (
    <>
      {categories.length > 0 && (
        <Tabs
          defaultValue={selectedCategoryId ?? categoriesNonEmpty[0]?.id}
          className="mt-4"
        >
          <ScrollAreaHorizontal>
            <TabsList>
              {categoriesNonEmpty.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex gap-1"
                  asChild
                >
                  <Link
                    href={`?${new URLSearchParams({
                      selectedUserId: userId ?? '',
                      selectedCategoryId: category.id,
                    }).toString()}`}
                  >
                    {category.name}
                    {!category.public && <EyeOffIcon size={14} />}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollAreaHorizontal>
          {categoriesNonEmpty.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="lg:grid lg:grid-cols-2"
            >
              {
                <>
                  <CategoryContent
                    messages={itemMessages}
                    items={category.wishlistItems.map((x) => ({
                      ...x,
                      category,
                    }))}
                    userId={userId}
                    categories={categories}
                  />
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
                              <div className="flex items-center gap-2">
                                {subCategory.name}
                                {!subCategory.public && (
                                  <EyeOffIcon size={18} />
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <CategoryContent
                                messages={itemMessages}
                                items={subCategory.wishlistItems.map((x) => ({
                                  ...x,
                                  category: subCategory,
                                }))}
                                userId={userId}
                                categories={categories}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  )}
                </>
              }
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  );
};

export default HomePageContent;
