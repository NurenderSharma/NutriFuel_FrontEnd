export interface LanguageOption {
  code: string
  label: string
  nativeLabel: string
}

// Adding a new language: add its entry here, add a matching src/i18n/locales/<code>.json
// file (copy en.json and translate the values), then register it in src/i18n/index.ts.
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
]

export const DEFAULT_LANGUAGE = 'en'
