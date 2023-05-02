import { PopoverTrigger } from '@radix-ui/react-popover';
import { InfoIcon, LogOut } from 'lucide-react';
import { type GetStaticPropsContext } from 'next';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { PageSEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input, InputError, InputGroup } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { ScrollAreaHorizontal } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { api } from '@/utils/api';

const SettingsPage = () => {
  const t = useTranslations('Settings');
  const categoriesQuery = api.categories.getAll.useQuery();
  const categoriesVisibilityMutation =
    api.categories.changeVisibility.useMutation({
      onSuccess: () => {
        categoriesQuery.refetch().catch(console.error);
      },
    });

  const changeCategoryVisibility = (id: string, isPublic: boolean) => {
    categoriesVisibilityMutation.mutate({ id, isPublic });
  };

  return (
    <>
      <PageSEO title={t('pageTitle')} />
      <main>
        <h1>{t('title')}</h1>
        <h2>Categories</h2>
        <ScrollAreaHorizontal>
          {categoriesQuery.isLoading ? (
            <Loading className="mt-2" />
          ) : !categoriesQuery.isSuccess ? (
            <p>Error: {categoriesQuery.error.message}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    {t('categories.name')}
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    {t('categories.visibility')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoriesQuery.data.map((category) => (
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
                              <p>{t('categories.info')}</p>
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
                          {category.public
                            ? t('categories.public')
                            : t('categories.private')}
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
                              ? t('categories.public')
                              : t('categories.private')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </ScrollAreaHorizontal>
        <Separator className="my-4" />
        <UserAccess />
        <Separator className="my-4" />
        <div className="flex justify-center">
          <Button onClick={() => signOut().catch(console.error)}>
            <LogOut className="mr-2" />
            {t('logout')}
          </Button>
        </div>
      </main>
    </>
  );
};

const UserAccess = () => {
  const t = useTranslations('Settings.access');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    email: string;
  }>();
  const authorizedAccessToQuery = api.users.getAuthorizedAccessTo.useQuery();
  const authorizeAccessMutation = api.users.authorizeAccess.useMutation({
    onSuccess: () => {
      authorizedAccessToQuery.refetch().catch(console.error);
    },
  });
  const revokeAccessMutation = api.users.revokeAccess.useMutation({
    onSuccess: () => {
      authorizedAccessToQuery.refetch().catch(console.error);
    },
  });

  const submit: SubmitHandler<{
    email: string;
  }> = (data) => {
    authorizeAccessMutation.mutate(data);
  };

  const revokeAccess = (userId: string) => {
    revokeAccessMutation.mutate({ userId });
  };

  return (
    <>
      <h2>{t('title')}</h2>
      <form onSubmit={handleSubmit(submit)} className="flex gap-2">
        <InputGroup>
          <Input
            type="email"
            {...register('email', {
              required: true,
            })}
            placeholder="Email"
          />
          <InputError>
            {errors.email ? (
              <>{t('emailRequired')}</>
            ) : authorizeAccessMutation.isError ? (
              <>Error: {authorizeAccessMutation.error?.message}</>
            ) : (
              <></>
            )}
          </InputError>
        </InputGroup>
        <Button type="submit">{t('share')}</Button>
      </form>
      {authorizedAccessToQuery.isLoading ? (
        <Loading className="mt-2" />
      ) : !authorizedAccessToQuery.isSuccess ? (
        <p>Error: {authorizedAccessToQuery.error.message}</p>
      ) : authorizedAccessToQuery.data?.length === 0 ? (
        <p className="mt-2">{t('noOneAccess')}</p>
      ) : (
        <>
          <h3 className="mt-2">{t('sharedWith')} : </h3>
          <ul>
            {authorizedAccessToQuery.data?.map((user) => (
              <li key={user.id} className="flex items-center gap-2">
                {user.email}
                <Button
                  variant="destructive"
                  onClick={() => {
                    revokeAccess(user.id);
                  }}
                  className="ml-auto"
                >
                  {t('revoke')}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
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

export default SettingsPage;
