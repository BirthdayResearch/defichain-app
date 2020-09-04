import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore,
} from 'react-redux-i18n';
import enTranslationMessages from './languages/en.json';
import deTranslationMessages from './languages/de.json';
import frTranslationMessages from './languages/fr.json';
import { LANG_VARIABLE, ENGLISH, GERMAN, FRENCH } from '../constants';
import PersistentStore from '../utils/persistentStore';

const formatTranslationMessages = (locale, messages) => {
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage = messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationsObject = {
  [ENGLISH]: formatTranslationMessages(ENGLISH, enTranslationMessages),
  [GERMAN]: formatTranslationMessages(GERMAN, deTranslationMessages),
  [FRENCH]: formatTranslationMessages(FRENCH, frTranslationMessages),
};

export const setupI18n = (store) => {
  syncTranslationWithStore(store);
  store.dispatch(loadTranslations(translationsObject));
  const storageLang = PersistentStore.get(LANG_VARIABLE);
  let locale = '';
  if (storageLang) {
    locale = storageLang;
  } else if (navigator.language) {
    const lang = navigator.language;
    locale = lang;
  } else if (navigator.languages) {
    const lang = navigator.languages[0];
    locale = lang;
  }
  PersistentStore.set(LANG_VARIABLE, locale);
  store.dispatch(setLocale(getLocales(locale)));
};

export const getLocales = (lang: string) => {
  switch (lang) {
    case 'en':
    case 'en-GB':
      return ENGLISH;
    case 'de':
      return GERMAN;
    case 'fr':
      return FRENCH;
    default:
      return ENGLISH;
  }
};
