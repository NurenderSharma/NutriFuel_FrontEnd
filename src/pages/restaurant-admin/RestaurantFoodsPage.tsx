import { type FormEvent, useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

interface ApiCategory {
  id: string
  name: string
}

interface ApiFood {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

const emptyForm = {
  name: '',
  description: '',
  categoryId: '',
  cuisine: '',
  dietaryPreference: 'veg' as 'veg' | 'nonveg' | 'vegan',
  isVeg: true,
  isVegan: false,
  price: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  fiber: '',
  sugar: '',
  imageUrl: '',
  tags: '',
  prepTimeMinutes: '15',
}

export function RestaurantFoodsPage() {
  const [restaurantId, setRestaurantId] = useState('')
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [foods, setFoods] = useState<ApiFood[]>([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadFoods = (id: string) => {
    apiClient.getPage<ApiFood>(`/foods?restaurantId=${id}&limit=50`).then((response) => setFoods(response.data))
  }

  useEffect(() => {
    apiClient.get<{ id: string }>('/restaurants/mine').then((restaurant) => {
      setRestaurantId(restaurant.id)
      apiClient.get<ApiCategory[]>(`/categories/restaurant/${restaurant.id}`).then((cats) => {
        setCategories(cats)
        setForm((current) => ({ ...current, categoryId: cats[0]?.id ?? '' }))
      })
      loadFoods(restaurant.id)
    })
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await apiClient.post('/foods', {
        name: form.name,
        description: form.description,
        images: form.imageUrl ? [form.imageUrl] : [],
        categoryId: form.categoryId,
        cuisine: form.cuisine,
        dietaryPreference: form.dietaryPreference,
        isVeg: form.isVeg,
        isVegan: form.isVegan,
        allergens: [],
        price: Number(form.price),
        nutrition: {
          calories: Number(form.calories),
          protein: Number(form.protein),
          carbs: Number(form.carbs),
          fat: Number(form.fat),
          fiber: Number(form.fiber),
          sugar: Number(form.sugar),
        },
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        prepTimeMinutes: Number(form.prepTimeMinutes),
      })
      setForm({ ...emptyForm, categoryId: form.categoryId })
      loadFoods(restaurantId)
    } catch {
      setError('Could not create the food item. Check the fields and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    await apiClient.del(`/foods/${id}`)
    loadFoods(restaurantId)
  }

  return (
    <div>
      <h1>Menu items</h1>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th></th></tr></thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td>{food.name}</td>
              <td>{food.category}</td>
              <td>₹{food.price}</td>
              <td>{food.available ? 'Yes' : 'No'}</td>
              <td className="data-table-actions"><button onClick={() => handleDelete(food.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add a menu item</h2>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field"><span>Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="form-field"><span>Category</span>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="form-field"><span>Cuisine</span><input required value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} /></label>
          <label className="form-field"><span>Dietary preference</span>
            <select value={form.dietaryPreference} onChange={(e) => setForm({ ...form, dietaryPreference: e.target.value as typeof form.dietaryPreference })}>
              <option value="veg">Veg</option>
              <option value="vegan">Vegan</option>
              <option value="nonveg">Non-veg</option>
            </select>
          </label>
          <label className="form-field"><span>Price (₹)</span><input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
          <label className="form-field"><span>Prep time (min)</span><input type="number" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: e.target.value })} /></label>
          <label className="form-field"><span>Calories</span><input required type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} /></label>
          <label className="form-field"><span>Protein (g)</span><input required type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} /></label>
          <label className="form-field"><span>Carbs (g)</span><input required type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} /></label>
          <label className="form-field"><span>Fat (g)</span><input required type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} /></label>
          <label className="form-field"><span>Fiber (g)</span><input required type="number" value={form.fiber} onChange={(e) => setForm({ ...form, fiber: e.target.value })} /></label>
          <label className="form-field"><span>Sugar (g)</span><input required type="number" value={form.sugar} onChange={(e) => setForm({ ...form, sugar: e.target.value })} /></label>
          <label className="form-field"><span>Image URL</span><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label className="form-field"><span>Tags (comma separated)</span><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
        </div>
        <label className="form-field"><span>Description</span><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button bright" type="submit" disabled={isSubmitting || !form.categoryId}>
          {isSubmitting ? 'Saving…' : 'Add item'}
        </button>
      </form>
    </div>
  )
}
