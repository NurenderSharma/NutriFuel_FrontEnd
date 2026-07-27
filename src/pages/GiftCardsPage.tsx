import { Gift } from 'lucide-react'

const DENOMINATIONS = [500, 1_000, 2_000, 5_000]

export function GiftCardsPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Gift Cards</div>
        <h1>Give the gift of a goal-matched meal</h1>
        <p>NutriFuel gift cards are on the way — pick a denomination below to get notified when they launch.</p>
      </div>

      <div className="giftcard-grid">
        {DENOMINATIONS.map((value) => (
          <div className="giftcard-tile" key={value}>
            <Gift size={26} />
            <strong>₹{value.toLocaleString('en-IN')}</strong>
            <span className="status-pill status-pending">Coming soon</span>
          </div>
        ))}
      </div>
    </main>
  )
}
