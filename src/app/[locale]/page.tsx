import HomePageContent from '@/components/HomePageContent';
import { useTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { getCategories } from '@/utils/data';

export const dynamic = 'force-dynamic';

const HomePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const { t } = await useTranslation(locale, 'index');
  const { t: tItemCard } = await useTranslation(locale, 'itemCard');
  const session = await getServerSideAuthSession();
  const categories = await getCategories(session?.user.id ?? '');
  const categoriesNonEmpty = categories?.filter(
    (x) =>
      x.wishlistItems.length > 0 ||
      x.subCategories?.some((y) => y.wishlistItems.length > 0),
  );
  const itemMessages = {
    actions: {
      archive: tItemCard('actions.archive'),
      dialogClose: tItemCard('actions.dialogClose'),
      edit: tItemCard('actions.edit'),
      move: tItemCard('actions.move'),
      on: '',
      restore: tItemCard('actions.restore'),
      restoreIn: '',
      validate: tItemCard('actions.validate'),
    },
  };

  return (
    <>
      <main>
        <div className="flex">
          <h1>{t('title')}</h1>
          {/* {session?.user.hasAccessTo && session.user.hasAccessTo.length > 0 && (
            <span className="ml-auto">
              <Select
                defaultValue={session?.user.id}
                onValueChange={(value) => {
                  if (value === session?.user.id) {
                    setUserId(undefined);
                    return;
                  }
                  setUserId(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={session.user.id ?? ''}>
                    {t('myWishlist')}
                  </SelectItem>
                  {session.user.hasAccessTo.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name ?? user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          )} */}
        </div>
        <HomePageContent
          categories={categories}
          categoriesNonEmpty={categoriesNonEmpty}
          itemMessages={itemMessages}
        />
      </main>
    </>
  );
};

export default HomePage;
