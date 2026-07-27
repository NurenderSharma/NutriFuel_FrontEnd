import { Search as SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { FoodCard } from '../components/FoodCard'
import { Skeleton, SkeletonFoodGrid } from '../components/Skeleton'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import { useInfiniteScrollTrigger } from '../hooks/useInfiniteScrollTrigger'
import { apiClient } from '../lib/apiClient'
import { dedupeFoodItems } from '../lib/dedupeFoodItems'

const PAGE_SIZE = 12

export function SearchPage() {
  const { t } = useTranslation()
  const DIET_OPTIONS = [
    { value: '', label: t('search.dietEverything') },
    { value: 'veg', label: t('search.dietVeg') },
    { value: 'vegan', label: t('search.dietVegan') },
    { value: 'nonveg', label: t('search.dietNonVeg') },
  ]
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const dietaryPreference = searchParams.get('diet') ?? ''

  const [inputValue, setInputValue] = useState(query)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    setInputValue(query)
  }, [query])

  useEffect(() => {
    setPage(1)
  }, [dietaryPreference, query])

  useEffect(() => {
    const isFirstPage = page === 1
    if (isFirstPage) setStatus('loading')
    else setIsLoadingMore(true)

    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))
    if (query) params.set('search', query)
    if (dietaryPreference) params.set('dietaryPreference', dietaryPreference)

    apiClient
      .getPage<ApiCatalogFood>(`/foods?${params.toString()}`)
      .then((response) => {
        const mapped = response.data.map(mapApiFoodToFoodItem)
        setFoods((previous) => (isFirstPage ? mapped : dedupeFoodItems(previous, mapped)))
        setTotalPages(response.meta.totalPages)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
      .finally(() => setIsLoadingMore(false))
  }, [dietaryPreference, page, query])

  const hasMore = page < totalPages
  const sentinelRef = useInfiniteScrollTrigger(() => {
    setPage((current) => current + 1)
  }, status === 'ready' && hasMore && !isLoadingMore)

  const updateParams = (next: { q?: string; diet?: string }) => {
    const params = new URLSearchParams(searchParams)
    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q)
      else params.delete('q')
    }
    if (next.diet !== undefined) {
      if (next.diet) params.set('diet', next.diet)
      else params.delete('diet')
    }
    setSearchParams(params)
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">{t('search.kicker')}</div>
        <h1>{t('search.title')}</h1>
      </div>

      <form
        className="search-bar"
        onSubmit={(event) => {
          event.preventDefault()
          updateParams({ q: inputValue })
        }}
      >
        <SearchIcon size={17} />
        <input
          type="search"
          placeholder={t('search.placeholder')}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button className="primary-button bright" type="submit">{t('search.submit')}</button>
      </form>

      <div className="segmented-control search-diet-filter">
        {DIET_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={dietaryPreference === option.value ? 'active' : ''}
            onClick={() => updateParams({ diet: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <SkeletonFoodGrid />}
      {status === 'error' && <p className="browse-status">{t('search.error')}</p>}
      {status === 'ready' && foods.length === 0 && (
        <div className="empty-cart">
          <span><SearchIcon size={28} /></span>
          <h3>{t('search.emptyTitle')}</h3>
          <p>{t('search.emptyBody')}</p>
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
        <p className="browse-status">{t('search.reachedEnd')}</p>
      )}
    </main>
  )
}
