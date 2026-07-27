import { PackageSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '../components/Skeleton'
import { ApiError, apiClient } from '../lib/apiClient'

interface ApiOrderSummary {
  id: string
  restaurant: string
  restaurantName?: string
  totalPrice: number
  status: string
  paymentStatus: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<ApiOrderSummary[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    apiClient
      .get<ApiOrderSummary[]>('/orders/me?limit=50')
      .then((data) => {
        setOrders(data)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Could not load your orders.')
        setStatus('error')
      })
  }, [])

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Order history</div>
        <h1>Your orders</h1>
      </div>

      {status === 'loading' && (
        <div className="order-history-list">
          {Array.from({ length: 4 }, (_, index) => <Skeleton height={64} key={index} />)}
        </div>
      )}
      {status === 'error' && <p className="browse-status">{errorMessage}</p>}
      {status === 'ready' && orders.length === 0 && (
        <div className="empty-cart">
          <span><PackageSearch size={28} /></span>
          <h3>You haven't placed an order yet.</h3>
          <p>Once you order, it'll show up here so you can track it and reorder easily.</p>
          <Link className="primary-button bright" to="/restaurants">Browse restaurants</Link>
        </div>
      )}

      {status === 'ready' && orders.length > 0 && (
        <div className="order-history-list">
          {orders.map((order) => (
            <Link className="order-history-row" key={order.id} to={`/orders/${order.id}`}>
              <div>
                <b>{order.restaurantName ?? 'Order'}</b>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="order-history-status">{STATUS_LABELS[order.status] ?? order.status}</span>
              <strong>₹{order.totalPrice}</strong>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
