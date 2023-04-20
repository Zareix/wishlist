import {
  Archive,
  ArrowLeftRight,
  CheckCircle2,
  Edit,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CurrencyIcon from '@/components/ui/currency-icon';
import { DialogFooter } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { ToastAction } from '@/components/ui/toast';
import { env } from '@/env.mjs';
import { useToast } from '@/hooks/use-toast';
import { type RouterInputs, type RouterOutputs, api } from '@/utils/api';
import { cn } from '@/utils/ui';

const ItemCard = ({
  item,
  refresh: refreshCategory,
}: {
  item:
    | NonNullable<RouterOutputs['categories']['getOne']>['wishlistItems'][0]
    | NonNullable<RouterOutputs['wishlist']['getAll']>[0];
  refresh: () => void;
}) => {
  const { toast } = useToast();
  const categoriesQuery = api.categories.getAll.useQuery();
  const changeStateMutation = api.wishlist.changeState.useMutation();

  const changeState = (
    state: NonNullable<RouterInputs['wishlist']['changeState']['state']>,
    silent?: boolean,
  ) => {
    const previousState = item.state;
    changeStateMutation
      .mutateAsync({
        id: item.id,
        state,
      })
      .then(() => {
        refreshCategory();
        if (silent) return;
        toast({
          title: 'Item updated',
          description: `Item ${item.name} has been ${
            state === 'ACTIVE' ? 'restored' : state.toLowerCase()
          }.`,
          action: (
            <ToastAction
              altText="Undo"
              onClick={() => changeState(previousState, true)}
            >
              Undo
            </ToastAction>
          ),
        });
      })
      .catch(console.error);
  };

  const moveToCategory = (
    categoryId: string,
    categoryName: string,
    silent?: boolean,
  ) => {
    const previousCategoryId = item.categoryId;
    const previousCategoryName =
      categoriesQuery.data?.find(
        (category) => category.id === previousCategoryId,
      )?.name ?? 'Unknown';
    changeStateMutation
      .mutateAsync({
        id: item.id,
        categoryId,
      })
      .then(() => {
        refreshCategory();
        if (silent) return;
        toast({
          title: 'Item moved',
          description: `Item ${item.name} has been moved to category ${categoryName}.`,
          action: (
            <ToastAction
              altText="Undo"
              onClick={() =>
                moveToCategory(previousCategoryId, previousCategoryName, true)
              }
            >
              Undo
            </ToastAction>
          ),
        });
      })
      .catch(console.error);
  };

  return (
    <Card className="w-full max-w-sm">
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
      <CardContent className="flex">
        <div className="flex w-full flex-wrap items-start gap-1">
          {item.links.map((link) => (
            <a
              key={link.id}
              href={link.link}
              target="_blank"
              rel="noreferrer"
              className={badgeVariants({ variant: 'secondary' })}
            >
              {link.name}
              {link.price && (
                <span className="ml-1 flex items-center text-xs text-muted-foreground">
                  ({link.price}
                  <CurrencyIcon currency={item.currency} size={12} />)
                </span>
              )}
            </a>
          ))}
        </div>
        {item.images.length > 0 && (
          <ScrollAreaHorizontal className="ml-auto w-1/3">
            <div className="flex h-full items-center gap-2">
              {item.images.map((image, index) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    {new URL(image.image).hostname ===
                    new URL(env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname ? (
                      <div className="relative h-20 w-20">
                        <Image
                          src={image.image}
                          alt={`${index} of ${item.name}`}
                          fill
                          className="rounded-sm object-cover"
                        />
                      </div>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element*/
                      <img
                        src={image.image}
                        alt={`${index} of ${item.name}`}
                        className="h-20 w-20 rounded-sm object-cover"
                      />
                    )}
                  </DialogTrigger>
                  <DialogContent>
                    {new URL(image.image).hostname ===
                    new URL(env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname ? (
                      <div className="mx-auto mt-4 max-h-[40vh] ">
                        <Image
                          src={image.image}
                          alt={`${index} of ${item.name}`}
                          fill
                          className="!relative rounded-sm object-contain"
                        />
                      </div>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element*/
                      <img
                        src={image.image}
                        alt={`${index} of ${item.name}`}
                        className="mx-auto mt-4 max-h-[40vh] rounded-sm"
                      />
                    )}
                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button variant="outline">Close</Button>
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
        {item.state !== 'ACTIVE' && (
          <div className="mr-auto">
            <span
              className={cn(
                badgeVariants({
                  variant: item.state === 'BOUGHT' ? 'default' : 'destructive',
                }),
                item.state === 'BOUGHT' && 'bg-green-600',
              )}
            >
              {item.state}
            </span>
            <span className="muted ml-1">
              on {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.state === 'ACTIVE' ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/edit/${item.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                {categoriesQuery.data && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      <span>Move</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {categoriesQuery.data &&
                          categoriesQuery.data.map((category, index) => (
                            <Fragment key={category.id}>
                              <DropdownMenuItem
                                className="font-semibold text-slate-900 dark:text-slate-300"
                                onClick={() => {
                                  moveToCategory(category.id, category.name);
                                }}
                              >
                                {category.name}
                              </DropdownMenuItem>
                              {category.subCategories.map((subCategory) => (
                                <DropdownMenuItem
                                  key={subCategory.id}
                                  className="ml-2"
                                  onClick={() => {
                                    moveToCategory(
                                      subCategory.id,
                                      subCategory.name,
                                    );
                                  }}
                                >
                                  {subCategory.name}
                                </DropdownMenuItem>
                              ))}
                              {index < categoriesQuery.data.length - 1 && (
                                <DropdownMenuSeparator />
                              )}
                            </Fragment>
                          ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
                <DropdownMenuItem onClick={() => changeState('BOUGHT')}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>Validate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeState('CANCELED')}>
                  <Archive className="mr-2 h-4 w-4 text-destructive" />
                  <span>Archive</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => changeState('ACTIVE')}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore{' '}
                  {'category' in item && (
                    <>
                      in <span className="italic">{item.category.name}</span>
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
