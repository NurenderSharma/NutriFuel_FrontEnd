import { Link } from 'react-router-dom'

const CUISINES = [
  {
    name: 'Global',
    description: 'Macro-balanced bowls, wraps and snacks for every goal.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  },
  {
    name: 'Indian',
    description: 'High-protein Indian favorites, tandoori-grilled and macro-tracked.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  },
  {
    name: 'Asian',
    description: 'Light, plant-forward Asian bowls built around clean protein.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
  },
  {
    name: 'Mediterranean',
    description: 'Mediterranean-inspired salads and soups, high fiber and fully plant-based.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
  },
]

export function CuisinesPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Cuisines</div>
        <h1>Browse by cuisine</h1>
        <p>Every kitchen publishes verified nutrition, no matter which cuisine you're craving.</p>
      </div>

      <div className="cuisine-grid">
        {CUISINES.map((cuisine) => (
          <Link className="cuisine-tile" key={cuisine.name} to={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}>
            <img src={`${cuisine.image}?w=800`} alt={cuisine.name} />
            <div className="cuisine-tile-overlay">
              <h3>{cuisine.name}</h3>
              <p>{cuisine.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
