import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ApiError, apiClient } from '../lib/apiClient'
import { toRelativePath } from '../lib/toRelativePath'

interface ForgotPasswordResult {
  message: string
  devResetLink?: string
}

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await apiClient.post<ForgotPasswordResult>('/auth/forgot-password', { email })
      setMessage(result.message)
      setDevLink(result.devResetLink ?? null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('common.somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="section-kicker">{t('auth.forgotPassword.kicker')}</p>
        <h1>{t('auth.forgotPassword.title')}</h1>
        <p className="auth-subtitle">{t('auth.forgotPassword.subtitle')}</p>
        {message ? (
          <>
            <p className="auth-subtitle">{message}</p>
            {devLink && (
              <Link className="primary-button bright" to={toRelativePath(devLink)}>
                {t('auth.forgotPassword.resetNow')}
              </Link>
            )}
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
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
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button bright" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendLink')}
            </button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">{t('auth.forgotPassword.backToSignIn')}</Link>
        </div>
      </div>
    </div>
  )
}
