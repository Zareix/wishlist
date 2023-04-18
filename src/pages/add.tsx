import { type GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';

import AddEditItem from '@/components/AddEditItem';

const AddPage = () => {
  const t = useTranslations('Add');
  return (
    <main>
      <h1>{t('title')}</h1>
      <AddEditItem />
    </main>
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
