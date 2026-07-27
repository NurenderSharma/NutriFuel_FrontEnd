import { Star } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiClient } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'

interface ApiReview {
  id: string
  user: { id: string; name: string }
  rating: number
  comment: string
  createdAt: string
}

export function ReviewsSection({ restaurantId, foodId }: { restaurantId: string; foodId?: string }) {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  const load = () => {
    const path = foodId ? `/reviews/food/${foodId}` : `/reviews/restaurant/${restaurantId}`
    apiClient.getPage<ApiReview>(`${path}?limit=10`).then((response) => setReviews(response.data)).catch(() => undefined)
  }

  useEffect(load, [restaurantId, foodId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('submitting')
    try {
      await apiClient.post('/reviews', { restaurantId, ...(foodId ? { foodId } : {}), rating, comment })
      setComment('')
      setRating(5)
      setStatus('idle')
      load()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="reviews-section">
      <h2>{t('reviews.heading')}</h2>

      {user && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="review-stars-input">
            {[1, 2, 3, 4, 5].map((value) => (
              <button type="button" key={value} onClick={() => setRating(value)} aria-label={t('reviews.stars', { count: value })}>
                <Star size={18} fill={value <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <textarea
            placeholder={t('reviews.sharePlaceholder')}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          {status === 'error' && <p className="form-error">{t('reviews.couldNotSubmit')}</p>}
          <button className="primary-button bright" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? t('reviews.posting') : t('reviews.postReview')}
          </button>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 && <p className="browse-status">{t('reviews.noReviewsYet')}</p>}
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-card-top">
              <b>{review.user.name}</b>
              <span className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            {review.comment && <p>{review.comment}</p>}
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
