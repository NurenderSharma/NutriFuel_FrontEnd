import { useEffect, useState } from 'react'
import { SkeletonTableRows } from '../../components/Skeleton'
import type { Restaurant } from '../../domain/restaurant'
import { apiClient } from '../../lib/apiClient'

export function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = () => {
    setStatus('loading')
    apiClient
      .get<Restaurant[]>('/restaurants?limit=50')
      .then((data) => {
        setRestaurants(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const updateStatus = async (id: string, nextStatus: 'approved' | 'suspended') => {
    await apiClient.patch(`/restaurants/${id}/status`, { status: nextStatus })
    load()
  }

  return (
    <div>
      <h1>Restaurants</h1>
      {status === 'error' && <p className="browse-status">Couldn't load restaurants.</p>}
      {status === 'ready' && restaurants.length === 0 && <p className="browse-status">No restaurants yet.</p>}
      {status !== 'error' && (status === 'loading' || restaurants.length > 0) && (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Cuisines</th><th>Status</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {status === 'loading' && <SkeletonTableRows columns={5} />}
            {status === 'ready' && restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.cuisines.join(', ')}</td>
                <td><span className={`status-pill status-${restaurant.status}`}>{restaurant.status}</span></td>
                <td>{restaurant.isActive ? 'Yes' : 'No'}</td>
                <td className="data-table-actions">
                  {restaurant.status !== 'approved' && (
                    <button onClick={() => updateStatus(restaurant.id, 'approved')}>Approve</button>
                  )}
                  {restaurant.status !== 'suspended' && (
                    <button onClick={() => updateStatus(restaurant.id, 'suspended')}>Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
