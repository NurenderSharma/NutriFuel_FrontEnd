import { type FormEvent, useEffect, useState } from 'react'
import type { Restaurant } from '../../domain/restaurant'
import { apiClient } from '../../lib/apiClient'

interface ApiCategory {
  id: string
  restaurantId: string
  name: string
  sortOrder: number
  active: boolean
}

export function AdminCategoriesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantId, setRestaurantId] = useState('')
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    apiClient.get<Restaurant[]>('/restaurants?limit=50').then((data) => {
      setRestaurants(data)
      if (data.length > 0 && data[0]) setRestaurantId(data[0].id)
    })
  }, [])

  const loadCategories = (id: string) => {
    if (!id) return
    apiClient.get<ApiCategory[]>(`/categories/restaurant/${id}`).then(setCategories)
  }

  useEffect(() => {
    loadCategories(restaurantId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId])

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (!newName.trim()) return
    await apiClient.post('/categories', { restaurantId, name: newName.trim(), sortOrder: categories.length })
    setNewName('')
    loadCategories(restaurantId)
  }

  const handleDeactivate = async (id: string) => {
    await apiClient.del(`/categories/${id}`)
    loadCategories(restaurantId)
  }

  return (
    <div>
      <h1>Categories</h1>
      <select className="dashboard-filter" value={restaurantId} onChange={(event) => setRestaurantId(event.target.value)}>
        {restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>)}
      </select>

      <table className="data-table">
        <thead><tr><th>Name</th><th>Sort order</th><th></th></tr></thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.sortOrder}</td>
              <td className="data-table-actions">
                <button onClick={() => handleDeactivate(category.id)}>Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="inline-form" onSubmit={handleCreate}>
        <input placeholder="New category name" value={newName} onChange={(event) => setNewName(event.target.value)} />
        <button className="primary-button bright" type="submit">Add category</button>
      </form>
    </div>
  )
}
