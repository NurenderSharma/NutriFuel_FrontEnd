import { TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RestaurantCard } from '../components/RestaurantCard'
import { Skeleton, SkeletonRestaurantGrid } from '../components/Skeleton'
import type { Restaurant } from '../domain/restaurant'
import { useInfiniteScrollTrigger } from '../hooks/useInfiniteScrollTrigger'
import { apiClient } from '../lib/apiClient'

const PAGE_SIZE = 12

export function PopularRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    const isFirstPage = page === 1
    if (isFirstPage) setStatus('loading')
    else setIsLoadingMore(true)

    apiClient
      .getPage<Restaurant>(`/restaurants?sort=popular&page=${page}&limit=${PAGE_SIZE}`)
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
  }, [page])

  const hasMore = page < totalPages
  const sentinelRef = useInfiniteScrollTrigger(() => {
    setPage((current) => current + 1)
  }, status === 'ready' && hasMore && !isLoadingMore)

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker"><TrendingUp size={13} /> Popular</div>
        <h1>The most-loved kitchens on NutriFuel</h1>
        <p>Sorted by review volume and rating from real orders.</p>
      </div>

      {status === 'loading' && <SkeletonRestaurantGrid />}
      {status === 'error' && <p className="browse-status">Couldn't load restaurants right now.</p>}
      {status === 'ready' && restaurants.length === 0 && (
        <div className="empty-cart">
          <span><TrendingUp size={28} /></span>
          <h3>No popular restaurants yet.</h3>
          <p>Once orders start coming in, the most-loved kitchens will show up here.</p>
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
        <p className="browse-status">You've reached the end — that's every popular kitchen right now.</p>
      )}
    </main>
  )
}
