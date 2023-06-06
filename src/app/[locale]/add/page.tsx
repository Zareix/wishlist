import { getTranslations } from 'next-intl/server';
import { useSearchParams } from 'next/navigation';

import type AddEditItem from '@/components/AddEditItem';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';
import { crawlUrl } from '@/utils/actions';

const AddPage = async () => {
  const searchParams = useSearchParams();
  const url = searchParams?.get('url');
  const urlDefined = typeof url === 'string' && url.length > 0;
  const messagesAdd = await getTranslations('Add');

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
  };

  return (
    <>
      {/* <PageSEO title={t('pageTitle')} /> */}
      <main>
        <h1>{messagesAdd('title')}</h1>
        {/* {urlDefined ? (
          <AddEditItem
            item={crawledItem}
            messages={messages}
            categories={categories}
          />
        ) : (
          <AddEditItem messages={messages} categories={categories} />
        )} */}
      </main>
    </>
  );
};

export default AddPage;
