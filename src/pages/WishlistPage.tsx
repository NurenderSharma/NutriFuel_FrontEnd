import { Heart } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FoodCard } from '../components/FoodCard'
import { SkeletonFoodGrid } from '../components/Skeleton'
import { useWishlistStore } from '../store/wishlistStore'

export function WishlistPage() {
  const foods = useWishlistStore((state) => state.foods)
  const status = useWishlistStore((state) => state.status)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)

  useEffect(() => {
    void fetchWishlist()
  }, [fetchWishlist])

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Wishlist</div>
        <h1>Meals you've saved</h1>
      </div>

      {status === 'loading' && <SkeletonFoodGrid />}
      {status === 'ready' && foods.length === 0 && (
        <div className="empty-cart">
          <span><Heart size={28} /></span>
          <h3>Nothing saved yet.</h3>
          <p>Tap the heart on any meal to save it here for later.</p>
          <Link className="primary-button bright" to="/restaurants">Browse restaurants</Link>
        </div>
      )}

      {status === 'ready' && foods.length > 0 && (
        <div className="food-grid">
          {foods.map((food) => <FoodCard key={food.id} food={food} />)}
        </div>
      )}
    </main>
  )
}
