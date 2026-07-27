import { Plus, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Skeleton } from '../../components/Skeleton'
import type { Restaurant } from '../../domain/restaurant'
import { ApiError, apiClient } from '../../lib/apiClient'

export function RestaurantSettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [hasRestaurant, setHasRestaurant] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cuisines, setCuisines] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    apiClient
      .get<Restaurant>('/restaurants/mine')
      .then((data) => {
        setRestaurant(data)
        setHasRestaurant(true)
        setName(data.name)
        setDescription(data.description)
        setCuisines(data.cuisines.join(', '))
        setGallery(data.gallery ?? [])
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.code === 'NO_RESTAURANT') setHasRestaurant(false)
      })
  }, [])

  const handleAddImage = async () => {
    if (!restaurant || !newImageUrl.trim()) return
    const nextGallery = [...gallery, newImageUrl.trim()]
    const updated = await apiClient.patch<Restaurant>(`/restaurants/${restaurant.id}`, { gallery: nextGallery })
    setRestaurant(updated)
    setGallery(updated.gallery ?? [])
    setNewImageUrl('')
  }

  const handleRemoveImage = async (url: string) => {
    if (!restaurant) return
    const nextGallery = gallery.filter((entry) => entry !== url)
    const updated = await apiClient.patch<Restaurant>(`/restaurants/${restaurant.id}`, { gallery: nextGallery })
    setRestaurant(updated)
    setGallery(updated.gallery ?? [])
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)
    const cuisineList = cuisines.split(',').map((c) => c.trim()).filter(Boolean)
    try {
      if (restaurant) {
        const updated = await apiClient.patch<Restaurant>(`/restaurants/${restaurant.id}`, {
          name, description, cuisines: cuisineList,
        })
        setRestaurant(updated)
        setGallery(updated.gallery ?? [])
        setMessage('Saved.')
      } else {
        const created = await apiClient.post<Restaurant>('/restaurants', { name, description, cuisines: cuisineList })
        setRestaurant(created)
        setHasRestaurant(true)
        setGallery(created.gallery ?? [])
        setMessage('Restaurant created — an admin needs to approve it before it appears publicly.')
      }
    } catch {
      setError('Could not save. Check the fields and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasRestaurant === null) {
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
        <Skeleton height={28} width="40%" />
        <Skeleton height={44} />
        <Skeleton height={80} />
        <Skeleton height={44} />
      </div>
    )
  }

  return (
    <div>
      <h1>{hasRestaurant ? 'Restaurant settings' : 'Create your restaurant'}</h1>
      {restaurant && <p className={`status-pill status-${restaurant.status}`}>{restaurant.status}</p>}
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label className="form-field"><span>Name</span><input required value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="form-field"><span>Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label className="form-field"><span>Cuisines (comma separated)</span><input value={cuisines} onChange={(e) => setCuisines(e.target.value)} /></label>
        {message && <p className="auth-subtitle">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button bright" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : hasRestaurant ? 'Save changes' : 'Create restaurant'}
        </button>
      </form>

      {restaurant && (
        <>
          <h2>Photo gallery</h2>
          <div className="gallery-editor">
            {gallery.map((url) => (
              <div className="gallery-editor-row" key={url}>
                <img src={url} alt="" />
                <input value={url} readOnly />
                <button type="button" className="icon-button" aria-label="Remove image" onClick={() => handleRemoveImage(url)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="gallery-editor-add">
              <input
                placeholder="https://…"
                value={newImageUrl}
                onChange={(event) => setNewImageUrl(event.target.value)}
              />
              <button type="button" className="text-button" onClick={handleAddImage} disabled={!newImageUrl.trim()}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
