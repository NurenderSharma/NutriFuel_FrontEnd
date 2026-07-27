import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FoodCard } from '../components/FoodCard'
import { Skeleton, SkeletonFoodGrid } from '../components/Skeleton'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import { useInfiniteScrollTrigger } from '../hooks/useInfiniteScrollTrigger'
import { apiClient } from '../lib/apiClient'
import { dedupeFoodItems } from '../lib/dedupeFoodItems'

const PAGE_SIZE = 12

export function TrendingFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    const isFirstPage = page === 1
    if (isFirstPage) setStatus('loading')
    else setIsLoadingMore(true)

    apiClient
      .getPage<ApiCatalogFood>(`/foods?sort=trending&page=${page}&limit=${PAGE_SIZE}`)
      .then((response) => {
        const mapped = response.data.map(mapApiFoodToFoodItem)
        setFoods((previous) => (isFirstPage ? mapped : dedupeFoodItems(previous, mapped)))
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
        <div className="section-kicker"><Flame size={13} /> Trending</div>
        <h1>What everyone's ordering right now</h1>
        <p>Ranked by review volume and rating across every restaurant on NutriFuel.</p>
      </div>

      {status === 'loading' && <SkeletonFoodGrid />}
      {status === 'error' && <p className="browse-status">Couldn't load trending meals right now.</p>}
      {status === 'ready' && foods.length === 0 && (
        <div className="empty-cart">
          <span><Flame size={28} /></span>
          <h3>Nothing trending yet.</h3>
          <p>Order volume is still building — check back once more reviews come in.</p>
        </div>
      )}

      {foods.length > 0 && (
        <div className="food-grid">
          {foods.map((food) => <FoodCard key={food.id} food={food} />)}
          {isLoadingMore && Array.from({ length: 4 }, (_, index) => (
            <div className="skeleton-food-card" key={`loading-${index}`}>
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
      {status === 'ready' && !hasMore && foods.length > 0 && (
        <p className="browse-status">You've reached the end — that's everything trending right now.</p>
      )}
    </main>
  )
}
