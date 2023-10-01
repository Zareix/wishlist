import HomePageContent from '@/components/HomePageContent';
import ListUserSelection from '@/components/ListUserSelection';
import { getTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { getCategories } from '@/utils/data';

// export const dynamic = 'force-dynamic';

const HomePage = async ({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    selectedCategoryId?: string;
    selectedUserId?: string;
  };
}) => {
  const { t } = await getTranslation(locale, 'index');
  const { t: tItemCard } = await getTranslation(locale, 'itemCard');
  const session = await getServerSideAuthSession();
  const selectedUserId = searchParams.selectedUserId ?? session?.user.id ?? '';
  const selectedCategoryId = searchParams.selectedCategoryId;
  const categories = await getCategories(
    selectedUserId,
    selectedUserId !== session?.user.id ? true : undefined,
  );
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
          <ListUserSelection />
        </div>
        <HomePageContent
          categories={categories}
          categoriesNonEmpty={categoriesNonEmpty}
          itemMessages={itemMessages}
          selectedCategoryId={selectedCategoryId}
          userId={selectedUserId}
        />
      </main>
    </>
  );
};

export default HomePage;
