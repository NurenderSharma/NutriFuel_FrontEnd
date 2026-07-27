import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Restaurant } from '../domain/restaurant'

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link className="restaurant-card" to={`/restaurants/${restaurant.slug}`}>
      <div className="restaurant-card-image">
        {restaurant.coverImageUrl && <img src={restaurant.coverImageUrl} alt={restaurant.name} />}
      </div>
      <div className="restaurant-card-body">
        <h3>{restaurant.name}</h3>
        <p>{restaurant.description}</p>
        <div className="restaurant-card-footer">
          <span className="restaurant-card-cuisines">{restaurant.cuisines.join(', ')}</span>
          <span className="restaurant-card-rating"><Star size={12} fill="currentColor" /> {restaurant.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  )
}
