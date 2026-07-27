import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { ApiError, apiClient } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'

type VerifyStatus = 'pending' | 'success' | 'error'

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const fetchMe = useAuthStore((state) => state.fetchMe)
  const [status, setStatus] = useState<VerifyStatus>('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage(t('auth.verifyEmail.missingToken'))
      return
    }

    apiClient
      .post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success')
        return fetchMe()
      })
      .catch((err: unknown) => {
        setStatus('error')
        setMessage(err instanceof ApiError ? err.message : t('auth.verifyEmail.invalidOrExpired'))
      })
  }, [token, fetchMe, t])

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {status === 'pending' && (
          <>
            <p className="section-kicker">{t('auth.verifyEmail.pendingKicker')}</p>
            <h1>{t('auth.verifyEmail.pendingTitle')}</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="section-kicker">{t('auth.verifyEmail.successKicker')}</p>
            <h1>{t('auth.verifyEmail.successTitle')}</h1>
            <p className="auth-subtitle">{t('auth.verifyEmail.successBody')}</p>
            <Link className="primary-button bright" to="/">
              {t('auth.verifyEmail.continueToApp')}
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="section-kicker">{t('auth.verifyEmail.errorKicker')}</p>
            <h1>{t('auth.verifyEmail.errorTitle')}</h1>
            <p className="auth-subtitle">{message}</p>
            <Link className="text-button" to="/">
              {t('auth.verifyEmail.backHome')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
