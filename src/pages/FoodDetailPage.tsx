import { motion } from 'framer-motion'
import { Clock3, Heart, Plus, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { MacroStat } from '../components/MacroStat'
import { ReviewsSection } from '../components/ReviewsSection'
import { Skeleton } from '../components/Skeleton'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import { ApiError, apiClient } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useRecentlyViewedStore } from '../store/recentlyViewedStore'
import { useWishlistStore } from '../store/wishlistStore'

export function FoodDetailPage() {
  const { t } = useTranslation()
  const { foodId } = useParams<{ slug: string; foodId: string }>()
  const addItem = useCartStore((state) => state.addItem)
  const user = useAuthStore((state) => state.user)
  const isWishlisted = useWishlistStore((state) => state.ids.has(foodId ?? ''))
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const [food, setFood] = useState<FoodItem | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!foodId) return
    setStatus('loading')
    apiClient
      .get<ApiCatalogFood>(`/foods/${foodId}`)
      .then((raw) => {
        const mapped = mapApiFoodToFoodItem(raw)
        setFood(mapped)
        setStatus('ready')
        useRecentlyViewedStore.getState().record({
          kind: 'food',
          id: mapped.id,
          name: mapped.name,
          imageKey: mapped.imageKey,
          ...(mapped.restaurantSlug ? { restaurantSlug: mapped.restaurantSlug } : {}),
        })
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof ApiError ? error.message : t('foodDetail.notFound'))
        setStatus('error')
      })
  }, [foodId, t])

  if (status === 'loading') {
    return (
      <main className="browse-main">
        <div className="food-detail">
          <div className="food-detail-image"><Skeleton height="100%" /></div>
          <div className="food-detail-body" style={{ display: 'grid', gap: 10 }}>
            <Skeleton height={12} width="30%" />
            <Skeleton height={28} width="60%" />
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="70%" />
          </div>
        </div>
      </main>
    )
  }
  if (status === 'error' || !food) {
    return <main className="browse-main"><p className="browse-status">{errorMessage}</p></main>
  }

  return (
    <main className="browse-main">
      <div className="food-detail">
        <div className="food-detail-image">
          <motion.img
            src={food.imageKey}
            alt={food.name}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="food-detail-body">
          {food.restaurantSlug && (
            <Link className="food-detail-restaurant" to={`/restaurants/${food.restaurantSlug}`}>
              {food.restaurantName ?? t('foodDetail.viewRestaurant')}
            </Link>
          )}
          <h1>{food.name}</h1>
          <div className="food-detail-meta">
            <span><Star size={13} fill="currentColor" /> {food.rating} ({food.reviewCount})</span>
            <span><Clock3 size={13} /> {food.prepTimeMinutes} {t('common.min')}</span>
            <span className="diet-label"><i className={food.diet === 'non-vegetarian' ? 'nonveg' : ''} /> {food.cuisine}</span>
          </div>
          <p className="food-detail-description">{food.description}</p>

          <div className="macro-row food-detail-macros">
            <MacroStat value={`${food.nutrition.protein}g`} label={t('nutrition.protein')} emphasis />
            <MacroStat value={`${food.nutrition.calories}`} label={t('nutrition.calories')} />
            <MacroStat value={`${food.nutrition.carbs}g`} label={t('nutrition.carbs')} />
            <MacroStat value={`${food.nutrition.fat}g`} label={t('nutrition.fat')} />
            <MacroStat value={`${food.nutrition.fiber}g`} label={t('nutrition.fiber')} />
          </div>

          {food.allergens.length > 0 && (
            <p className="food-detail-allergens">{t('foodDetail.contains', { allergens: food.allergens.join(', ') })}</p>
          )}

          <div className="food-detail-footer">
            <div className="food-detail-price"><small>{t('foodDetail.price')}</small><strong>₹{food.price}</strong></div>
            <div className="food-detail-actions">
              {user && (
                <button
                  className={isWishlisted ? 'icon-button active' : 'icon-button'}
                  aria-label={isWishlisted ? t('foodCard.removeFromWishlist') : t('foodCard.saveToWishlist')}
                  onClick={() => toggleWishlist(food.id)}
                >
                  <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              )}
              <button className="primary-button bright" onClick={() => addItem(food)}>
                {t('foodDetail.addToCart')} <Plus size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {food.restaurantId && <ReviewsSection restaurantId={food.restaurantId} foodId={food.id} />}
    </main>
  )
}
