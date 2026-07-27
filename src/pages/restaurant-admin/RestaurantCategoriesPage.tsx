import { type FormEvent, useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

interface ApiCategory {
  id: string
  name: string
  sortOrder: number
}

export function RestaurantCategoriesPage() {
  const [restaurantId, setRestaurantId] = useState('')
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [newName, setNewName] = useState('')

  const load = (id: string) => {
    apiClient.get<ApiCategory[]>(`/categories/restaurant/${id}`).then(setCategories)
  }

  useEffect(() => {
    apiClient.get<{ id: string }>('/restaurants/mine').then((restaurant) => {
      setRestaurantId(restaurant.id)
      load(restaurant.id)
    })
  }, [])

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    if (!newName.trim()) return
    await apiClient.post('/categories', { restaurantId, name: newName.trim(), sortOrder: categories.length })
    setNewName('')
    load(restaurantId)
  }

  const handleDeactivate = async (id: string) => {
    await apiClient.del(`/categories/${id}`)
    load(restaurantId)
  }

  return (
    <div>
      <h1>Categories</h1>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Sort order</th><th></th></tr></thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.sortOrder}</td>
              <td className="data-table-actions"><button onClick={() => handleDeactivate(category.id)}>Deactivate</button></td>
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
