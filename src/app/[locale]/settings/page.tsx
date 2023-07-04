import CategoriesSettings from '@/components/Settings/CategoriesSettings';
import SignOut from '@/components/Settings/SignOut';
import UserAccess from '@/components/Settings/UserAccess';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

export const dynamic = 'force-dynamic';

const SettingsPage = async ({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) => {
  const { t } = await useTranslation(locale, 'settings');
  const session = await getServerSideAuthSession();

  const authorizedAccessTo = (
    await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        authorizeAccessTo: true,
      },
    })
  )?.authorizeAccessTo;

  const categories = await prisma.category.findMany({
    where: {
      userId: session?.user.id,
      parentCategoryId: null,
    },
    include: {
      subCategories: true,
    },
  });

  return (
    <>
      <main>
        <h1>{t('title')}</h1>
        <CategoriesSettings
          messages={{
            info: t('categories.info'),
            name: t('categories.name'),
            private: t('categories.private'),
            public: t('categories.public'),
            visibility: t('categories.visibility'),
          }}
          categories={categories}
        />
        <Separator className="my-4" />
        <UserAccess
          messages={{
            emailRequired: t('access.emailRequired'),
            noOneAccess: t('access.noOneAccess'),
            revoke: t('access.revoke'),
            share: t('access.share'),
            sharedWith: t('access.sharedWith'),
            title: t('access.title'),
          }}
          authorizedAccessTo={authorizedAccessTo ?? []}
        />
        <Separator className="my-4" />
        <SignOut messages={t('logout')} />
      </main>
    </>
  );
};

export default SettingsPage;
