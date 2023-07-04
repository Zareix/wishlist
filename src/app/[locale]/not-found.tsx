import { useTranslation } from '@/i18n';
import { fallbackLng } from '@/i18n/settings';

export default async function Page404({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  const { t } = await useTranslation(locale ?? fallbackLng, 'not-found');
  return (
    <>
      <main>
        <h1>{t('title')}</h1>
      </main>
    </>
  );
}
