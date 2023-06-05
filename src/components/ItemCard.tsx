'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '@prisma/client';
import {
  Archive,
  ArrowLeftRight,
  CheckCircle2,
  Edit,
  GripHorizontalIcon,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useTransition } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { isImageFromS3 } from '@/utils';
import { changeItemState } from '@/utils/actions';
import { type RouterInputs, type RouterOutputs } from '@/utils/api';
import { cn } from '@/utils/ui';

const ItemCard = ({
  messages,
  item,
  categories,
  canEdit,
  isDraggable = false,
}: {
  messages: IntlMessages['ItemCard'];
  item: NonNullable<RouterOutputs['wishlist']['getAll']>[0];
  categories: Array<
    Category & {
      subCategories: Category[];
    }
  >;
  canEdit?: boolean;
  isDraggable?: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const changeState = (
    state: NonNullable<RouterInputs['wishlist']['changeState']['state']>,
    silent?: boolean,
  ) => {
    const previousState = item.state;
    startTransition(() => {
      changeItemState({ id: item.id, state })
        .then(() => {
          // apiContext.wishlist.getAll
          //   .invalidate({ categoryId: item.categoryId })
          //   .catch(console.error);
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
    });
  };

  const moveToCategory = (
    categoryId: string,
    categoryName: string,
    silent?: boolean,
  ) => {
    const previousCategoryId = item.categoryId;
    const previousCategoryName =
      categories.find((category) => category.id === previousCategoryId)?.name ??
      'Unknown';
    startTransition(() => {
      changeItemState({ id: item.id, categoryId })
        .then(() => {
          // apiContext.wishlist.getAll
          //   .invalidate({ categoryId: categoryId })
          //   .catch(console.error);
          // apiContext.wishlist.getAll
          //   .invalidate({ categoryId: previousCategoryId })
          //   .catch(console.error);
          // apiContext.categories.getAll.invalidate().catch(console.error);
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
    });
  };

  return (
    <Card
      className="w-full max-w-sm"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {item.name}
          {item.price && (
            <div className="muted ml-auto flex w-1/6 items-center">
              <span>{item.price}</span>
              <CurrencyIcon currency={item.currency} className="h-4 w-4" />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <div className="flex w-full flex-wrap content-start items-start gap-1 gap-y-2 pt-2">
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
                    {isImageFromS3(image.image) ? (
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
                    {isImageFromS3(image.image) ? (
                      <div className="mx-auto mt-4 h-[40vh] max-w-[90%]">
                        <Image
                          src={image.image}
                          alt={`${index} of ${item.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 512px"
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
                        <Button variant="outline">
                          {messages.actions.dialogClose}
                        </Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollAreaHorizontal>
        )}
      </CardContent>
      <CardFooter className="relative flex justify-end gap-2">
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
            <span className="muted ml-1">{messages.actions.on}</span>
          </div>
        )}
        {isDraggable && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 cursor-grab touch-none text-muted-foreground hover:text-foreground">
            <GripHorizontalIcon {...listeners} />
          </div>
        )}
        {canEdit && (
          <>
            <DropdownMenu
            // onOpenChange={(open) => {
            //   if (!open) return;
            //   apiContext.wishlist.getOne
            //     .prefetch(item.id)
            //     .catch(console.error);
            // }}
            >
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
                        <span>{messages.actions.edit}</span>
                      </Link>
                    </DropdownMenuItem>
                    {categories && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <ArrowLeftRight className="mr-2 h-4 w-4" />
                          <span>{messages.actions.move}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {categories.map((category, index) => (
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
                                {index < categories.length - 1 && (
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
                      <span>{messages.actions.validate}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeState('CANCELED')}>
                      <Archive className="mr-2 h-4 w-4 text-destructive" />
                      <span>{messages.actions.archive}</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => changeState('ACTIVE')}>
                      <RotateCcw className="mr-2 h-4 w-4" />

                      {'category' in item ? (
                        <>{messages.actions.restoreIn}</>
                      ) : (
                        <>{messages.actions.restore}</>
                      )}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const ItemCardLoading = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-2/3" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <div className="flex w-full flex-wrap content-start items-start gap-1 gap-y-2 pt-2">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="ml-auto w-1/3">
          <Skeleton className="h-20 w-20" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size="sm" disabled>
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ItemCardLoading };

export default ItemCard;
