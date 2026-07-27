import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { calculateCartSummary } from '../domain'
import type { Address } from '../domain/address'
import { ApiError, apiClient } from '../lib/apiClient'
import { useCartStore } from '../store/cartStore'

interface CheckoutSessionResponse {
  checkoutUrl: string
  orderId: string
}

interface CouponValidationResult {
  valid: boolean
  discountAmount: number
  message?: string
}

export function CheckoutPage() {
  const { t } = useTranslation()
  const lines = useCartStore((state) => state.lines)
  const summary = useMemo(() => calculateCartSummary(lines), [lines])
  const restaurantId = lines[0]?.item.restaurantId

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null)
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  useEffect(() => {
    apiClient
      .get<Address[]>('/addresses')
      .then((addresses) => {
        setSavedAddresses(addresses)
        const preferred = addresses.find((address) => address.isDefault) ?? addresses[0]
        if (preferred) {
          setSelectedAddressId(preferred.id)
          setLine1(preferred.line1)
          setCity(preferred.city)
          setPostalCode(preferred.postalCode)
          setPhone(preferred.phone)
        }
      })
      .catch(() => setSavedAddresses([]))
  }, [])

  const selectAddress = (id: string) => {
    setSelectedAddressId(id)
    if (id === 'new') {
      setLine1('')
      setCity('')
      setPostalCode('')
      setPhone('')
      return
    }
    const address = savedAddresses.find((entry) => entry.id === id)
    if (!address) return
    setLine1(address.line1)
    setCity(address.city)
    setPostalCode(address.postalCode)
    setPhone(address.phone)
  }

  if (lines.length === 0) {
    return (
      <main className="browse-main">
        <div className="browse-heading">
          <div className="section-kicker">{t('checkout.kicker')}</div>
          <h1>{t('checkout.emptyCartTitle')}</h1>
        </div>
        <Link className="primary-button bright" to="/restaurants">{t('common.browseRestaurants')}</Link>
      </main>
    )
  }

  if (!restaurantId) {
    return (
      <main className="browse-main">
        <div className="browse-heading">
          <div className="section-kicker">{t('checkout.kicker')}</div>
          <h1>{t('checkout.noRestaurantTitle')}</h1>
          <p>{t('checkout.noRestaurantBody')}</p>
        </div>
      </main>
    )
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !restaurantId) return
    setCouponMessage(null)
    setIsApplyingCoupon(true)
    try {
      const result = await apiClient.post<CouponValidationResult>('/coupons/validate', {
        code: couponCode.trim(),
        restaurantId,
        orderSubtotal: summary.subtotal,
      })
      if (result.valid) {
        setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discountAmount: result.discountAmount })
        setCouponMessage(null)
      } else {
        setAppliedCoupon(null)
        setCouponMessage(result.message ?? t('checkout.couponCannotBeApplied'))
      }
    } catch (err) {
      setAppliedCoupon(null)
      setCouponMessage(err instanceof ApiError ? err.message : t('checkout.couldNotValidateCoupon'))
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponMessage(null)
  }

  const payableTotal = appliedCoupon ? Math.max(0, summary.subtotal - appliedCoupon.discountAmount) : summary.subtotal

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotConfigured(false)
    setIsSubmitting(true)
    try {
      const result = await apiClient.post<CheckoutSessionResponse>('/payments/checkout-session', {
        restaurantId,
        items: lines.map((line) => ({ foodId: line.item.id, quantity: line.quantity })),
        deliveryAddress: { line1, city, postalCode, phone },
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
      })
      window.location.href = result.checkoutUrl
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setNotConfigured(true)
      } else {
        setError(err instanceof ApiError ? err.message : t('common.somethingWentWrong'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">{t('checkout.kicker')}</div>
        <h1>{t('checkout.title')}</h1>
      </div>

      <div className="checkout-layout">
        <form className="auth-form checkout-form" onSubmit={handleSubmit}>
          {savedAddresses.length > 0 && (
            <div className="address-picker">
              <span>{t('checkout.deliverTo')}</span>
              {savedAddresses.map((address) => (
                <label className="address-picker-option" key={address.id}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address.id}
                    onChange={() => selectAddress(address.id)}
                  />
                  <span>
                    <b>{address.label}</b> — {address.line1}, {address.city} {address.postalCode}
                  </span>
                </label>
              ))}
              <label className="address-picker-option">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === 'new'}
                  onChange={() => selectAddress('new')}
                />
                <span>{t('checkout.useNewAddress')}</span>
              </label>
            </div>
          )}

          <label className="form-field">
            <span>{t('checkout.addressLine')}</span>
            <input required value={line1} onChange={(event) => setLine1(event.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('checkout.city')}</span>
            <input required value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('checkout.postalCode')}</span>
            <input required value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('checkout.phone')}</span>
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>

          <label className="form-field">
            <span>{t('checkout.couponCode')}</span>
            {appliedCoupon ? (
              <p className="coupon-applied">
                <BadgeCheck size={14} /> {t('checkout.couponAppliedOff', { code: appliedCoupon.code, amount: appliedCoupon.discountAmount })}
                <button className="text-button" type="button" onClick={handleRemoveCoupon}>{t('common.remove')}</button>
              </p>
            ) : (
              <div className="coupon-apply-row">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder={t('checkout.couponPlaceholder')}
                />
                <button
                  className="text-button"
                  type="button"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  onClick={handleApplyCoupon}
                >
                  {isApplyingCoupon ? t('checkout.checkingCoupon') : t('checkout.apply')}
                </button>
              </div>
            )}
            {couponMessage && <span className="form-error">{couponMessage}</span>}
          </label>

          {notConfigured && (
            <p className="form-error">
              {t('checkout.paymentsNotConfigured')}
            </p>
          )}
          {error && <p className="form-error">{error}</p>}

          <button className="primary-button bright" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('checkout.redirecting') : t('checkout.payWithStripe', { amount: payableTotal })}
          </button>
          <p className="checkout-note"><ShieldCheck size={13} /> {t('checkout.secureRedirect')}</p>
        </form>

        <div className="cart-summary-panel">
          <h3>{t('checkout.orderSummary')}</h3>
          <div className="order-summary-mini">
            {lines.map((line) => (
              <div key={line.item.id}>
                <span>{line.quantity}× {line.item.name}</span>
                <b>₹{line.item.price * line.quantity}</b>
              </div>
            ))}
          </div>
          <div className="price-line"><span>{t('checkout.subtotal')}</span><b>₹{summary.subtotal}</b></div>
          {appliedCoupon && (
            <div className="price-line"><span>{t('checkout.couponLine', { code: appliedCoupon.code })}</span><b>−₹{appliedCoupon.discountAmount}</b></div>
          )}
          <div className="price-line muted"><span>{t('checkout.delivery')}</span><b>{t('checkout.free')}</b></div>
          <div className="price-line"><span>{t('checkout.total')}</span><b>₹{payableTotal}</b></div>
        </div>
      </div>
    </main>
  )
}
