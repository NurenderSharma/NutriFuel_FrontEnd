import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import hi from './locales/hi.json'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './languages'

// Adding a new language: create src/i18n/locales/<code>.json (copy an existing file and
// translate the values), import it above, add it to `resources`, and register it in
// src/i18n/languages.ts. No other code changes are needed — every component reads
// strings through useTranslation()/t(), so a new language lights up everywhere at once.
export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'nutrifuel-language',
      caches: ['localStorage'],
    },
  })

export default i18n
