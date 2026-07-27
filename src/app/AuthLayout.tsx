import { Outlet } from 'react-router-dom'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export function AuthLayout() {
  return (
    <main className="auth-main">
      <div className="auth-language-bar">
        <LanguageSwitcher />
      </div>
      <Outlet />
    </main>
  )
}
