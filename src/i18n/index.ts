import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { getOptions } from '@/i18n/settings';

const initI18next = async (locale: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./${language}/${namespace}.json`),
      ),
    )
    .init(getOptions(locale, ns));
  return i18nInstance;
};

type Options = {
  keyPrefix?: string;
};

export async function useTranslation(
  locale: string,
  ns: string | string[],
  options: Options | undefined = {},
) {
  const i18nextInstance = await initI18next(locale, ns);
  return {
    t: i18nextInstance.getFixedT(
      locale,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix,
    ),
    i18n: i18nextInstance,
  };
}
