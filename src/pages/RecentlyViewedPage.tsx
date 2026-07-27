import { History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRecentlyViewedStore } from '../store/recentlyViewedStore'

export function RecentlyViewedPage() {
  const entries = useRecentlyViewedStore((state) => state.entries)

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker"><History size={13} /> History</div>
        <h1>Recently viewed</h1>
        <p>Meals and restaurants you've looked at recently, kept handy for a quick reorder.</p>
      </div>

      {entries.length === 0 && (
        <div className="empty-cart">
          <span><History size={28} /></span>
          <h3>Nothing here yet.</h3>
          <p>Browse a few restaurants or meals and they'll show up here.</p>
          <Link className="primary-button bright" to="/restaurants">Browse restaurants</Link>
        </div>
      )}

      <div className="recently-viewed-grid">
        {entries.map((entry) => {
          const href = entry.kind === 'restaurant'
            ? entry.restaurantSlug ? `/restaurants/${entry.restaurantSlug}` : undefined
            : entry.restaurantSlug ? `/restaurants/${entry.restaurantSlug}/food/${entry.id}` : undefined
          const card = (
            <>
              {entry.imageKey && <img src={entry.imageKey} alt={entry.name} />}
              <span>{entry.kind === 'restaurant' ? 'Restaurant' : 'Meal'}</span>
              <b>{entry.name}</b>
            </>
          )
          return href ? (
            <Link className="recently-viewed-card" key={`${entry.kind}-${entry.id}`} to={href}>{card}</Link>
          ) : (
            <div className="recently-viewed-card" key={`${entry.kind}-${entry.id}`}>{card}</div>
          )
        })}
      </div>
    </main>
  )
}
