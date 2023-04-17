import {
  type ItemImage,
  type ItemLink,
  type WishlistItem,
} from '@prisma/client';
import { DollarSign, Euro, Loader2, Plus, Trash } from 'lucide-react';
import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import AddCategory from '@/components/AddCategory';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input, InputError, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/utils/api';

type Inputs = Pick<
  WishlistItem,
  'name' | 'price' | 'currency' | 'categoryId'
> & {
  images: Array<Pick<ItemImage, 'image'>>;
  links: Array<Pick<ItemLink, 'link' | 'name' | 'price'>>;
};

const AddPage = () => {
  const [isEuro, setIsEuro] = useState(true);
  const t = useTranslations('Add');
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const {
    fields: links,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });
  const {
    fields: images,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });
  const addMutation = api.wishlist.add.useMutation();
  const categoriesQuery = api.categories.getAll.useQuery();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addMutation
      .mutateAsync({
        ...data,
        currency: isEuro ? 'EUR' : 'USD',
        links: data.links.map((link) => {
          return {
            ...link,
            price: isNaN(link.price ?? 0) ? undefined : link.price ?? undefined,
          };
        }),
        price: isNaN(data.price ?? 0) ? undefined : data.price ?? undefined,
      })
      .then(() => {
        router.push('/').catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <main>
      <h1>{t('title')}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 lg:flex lg:flex-wrap lg:gap-4"
      >
        <div className=" flex flex-col items-start gap-4 lg:w-[40%]">
          <InputGroup>
            <Label>{t('form.name')}</Label>
            <Input
              placeholder={t('form.name')}
              {...register('name', { required: true })}
            />
            {errors.name && (
              <InputError>{t('form.errorFieldRequired')}</InputError>
            )}
          </InputGroup>
          <InputGroup>
            <Label>{t('form.category')}</Label>
            <div className="item-center flex gap-2">
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <Select
                      disabled={
                        categoriesQuery.isLoading ||
                        categoriesQuery.data?.length === 0
                      }
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            categoriesQuery.isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loading />
                                <span>{t('form.categoryEmpty')}</span>
                              </div>
                            ) : categoriesQuery.data?.length === 0 ? (
                              <span className="muted">
                                {t('form.categoryEmpty')}
                              </span>
                            ) : (
                              <span className="muted">
                                {t('form.categoryPlaceholder')}
                              </span>
                            )
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesQuery.data &&
                          categoriesQuery.data.map((category, index) => (
                            <React.Fragment key={category.id}>
                              <SelectGroup>
                                <SelectItem
                                  value={category.id}
                                  className="font-semibold text-slate-900 dark:text-slate-300"
                                >
                                  {category.name}
                                </SelectItem>
                                {category.subCategories.map((subCategory) => (
                                  <SelectItem
                                    value={subCategory.id}
                                    key={subCategory.id}
                                    className="ml-2"
                                  >
                                    {subCategory.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                              {index < categoriesQuery.data.length - 1 && (
                                <SelectSeparator />
                              )}
                            </React.Fragment>
                          ))}
                      </SelectContent>
                    </Select>
                    <AddCategory
                      categories={categoriesQuery.data ?? []}
                      refetchCategories={() => {
                        categoriesQuery.refetch().catch(console.error);
                      }}
                    />
                  </>
                )}
              />
            </div>
            {errors.categoryId && (
              <InputError>{t('form.errorFieldRequired')}</InputError>
            )}
          </InputGroup>
          <InputGroup>
            <Label>{t('form.price')}</Label>
            <div className="flex items-center">
              <Input
                placeholder={t('form.price')}
                type="number"
                {...register('price', {
                  valueAsNumber: true,
                })}
              />
              <Button
                variant="ghost"
                type="button"
                className="px-1"
                onClick={() => setIsEuro((x) => !x)}
              >
                {isEuro ? <Euro /> : <DollarSign />}
              </Button>
            </div>
          </InputGroup>
        </div>

        <Tabs defaultValue="links" className="mt-4 w-full lg:ml-auto lg:w-1/2">
          <TabsList>
            <TabsTrigger value="links">{t('form.links')}</TabsTrigger>
            <TabsTrigger value="images">{t('form.images')}</TabsTrigger>
          </TabsList>
          <TabsContent value="links" className="px-3">
            <div className="flex flex-col gap-4">
              {links.map((field, index) => {
                return (
                  <div key={field.id} className="flex flex-wrap">
                    <div className="grid w-[85%] grid-cols-3 gap-1">
                      <Input
                        placeholder={t('form.linkName')}
                        className="col-span-2"
                        {...register(`links.${index}.name`)}
                      />
                      <Input
                        placeholder={t('form.linkPrice')}
                        type="number"
                        {...register(`links.${index}.price`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        placeholder={t('form.linkUrl')}
                        className="col-span-3"
                        {...register(`links.${index}.link`, {
                          required: true,
                        })}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="m-auto w-[12%] p-1"
                      type="button"
                      onClick={() => {
                        removeLink(index);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    {errors.links?.[index]?.link && (
                      <InputError className="w-full">
                        {t('form.errorFieldRequired')}
                      </InputError>
                    )}
                  </div>
                );
              })}
              <Button
                variant="outline"
                type="button"
                className="ml-auto"
                onClick={() =>
                  appendLink({
                    link: '',
                    name: '',
                    price: NaN,
                  })
                }
              >
                <Plus className="mr-2 h-6 w-6" />
                {t('form.linkAdd')}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="images" className="px-3">
            <div className="flex flex-col gap-2">
              {images.map((field, index) => {
                return (
                  <div key={field.id} className="flex flex-wrap">
                    <HoverCard openDelay={0} closeDelay={0}>
                      <HoverCardTrigger asChild>
                        <Input
                          placeholder={t('form.imageURL')}
                          className="w-[85%]"
                          {...register(`images.${index}.image`, {
                            required: true,
                          })}
                        />
                      </HoverCardTrigger>
                      {watch(`images.${index}.image`) && (
                        <HoverCardContent side="top">
                          <ItemImageCard
                            image={watch(`images.${index}.image`)}
                          />
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    <Button
                      variant="destructive"
                      className="m-auto w-[12%] p-1"
                      type="button"
                      onClick={() => {
                        removeImage(index);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    {errors.images?.[index]?.image && (
                      <InputError className="w-full">
                        {t('form.errorFieldRequired')}
                      </InputError>
                    )}
                  </div>
                );
              })}
              <Button
                variant="outline"
                type="button"
                className="ml-auto"
                onClick={() =>
                  appendImage(
                    {
                      image: '',
                    },
                    {
                      shouldFocus: false,
                    },
                  )
                }
              >
                <Plus className="mr-2 h-6 w-6" />
                {t('form.imageAdd')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          disabled={addMutation.isLoading}
          type="submit"
          className="ml-auto mt-4"
        >
          {addMutation.isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Plus className="mr-2 h-6 w-6" />
          )}
          {t('form.submit')}
        </Button>
      </form>
    </main>
  );
};

const ItemImageCard = ({ image }: { image: string }) => {
  const [error, setError] = useState(false);
  const t = useTranslations('Add');

  useEffect(() => {
    setError(false);
  }, [image]);

  if (error) return <InputError>{t('form.imageLoadingError')}</InputError>;

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        src={image}
        alt="Preview"
        className="h-full max-h-32 w-full object-contain"
        onError={() => {
          setError(true);
        }}
      />
    </div>
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

export default AddPage;
