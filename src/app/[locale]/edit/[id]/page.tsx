import { notFound } from 'next/navigation';

import AddEditItem from '@/components/AddEditItem';
import { getTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

export const dynamic = 'force-dynamic';

const AddPage = async ({
  params: { id, locale },
}: {
  params: {
    id: string;
    locale: string;
  };
}) => {
  const { t } = await getTranslation(locale, 'edit');

  const categories = await prisma.category.findMany({
    where: {
      userId: (await getServerSideAuthSession())?.user.id,
      parentCategoryId: null,
    },
    include: {
      subCategories: true,
    },
  });

  const item = await prisma.wishlistItem.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      links: true,
    },
  });

  if (!item) {
    notFound();
  }

  const session = await getServerSideAuthSession();
  if (item.userId !== session?.user.id) {
    notFound();
  }

  const messages: Parameters<typeof AddEditItem>['0']['messages'] = {
    addCategory: {
      form: {
        close: t('addCategory.form.close'),
        errorFormat: t('addCategory.form.errorFormat'),
        errorRequired: t('addCategory.form.errorRequired'),
        name: t('addCategory.form.name'),
        parentCategory: t('addCategory.form.parentCategory'),
        parentCategoryPlaceholder: t(
          'addCategory.form.parentCategoryPlaceholder',
        ),
        reset: t('addCategory.form.reset'),
        submit: t('addCategory.form.submit'),
        success: t('addCategory.form.success'),
      },
      title: t('addCategory.title'),
    },
    addEdit: {
      title: t('title', {
        name: item.name,
      }),
      form: {
        category: t('form.category'),
        categoryEmpty: t('form.categoryEmpty'),
        categoryLoading: t('form.categoryLoading'),
        categoryPlaceholder: t('form.categoryPlaceholder'),
        errorFieldRequired: t('form.errorFieldRequired'),
        imageAdd: t('form.imageAdd'),
        imageLoadingError: t('form.imageLoadingError'),
        images: t('form.images'),
        imageURL: t('form.imageURL'),
        linkAdd: t('form.linkAdd'),
        linkName: t('form.linkName'),
        linkPrice: t('form.linkPrice'),
        links: t('form.links'),
        linkUrl: t('form.linkUrl'),
        name: t('form.name'),
        price: t('form.price'),
        submitAdd: t('form.submitAdd'),
        submitEdit: t('form.submitEdit'),
      },
      pageTitle: t('pageTitle'),
      toast: {
        errorUploadImage: t('toast.errorUploadImage'),
        errorUploadImageDetails: t('toast.errorUploadImageDetails'),
        success: t('toast.success'),
        successDetails: t('toast.successDetails'),
      },
    },
  };

  return (
    <>
      <main>
        <h1>
          {t('title', {
            name: item.name,
          })}
        </h1>
        <AddEditItem
          messages={messages}
          item={item}
          editing
          categories={categories}
        />
      </main>
    </>
  );
};

export default AddPage;
