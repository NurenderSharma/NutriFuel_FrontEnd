import { BarChart3, Clock3, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function PartnerWithUsPage() {
  const user = useAuthStore((state) => state.user)
  const isOwner = user?.role === 'restaurant_owner'

  return (
    <main className="browse-main">
      <div className="static-hero">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200" alt="A restaurant kitchen preparing orders" />
      </div>
      <div className="browse-heading">
        <div className="section-kicker">Restaurant Partners</div>
        <h1>List your kitchen on NutriFuel</h1>
        <p>
          Reach customers who are actively searching by macros, not just cravings. Publish your menu with verified
          nutrition data and let our goal-matching engine bring you the right orders.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <Users size={22} />
          <h3>Goal-matched demand</h3>
          <p>Customers searching for protein or calorie targets see your menu ranked directly against what they need.</p>
        </div>
        <div className="about-card">
          <BarChart3 size={22} />
          <h3>Your own dashboard</h3>
          <p>Manage your menu, categories, coupons, and incoming orders from a dedicated restaurant-owner dashboard.</p>
        </div>
        <div className="about-card">
          <ShieldCheck size={22} />
          <h3>Secure payouts</h3>
          <p>Payments run through Stripe Checkout — customers pay securely and orders confirm automatically once paid.</p>
        </div>
        <div className="about-card">
          <Clock3 size={22} />
          <h3>Fast onboarding</h3>
          <p>Create your restaurant profile in minutes; an admin reviews and approves it before it goes live.</p>
        </div>
      </div>

      <div className="empty-cart help-cta">
        <h3>{isOwner ? "You're already a partner" : 'Ready to get listed?'}</h3>
        <p>{isOwner ? 'Manage your restaurant, menu, and orders from your dashboard.' : 'Create an account and set up your restaurant profile — it only takes a few minutes.'}</p>
        <Link className="primary-button bright" to={isOwner ? '/restaurant-admin' : '/register'}>
          {isOwner ? 'Go to my dashboard' : 'Get started'}
        </Link>
      </div>
    </main>
  )
}
