import { Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n/languages'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const current = SUPPORTED_LANGUAGES.find((language) => language.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]

  const handleSelect = (code: string) => {
    void i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher-wrap">
      <button
        className="icon-button language-switcher-button"
        aria-label={t('language.choose')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <Globe size={17} />
      </button>
      {isOpen && (
        <>
          <button className="language-switcher-backdrop" aria-hidden="true" onClick={() => setIsOpen(false)} />
          <div className="language-switcher-dropdown" role="listbox" aria-label={t('language.label')}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                role="option"
                aria-selected={language.code === current?.code}
                className={language.code === current?.code ? 'language-switcher-option active' : 'language-switcher-option'}
                onClick={() => handleSelect(language.code)}
              >
                <span>{language.nativeLabel}</span>
                <small>{language.label}</small>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
