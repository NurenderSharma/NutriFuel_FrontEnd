import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, apiClient } from '../lib/apiClient'
import { type AuthUser, useAuthStore } from '../store/authStore'

const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very-active'] as const
const ACTIVITY_LEVEL_KEYS: Record<(typeof ACTIVITY_LEVELS)[number], string> = {
  sedentary: 'auth.settings.activitySedentary',
  light: 'auth.settings.activityLight',
  moderate: 'auth.settings.activityModerate',
  active: 'auth.settings.activityActive',
  'very-active': 'auth.settings.activityVeryActive',
}

export function SettingsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const [name, setName] = useState(user?.name ?? '')
  const [dietaryPreference, setDietaryPreference] = useState(user?.dietaryPreference ?? 'nonveg')
  const [allergies, setAllergies] = useState((user?.allergies ?? []).join(', '))
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '')
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel ?? '')
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(user?.emailNotificationsEnabled ?? true)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  if (!user) return null

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setProfileError(null)
    setProfileMessage(null)
    setIsSavingProfile(true)
    try {
      const updated = await apiClient.patch<AuthUser>('/auth/me', {
        name,
        dietaryPreference,
        allergies: allergies.split(',').map((item) => item.trim()).filter(Boolean),
        ...(weight ? { weight: Number(weight) } : {}),
        ...(activityLevel ? { activityLevel } : {}),
        emailNotificationsEnabled,
      })
      setUser(updated)
      setProfileMessage(t('auth.settings.saved'))
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : t('auth.settings.couldNotSave'))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)
    setIsSavingPassword(true)
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword })
      setPasswordMessage(t('auth.settings.passwordUpdated'))
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : t('auth.settings.couldNotUpdatePassword'))
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">{t('auth.settings.kicker')}</div>
        <h1>{t('auth.settings.title')}</h1>
      </div>

      <div className="settings-layout">
        <form className="dashboard-form" onSubmit={handleProfileSubmit}>
          <h2>{t('auth.settings.profileHeading')}</h2>
          <label className="form-field"><span>{t('auth.nameLabel')}</span><input required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="form-field"><span>{t('auth.settings.dietaryPreference')}</span>
            <select value={dietaryPreference} onChange={(e) => setDietaryPreference(e.target.value as typeof dietaryPreference)}>
              <option value="veg">{t('auth.settings.vegetarian')}</option>
              <option value="vegan">{t('auth.settings.vegan')}</option>
              <option value="nonveg">{t('auth.settings.nonVegetarian')}</option>
            </select>
          </label>
          <label className="form-field"><span>{t('auth.settings.allergies')}</span><input value={allergies} onChange={(e) => setAllergies(e.target.value)} /></label>
          <div className="form-grid">
            <label className="form-field"><span>{t('auth.settings.weight')}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
            <label className="form-field"><span>{t('auth.settings.activityLevel')}</span>
              <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                <option value="">{t('auth.settings.notSet')}</option>
                {ACTIVITY_LEVELS.map((level) => <option key={level} value={level}>{t(ACTIVITY_LEVEL_KEYS[level])}</option>)}
              </select>
            </label>
          </div>
          <label className="form-field settings-checkbox">
            <input type="checkbox" checked={emailNotificationsEnabled} onChange={(e) => setEmailNotificationsEnabled(e.target.checked)} />
            <span>{t('auth.settings.emailNotifications')}</span>
          </label>
          {profileMessage && <p className="auth-subtitle">{profileMessage}</p>}
          {profileError && <p className="form-error">{profileError}</p>}
          <button className="primary-button bright" type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? t('common.saving') : t('auth.settings.saveProfile')}
          </button>
        </form>

        <form className="dashboard-form" onSubmit={handlePasswordSubmit}>
          <h2>{t('auth.settings.changePasswordHeading')}</h2>
          <label className="form-field"><span>{t('auth.currentPasswordLabel')}</span><input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></label>
          <label className="form-field"><span>{t('auth.newPasswordLabel')}</span><input required minLength={8} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></label>
          {passwordMessage && <p className="auth-subtitle">{passwordMessage}</p>}
          {passwordError && <p className="form-error">{passwordError}</p>}
          <button className="primary-button bright" type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? t('auth.resetPassword.updating') : t('auth.resetPassword.updatePassword')}
          </button>
        </form>
      </div>
    </main>
  )
}
