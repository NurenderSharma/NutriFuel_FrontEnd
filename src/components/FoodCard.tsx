import { Heart, Plus, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { FoodItem } from '../domain'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

export function FoodCard({ food }: { food: FoodItem }) {
  const { t } = useTranslation()
  const addItem = useCartStore((state) => state.addItem)
  const user = useAuthStore((state) => state.user)
  const isWishlisted = useWishlistStore((state) => state.ids.has(food.id))
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const href = food.restaurantSlug ? `/restaurants/${food.restaurantSlug}/food/${food.id}` : undefined

  return (
    <article className="food-card">
      <div className="food-card-image">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
          {href ? (
            <Link to={href}><img src={food.imageKey} alt={food.name} /></Link>
          ) : (
            <img src={food.imageKey} alt={food.name} />
          )}
        </motion.div>
        {user && (
          <button
            className={isWishlisted ? 'food-card-wishlist active' : 'food-card-wishlist'}
            aria-label={isWishlisted ? t('foodCard.removeFromWishlist') : t('foodCard.saveToWishlist')}
            onClick={() => toggleWishlist(food.id)}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="food-card-body">
        <div className="food-card-top">
          <span className="diet-label"><i className={food.diet === 'non-vegetarian' ? 'nonveg' : ''} /> {food.cuisine}</span>
          <span className="food-card-rating"><Star size={11} fill="currentColor" /> {food.rating}</span>
        </div>
        {href ? <Link to={href}><h3>{food.name}</h3></Link> : <h3>{food.name}</h3>}
        <p>{food.description}</p>
        <div className="food-card-footer">
          <div className="food-card-price"><small>{t('foodCard.from')}</small><strong>₹{food.price}</strong></div>
          <button onClick={() => addItem(food)}>{t('foodCard.add')} <Plus size={14} /></button>
        </div>
      </div>
    </article>
  )
}
