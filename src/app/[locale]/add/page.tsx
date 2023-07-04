import { useLocale } from 'next-intl';

import AddEditItem from '@/components/AddEditItem';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';
import { crawlUrl } from '@/utils/actions';
import { getTranslator } from 'next-intl/server';

const AddPage = async ({
  searchParams,
}: {
  searchParams?: {
    url?: string;
  };
}) => {
  const locale = useLocale();
  const url = searchParams?.url;
  const urlDefined = typeof url === 'string' && url.length > 0;
  const messagesAdd = await getTranslator(locale,'Add');
  const messagesAddCategory = await getTranslator(locale,'AddCategory');

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
        close: messagesAddCategory('form.close'),
        errorFormat: messagesAddCategory('form.errorFormat'),
        errorRequired: messagesAddCategory('form.errorRequired'),
        name: messagesAddCategory('form.name'),
        parentCategory: messagesAddCategory('form.parentCategory'),
        parentCategoryPlaceholder: messagesAddCategory(
          'form.parentCategoryPlaceholder',
        ),
        reset: messagesAddCategory('form.reset'),
        submit: messagesAddCategory('form.submit'),
        success: messagesAddCategory('form.success'),
      },
      title: messagesAddCategory('title'),
    },
    addEdit: {
      title: messagesAdd('title'),
      form: {
        category: messagesAdd('form.category'),
        categoryEmpty: messagesAdd('form.categoryEmpty'),
        categoryLoading: messagesAdd('form.categoryLoading'),
        categoryPlaceholder: messagesAdd('form.categoryPlaceholder'),
        errorFieldRequired: messagesAdd('form.errorFieldRequired'),
        imageAdd: messagesAdd('form.imageAdd'),
        imageLoadingError: messagesAdd('form.imageLoadingError'),
        images: messagesAdd('form.images'),
        imageURL: messagesAdd('form.imageURL'),
        linkAdd: messagesAdd('form.linkAdd'),
        linkName: messagesAdd('form.linkName'),
        linkPrice: messagesAdd('form.linkPrice'),
        links: messagesAdd('form.links'),
        linkUrl: messagesAdd('form.linkUrl'),
        name: messagesAdd('form.name'),
        price: messagesAdd('form.price'),
        submitAdd: messagesAdd('form.submitAdd'),
        submitEdit: messagesAdd('form.submitEdit'),
      },
      pageTitle: messagesAdd('pageTitle'),
      toast: {
        errorUploadImage: messagesAdd('toast.errorUploadImage'),
        errorUploadImageDetails: messagesAdd('toast.errorUploadImageDetails'),
        success: messagesAdd('toast.success'),
        successDetails: messagesAdd('toast.successDetails'),
      },
    },
  };

  return (
    <>
      <main>
        <h1>{messagesAdd('title')}</h1>
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
