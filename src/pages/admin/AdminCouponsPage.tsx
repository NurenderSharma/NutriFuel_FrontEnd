import { type FormEvent, useEffect, useState } from 'react'
import type { Coupon } from '../../domain/coupon'
import type { Restaurant } from '../../domain/restaurant'
import { apiClient } from '../../lib/apiClient'

const emptyForm = { code: '', discountType: 'percent' as 'percent' | 'fixed', discountValue: '', minOrderValue: '', maxRedemptions: '' }

export function AdminCouponsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantId, setRestaurantId] = useState('')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    apiClient.get<Restaurant[]>('/restaurants?limit=50').then((data) => {
      setRestaurants(data)
      if (data.length > 0 && data[0]) setRestaurantId(data[0].id)
    })
  }, [])

  const loadCoupons = (id: string) => {
    if (!id) return
    apiClient.get<Coupon[]>(`/coupons/mine?restaurantId=${id}`).then(setCoupons)
  }

  useEffect(() => {
    loadCoupons(restaurantId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId])

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!form.code.trim() || !form.discountValue) return
    setIsSubmitting(true)
    try {
      await apiClient.post('/coupons', {
        restaurantId,
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        ...(form.minOrderValue ? { minOrderValue: Number(form.minOrderValue) } : {}),
        ...(form.maxRedemptions ? { maxRedemptions: Number(form.maxRedemptions) } : {}),
      })
      setForm(emptyForm)
      loadCoupons(restaurantId)
    } catch {
      setError('Could not create this coupon. The code may already be in use.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    await apiClient.del(`/coupons/${id}`)
    loadCoupons(restaurantId)
  }

  return (
    <div>
      <h1>Coupons</h1>
      <select className="dashboard-filter" value={restaurantId} onChange={(event) => setRestaurantId(event.target.value)}>
        {restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>)}
      </select>

      <table className="data-table">
        <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Redeemed</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
              <td>₹{coupon.minOrderValue}</td>
              <td>{coupon.redemptionCount}{coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ''}</td>
              <td><span className={coupon.active ? 'status-pill status-approved' : 'status-pill status-suspended'}>{coupon.active ? 'active' : 'inactive'}</span></td>
              <td className="data-table-actions">
                {coupon.active && <button onClick={() => handleDeactivate(coupon.id)}>Deactivate</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {coupons.length === 0 && (
        <div className="empty-cart">
          <h3>No coupons yet for this restaurant.</h3>
          <p>Create one below to offer a discount at checkout.</p>
        </div>
      )}

      <form className="dashboard-form" onSubmit={handleCreate}>
        <div className="form-grid">
          <label className="form-field">
            <span>Code</span>
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WELCOME10" />
          </label>
          <label className="form-field">
            <span>Type</span>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'fixed' })}>
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
          </label>
          <label className="form-field">
            <span>Value</span>
            <input required type="number" min="0" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          </label>
          <label className="form-field">
            <span>Min order value (optional)</span>
            <input type="number" min="0" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
          </label>
          <label className="form-field">
            <span>Max redemptions (optional)</span>
            <input type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button bright" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create coupon'}
        </button>
      </form>
    </div>
  )
}
