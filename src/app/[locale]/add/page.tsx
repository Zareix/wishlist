import AddEditItem from '@/components/AddEditItem';
import { useTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';
import { crawlUrl } from '@/utils/actions';

export const dynamic = 'force-dynamic';

const AddPage = async ({
  searchParams,
  params: { locale },
}: {
  searchParams?: {
    url?: string;
  };
  params: { locale: string };
}) => {
  const url = searchParams?.url;
  const urlDefined = typeof url === 'string' && url.length > 0;
  const { t } = await useTranslation(locale, 'add');

  let crawledItem;
  if (urlDefined) {
    crawledItem = await crawlUrl({ url });
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: (await getServerSideAuthSession())?.user.id,
      parentCategoryId: null,
    },
    include: {
      subCategories: true,
    },
  });

  const messages: Parameters<typeof AddEditItem>['0']['messages'] = {
    addCategory: {
      form: {
        close: t('addCateogry.form.close'),
        errorFormat: t('addCateogry.form.errorFormat'),
        errorRequired: t('addCateogry.form.errorRequired'),
        name: t('addCateogry.form.name'),
        parentCategory: t('addCateogry.form.parentCategory'),
        parentCategoryPlaceholder: t(
          'addCateogry.form.parentCategoryPlaceholder',
        ),
        reset: t('addCateogry.form.reset'),
        submit: t('addCateogry.form.submit'),
        success: t('addCateogry.form.success'),
      },
      title: t('addCateogry.title'),
    },
    addEdit: {
      title: t('title'),
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
        <h1>{t('title')}</h1>
        {urlDefined ? (
          <AddEditItem
            item={crawledItem}
            messages={messages}
            categories={categories}
          />
        ) : (
          <AddEditItem messages={messages} categories={categories} />
        )}
      </main>
    </>
  );
};

export default AddPage;
