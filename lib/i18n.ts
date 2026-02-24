// lib/i18n.ts
import 'server-only'

const dictionaries = {
  bg: {
    common: () => import('@/locales/bg/common.json').then((module) => module.default),
  },
  en: {
    common: () => import('@/locales/en/common.json').then((module) => module.default),
  },
}

export const getDictionary = async (locale: string, namespace: 'common') => {
  if (locale !== 'bg' && locale !== 'en') {
    locale = 'bg';
  }
  return dictionaries[locale as 'bg' | 'en'][namespace]();
};