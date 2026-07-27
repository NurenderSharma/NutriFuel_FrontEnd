import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProfilePage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-card profile-card">
        <p className="section-kicker">{t('auth.profile.kicker')}</p>
        <h1>{user.name}</h1>
        <p className="auth-subtitle">{user.email}</p>
        {!user.emailVerified && (
          <div className="profile-banner">
            {t('auth.profile.unverifiedBanner')}
          </div>
        )}
        <div className="profile-stats">
          <div>
            <b>{user.rewardPoints}</b>
            <span>{t('auth.profile.fuelPoints')}</span>
          </div>
          <div>
            <b>{user.rewardTier}</b>
            <span>{t('auth.profile.rewardTier')}</span>
          </div>
          <div>
            <b>{user.role.replace('_', ' ')}</b>
            <span>{t('auth.profile.accountType')}</span>
          </div>
        </div>
        <div className="auth-links">
          <Link to="/orders">{t('auth.profile.orderHistory')}</Link>
          <Link to="/addresses">{t('auth.profile.savedAddresses')}</Link>
          <Link to="/referral">{t('auth.profile.referralProgram')}</Link>
        </div>
        <button className="text-button" onClick={handleLogout}>
          {t('common.signOut')}
        </button>
      </div>
    </div>
  )
}
