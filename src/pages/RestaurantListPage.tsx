import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { RestaurantCard } from '../components/RestaurantCard'
import { Skeleton, SkeletonRestaurantGrid } from '../components/Skeleton'
import type { Restaurant } from '../domain/restaurant'
import { apiClient } from '../lib/apiClient'
import { useInfiniteScrollTrigger } from '../hooks/useInfiniteScrollTrigger'

const PAGE_SIZE = 12

export function RestaurantListPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const cuisine = searchParams.get('cuisine') ?? ''

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [cuisine])

  useEffect(() => {
    const isFirstPage = page === 1
    if (isFirstPage) setStatus('loading')
    else setIsLoadingMore(true)

    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
    if (cuisine) params.set('cuisine', cuisine)

    apiClient
      .getPage<Restaurant>(`/restaurants?${params.toString()}`)
      .then((response) => {
        setRestaurants((previous) => {
          if (isFirstPage) return response.data
          const seenIds = new Set(previous.map((restaurant) => restaurant.id))
          return [...previous, ...response.data.filter((restaurant) => !seenIds.has(restaurant.id))]
        })
        setTotalPages(response.meta.totalPages)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
      .finally(() => setIsLoadingMore(false))
  }, [page, cuisine])

  const hasMore = page < totalPages
  const sentinelRef = useInfiniteScrollTrigger(() => {
    setPage((current) => current + 1)
  }, status === 'ready' && hasMore && !isLoadingMore)

  const clearCuisine = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('cuisine')
    setSearchParams(params)
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">{t('restaurantList.kicker')}</div>
        <h1>{cuisine ? t('restaurantList.titleFiltered', { cuisine }) : t('restaurantList.title')}</h1>
        <p>{t('restaurantList.subtitle')}</p>
        {cuisine && (
          <button className="text-button" onClick={clearCuisine}>
            <X size={13} /> {t('restaurantList.clearFilter', { cuisine })}
          </button>
        )}
      </div>

      {status === 'loading' && <SkeletonRestaurantGrid />}
      {status === 'error' && <p className="browse-status">{t('restaurantList.couldNotLoad')}</p>}
      {status === 'ready' && restaurants.length === 0 && (
        <div className="empty-cart">
          <h3>{t('restaurantList.emptyTitle')}</h3>
          <p>{t('restaurantList.emptyBody')}</p>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
          {isLoadingMore && Array.from({ length: 4 }, (_, index) => (
            <div className="skeleton-restaurant-card" key={`loading-${index}`}>
              <Skeleton />
              <div className="skeleton-card-body">
                <Skeleton height={16} width="70%" />
                <Skeleton height={11} width="90%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'ready' && hasMore && <div ref={sentinelRef} className="infinite-scroll-sentinel" aria-hidden="true" />}
      {status === 'ready' && !hasMore && restaurants.length > 0 && (
        <p className="browse-status">{t('restaurantList.reachedEnd')}</p>
      )}
    </main>
  )
}
