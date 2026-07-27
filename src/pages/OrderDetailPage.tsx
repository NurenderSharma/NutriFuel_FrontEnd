import { AnimatePresence } from 'framer-motion'
import { Check, Clock3, MapPin, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { OrderSuccess } from '../components/OrderSuccess'
import { Skeleton } from '../components/Skeleton'
import { ApiError, apiClient } from '../lib/apiClient'
import { useCartStore } from '../store/cartStore'

interface ApiOrderItem {
  food: string
  foodName?: string
  foodImages?: string[]
  qty: number
  unitPrice: number
}

interface ApiOrder {
  id: string
  restaurant: string
  restaurantName?: string
  status: string
  paymentStatus: string
  items: ApiOrderItem[]
  totalPrice: number
  pointsEarned: number
  goalAchieved: boolean
  deliveryAddress: { line1: string; city: string; state?: string; postalCode: string; phone: string }
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const TRACKER_STEPS = ['placed', 'preparing', 'out_for_delivery', 'delivered'] as const

function OrderTracker({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="order-tracker order-tracker-cancelled">
        <XCircle size={18} />
        <span>This order was cancelled.</span>
      </div>
    )
  }

  const currentIndex = TRACKER_STEPS.indexOf(status as (typeof TRACKER_STEPS)[number]);
  return (
    <div className="order-tracker">
      {TRACKER_STEPS.map((step, index) => (
        <div className={index <= currentIndex ? 'order-tracker-step done' : 'order-tracker-step'} key={step}>
          <span className="order-tracker-dot">{index < currentIndex ? <Check size={12} /> : index + 1}</span>
          <small>{STATUS_LABELS[step]}</small>
        </div>
      ))}
    </div>
  )
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(searchParams.get('paid') === '1')

  useEffect(() => {
    if (!id) return
    apiClient
      .get<ApiOrder>(`/orders/${id}`)
      .then((data) => {
        setOrder(data)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Order not found.')
        setStatus('error')
      })
  }, [id])

  useEffect(() => {
    if (searchParams.get('paid') === '1') clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'loading') {
    return (
      <main className="browse-main">
        <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
          <Skeleton height={12} width="20%" />
          <Skeleton height={30} width="50%" />
          <Skeleton height={80} />
          <Skeleton height={80} />
        </div>
      </main>
    )
  }
  if (status === 'error' || !order) {
    return <main className="browse-main"><p className="browse-status">{errorMessage}</p></main>
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Order</div>
        <h1>{order.restaurantName ?? 'Your order'}</h1>
        <p>Placed {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="order-detail-payment-row">
        <span className="order-detail-payment">{order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus}</span>
      </div>
      <OrderTracker status={order.status} />

      <div className="order-summary-mini order-detail-items">
        {order.items.map((item) => (
          <div key={item.food}>
            <span>{item.qty}× {item.foodName ?? 'Item'}</span>
            <b>₹{item.unitPrice * item.qty}</b>
          </div>
        ))}
      </div>

      <div className="price-line"><span>Total</span><b>₹{order.totalPrice}</b></div>
      {order.pointsEarned > 0 && (
        <div className="price-line muted"><span>Fuel points earned</span><b>+{order.pointsEarned}</b></div>
      )}

      <div className="order-detail-address">
        <MapPin size={15} />
        <span>{order.deliveryAddress.line1}, {order.deliveryAddress.city} {order.deliveryAddress.postalCode}</span>
      </div>
      <div className="order-detail-address">
        <Clock3 size={15} />
        <span>{order.deliveryAddress.phone}</span>
      </div>

      <AnimatePresence>
        {showSuccess && <OrderSuccess onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </main>
  )
}
