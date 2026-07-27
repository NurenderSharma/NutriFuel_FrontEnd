import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '../../components/Skeleton'
import type { Restaurant } from '../../domain/restaurant'
import { ApiError, apiClient } from '../../lib/apiClient'

export function RestaurantDashboardPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [foodCount, setFoodCount] = useState<number | null>(null)
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'none' | 'error'>('loading')

  useEffect(() => {
    apiClient
      .get<Restaurant>('/restaurants/mine')
      .then(async (data) => {
        setRestaurant(data)
        const [foods, orders] = await Promise.all([
          apiClient.getPage(`/foods?restaurantId=${data.id}&limit=1`),
          apiClient.getPage('/orders/restaurant/mine?limit=1'),
        ])
        setFoodCount(foods.meta.total)
        setOrderCount(orders.meta.total)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        setStatus(error instanceof ApiError && error.code === 'NO_RESTAURANT' ? 'none' : 'error')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div>
        <Skeleton height={28} width="35%" />
        <div className="dashboard-stats" style={{ marginTop: 16 }}>
          {Array.from({ length: 3 }, (_, index) => <Skeleton height={70} key={index} />)}
        </div>
      </div>
    )
  }
  if (status === 'none') {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>You don't have a restaurant yet.</p>
        <Link className="primary-button bright" to="/restaurant-admin/settings">Create your restaurant</Link>
      </div>
    )
  }
  if (status === 'error' || !restaurant) return <p className="browse-status">Something went wrong.</p>

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p className={`status-pill status-${restaurant.status}`}>{restaurant.status}</p>
      <div className="dashboard-stats">
        <div><b>{foodCount ?? '—'}</b><span>Menu items</span></div>
        <div><b>{orderCount ?? '—'}</b><span>Orders received</span></div>
        <div><b>{restaurant.rating.toFixed(1)}</b><span>Rating</span></div>
      </div>
    </div>
  )
}
