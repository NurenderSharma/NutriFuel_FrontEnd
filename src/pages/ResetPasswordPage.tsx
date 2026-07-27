import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError, apiClient } from '../lib/apiClient'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth.resetPassword.invalidOrExpired'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <p className="section-kicker">{t('auth.resetPassword.linkProblemKicker')}</p>
          <h1>{t('auth.resetPassword.invalidTitle')}</h1>
          <p className="auth-subtitle">{t('auth.resetPassword.invalidBody')}</p>
          <Link className="text-button" to="/forgot-password">
            {t('auth.resetPassword.requestNewLink')}
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <p className="section-kicker">{t('auth.resetPassword.successKicker')}</p>
          <h1>{t('auth.resetPassword.successTitle')}</h1>
          <p className="auth-subtitle">{t('auth.resetPassword.successBody')}</p>
          <button className="primary-button bright" onClick={() => navigate('/login')}>
            {t('auth.resetPassword.goToSignIn')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="section-kicker">{t('auth.resetPassword.kicker')}</p>
        <h1>{t('auth.resetPassword.title')}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>{t('auth.newPasswordLabel')}</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button bright" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('auth.resetPassword.updating') : t('auth.resetPassword.updatePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
