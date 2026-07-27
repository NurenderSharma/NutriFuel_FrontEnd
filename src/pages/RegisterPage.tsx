import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/apiClient'
import { toRelativePath } from '../lib/toRelativePath'
import { useAuthStore } from '../store/authStore'

export function RegisterPage() {
  const { t } = useTranslation()
  const register = useAuthStore((state) => state.register)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [devLink, setDevLink] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await register(name, email, password)
      if (result.devVerificationLink) setDevLink(result.devVerificationLink)
      else navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('common.somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (devLink) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <p className="section-kicker">{t('auth.register.almostThereKicker')}</p>
          <h1>{t('auth.register.checkEmailTitle')}</h1>
          <p className="auth-subtitle">
            {t('auth.register.checkEmailBody', { email })}
          </p>
          <Link className="primary-button bright" to={toRelativePath(devLink)}>
            {t('auth.register.verifyNow')}
          </Link>
          <div className="auth-links">
            <Link to="/">{t('auth.register.continueWithoutVerifying')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="section-kicker">{t('auth.register.kicker')}</p>
        <h1>{t('auth.register.title')}</h1>
        <p className="auth-subtitle">{t('auth.register.subtitle')}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>{t('auth.nameLabel')}</span>
            <input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('auth.emailLabel')}</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>{t('auth.passwordLabel')}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button bright" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">{t('auth.register.haveAccount')}</Link>
        </div>
      </div>
    </div>
  )
}
