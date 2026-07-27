import { motion } from 'framer-motion'
import { Star, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { FoodCard } from '../components/FoodCard'
import { ReviewsSection } from '../components/ReviewsSection'
import { Skeleton, SkeletonFoodGrid } from '../components/Skeleton'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import type { RestaurantDetail } from '../domain/restaurant'
import { ApiError, apiClient } from '../lib/apiClient'
import { useRecentlyViewedStore } from '../store/recentlyViewedStore'

export function RestaurantDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setStatus('loading')
    apiClient
      .get<RestaurantDetail>(`/restaurants/${slug}`)
      .then(async (restaurantDetail) => {
        setRestaurant(restaurantDetail)
        const apiFoods = await apiClient.get<ApiCatalogFood[]>(
          `/foods?restaurantId=${restaurantDetail.id}&limit=50`,
        )
        setFoods(apiFoods.map(mapApiFoodToFoodItem))
        setStatus('ready')
        useRecentlyViewedStore.getState().record({
          kind: 'restaurant',
          id: restaurantDetail.id,
          name: restaurantDetail.name,
          imageKey: restaurantDetail.coverImageUrl ?? restaurantDetail.logoUrl ?? '',
          restaurantSlug: restaurantDetail.slug,
        })
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof ApiError ? error.message : t('restaurantDetail.notFound'))
        setStatus('error')
      })
  }, [slug, t])

  const foodsByCategory = useMemo(() => {
    const groups = new Map<string, FoodItem[]>()
    for (const food of foods) {
      const key = food.categoryName ?? t('restaurantDetail.menuFallback')
      const bucket = groups.get(key) ?? []
      bucket.push(food)
      groups.set(key, bucket)
    }
    return groups
  }, [foods])

  if (status === 'loading') {
    return (
      <main className="browse-main">
        <Skeleton height={220} className="restaurant-hero" />
        <SkeletonFoodGrid count={4} />
      </main>
    )
  }
  if (status === 'error' || !restaurant) {
    return <main className="browse-main"><p className="browse-status">{errorMessage}</p></main>
  }

  return (
    <main className="browse-main">
      <div className="restaurant-hero">
        {restaurant.coverImageUrl && (
          <motion.img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="restaurant-hero-overlay">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="restaurant-hero-meta">
            <span><Star size={13} fill="currentColor" /> {restaurant.rating.toFixed(1)} ({restaurant.numReviews})</span>
            <span>{restaurant.cuisines.join(', ')}</span>
          </div>
        </div>
      </div>

      {restaurant.gallery.length > 0 && (
        <div className="gallery-strip">
          {restaurant.gallery.map((url) => (
            <img key={url} src={url} alt={`${restaurant.name} gallery`} onClick={() => setLightboxImage(url)} />
          ))}
        </div>
      )}

      {lightboxImage && (
        <div className="gallery-lightbox" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="" />
          <button aria-label={t('restaurantDetail.closeLightbox')} onClick={() => setLightboxImage(null)}><X size={18} /></button>
        </div>
      )}

      {[...foodsByCategory.entries()].map(([category, items]) => (
        <section className="menu-section" key={category}>
          <h2>{category}</h2>
          <div className="food-grid">
            {items.map((food) => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      ))}

      {foods.length === 0 && (
        <div className="empty-cart">
          <h3>{t('restaurantDetail.emptyMenuTitle')}</h3>
          <p>{t('restaurantDetail.emptyMenuBody')}</p>
        </div>
      )}

      <ReviewsSection restaurantId={restaurant.id} />
    </main>
  )
}
