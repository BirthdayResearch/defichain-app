import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore,
} from 'react-redux-i18n';
import enTranslationMessages from './languages/en.json';
import deTranslationMessages from './languages/de.json';
import frTranslationMessages from './languages/fr.json';
import zhsTranslationMessages from './languages/zhs.json';
import zhtTranslationMessages from './languages/zht.json';
import nlTranslationMessages from './languages/nl.json';
import rsTranslationMessages from './languages/ru.json';
import {
  LANG_VARIABLE,
  ENGLISH,
  ENGLISH_BRITISH,
  GERMAN,
  FRENCH,
  CHINESE_SIMPLIFIED,
  CHINESE_TRADITIONAL,
  DUTCH,
  RUSSIAN,
} from '../constants';
import PersistentStore from '../utils/persistentStore';
import _ from 'lodash';

const formatTranslationMessages = (locale, messages) => {
  const flattenFormattedMessages = (formattedMessages, key) => {
    const localMessage = messages[key];
    const baseMessage = enTranslationMessages[key];
    const formattedMessage = _.merge({}, baseMessage, localMessage);
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationsObject = {
  [ENGLISH]: formatTranslationMessages(ENGLISH, enTranslationMessages),
  [GERMAN]: formatTranslationMessages(GERMAN, deTranslationMessages),
  [FRENCH]: formatTranslationMessages(FRENCH, frTranslationMessages),
  [CHINESE_SIMPLIFIED]: formatTranslationMessages(
    CHINESE_SIMPLIFIED,
    zhsTranslationMessages
  ),
  [CHINESE_TRADITIONAL]: formatTranslationMessages(
    CHINESE_TRADITIONAL,
    zhtTranslationMessages
  ),
  [DUTCH]: formatTranslationMessages(DUTCH, nlTranslationMessages),
  [RUSSIAN]: formatTranslationMessages(RUSSIAN, rsTranslationMessages),
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
    case ENGLISH:
    case ENGLISH_BRITISH:
      return ENGLISH;
    case GERMAN:
      return GERMAN;
    case FRENCH:
      return FRENCH;
    case CHINESE_SIMPLIFIED:
      return CHINESE_SIMPLIFIED;
    case CHINESE_TRADITIONAL:
      return CHINESE_TRADITIONAL;
    case DUTCH:
      return DUTCH;
    case RUSSIAN:
      return RUSSIAN;
    default:
      return ENGLISH;
  }
};
