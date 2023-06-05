'use client';

import { type Category } from '@prisma/client';
import { InfoIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { changeCategoryVisibility as changeCategoryVisibilityAction } from '@/utils/actions';

const CategoriesSettings = ({
  messages,
  categories,
}: {
  messages: IntlMessages['Settings']['categories'];
  categories: Array<
    Category & {
      subCategories: Array<Category>;
    }
  >;
}) => {
  const [isPending, startTransition] = useTransition();

  const changeCategoryVisibility = (categoryId: string, isPublic: boolean) => {
    startTransition(() => {
      changeCategoryVisibilityAction({ categoryId, isPublic })
        .then(() => {
          // categoriesQuery.refetch().catch(console.error);
        })
        .catch(console.error);
    });
  };

  return (
    <>
      <h2>Categories</h2>
      <ScrollAreaHorizontal>
        <table className="w-full">
          <thead>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                {messages.name}
              </th>
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                {messages.visibility}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    <div className="flex items-center gap-2">
                      {category.name}
                      <Popover>
                        <PopoverTrigger>
                          <InfoIcon size={16} />
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          className="w-fit max-w-xs py-2 text-muted-foreground"
                        >
                          <p>{messages.info}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    <div className="item-center flex gap-2">
                      <Switch
                        defaultChecked={category.public}
                        onCheckedChange={() => {
                          changeCategoryVisibility(
                            category.id,
                            !category.public,
                          );
                        }}
                      />
                      {category.public ? messages.public : messages.private}
                    </div>
                  </td>
                </tr>
                {category.subCategories.map((subCategory) => (
                  <tr
                    className="m-0 border-t p-0 even:bg-muted"
                    key={subCategory.id}
                  >
                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                      {subCategory.name}
                    </td>
                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                      <div className="item-center flex gap-2">
                        <Switch
                          defaultChecked={subCategory.public}
                          onCheckedChange={() => {
                            changeCategoryVisibility(
                              subCategory.id,
                              !subCategory.public,
                            );
                          }}
                        />
                        {subCategory.public
                          ? messages.public
                          : messages.private}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </ScrollAreaHorizontal>
    </>
  );
};

export default CategoriesSettings;
