import { Check, Copy, Gift, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ReferralProgramPage() {
  const user = useAuthStore((state) => state.user)
  const [copied, setCopied] = useState(false)

  const referralCode = user ? `NF-${user.id.slice(-6).toUpperCase()}` : null
  const referralLink = referralCode ? `${window.location.origin}/register?ref=${referralCode}` : null

  const handleCopy = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Referral Program</div>
        <h1>Share NutriFuel, earn Fuel points</h1>
        <p>Invite a friend — when they place their first order, you both get a points bonus.</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <Users size={22} />
          <h3>1. Share your link</h3>
          <p>Send your personal referral link to a friend who'd want goal-matched meals.</p>
        </div>
        <div className="about-card">
          <Gift size={22} />
          <h3>2. They order</h3>
          <p>Your friend signs up and places their first order using your link.</p>
        </div>
        <div className="about-card">
          <Check size={22} />
          <h3>3. You both earn</h3>
          <p>You get 100 Fuel points, and they get a welcome bonus on their first order.</p>
        </div>
      </div>

      {referralLink ? (
        <div className="referral-box">
          <span>Your referral link</span>
          <div className="referral-link-row">
            <input readOnly value={referralLink} />
            <button className="primary-button bright" onClick={handleCopy}>
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart help-cta">
          <h3>Sign in to get your referral link</h3>
          <p>Your personal link and points balance will show up here once you're signed in.</p>
          <Link className="primary-button bright" to="/login">Sign in</Link>
        </div>
      )}
    </main>
  )
}
