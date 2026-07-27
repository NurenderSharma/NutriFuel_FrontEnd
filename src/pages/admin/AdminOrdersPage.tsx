import { useEffect, useState } from 'react'
import { SkeletonTableRows } from '../../components/Skeleton'
import { apiClient } from '../../lib/apiClient'

interface ApiOrderSummary {
  id: string
  restaurant: string
  restaurantName?: string
  totalPrice: number
  status: string
  paymentStatus: string
  createdAt: string
}

const STATUSES = ['', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrderSummary[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    setStatus('loading')
    const params = new URLSearchParams({ limit: '50' })
    if (statusFilter) params.set('status', statusFilter)
    apiClient
      .get<ApiOrderSummary[]>(`/orders?${params.toString()}`)
      .then((data) => {
        setOrders(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [statusFilter])

  return (
    <div>
      <h1>All orders</h1>
      <select className="dashboard-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
        {STATUSES.map((value) => <option key={value} value={value}>{value || 'All statuses'}</option>)}
      </select>

      {status === 'error' && <p className="browse-status">Couldn't load orders.</p>}
      {status === 'ready' && orders.length === 0 && <p className="browse-status">No orders match this filter.</p>}
      {status !== 'error' && (status === 'loading' || orders.length > 0) && (
        <table className="data-table">
          <thead>
            <tr><th>Restaurant</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th></tr>
          </thead>
          <tbody>
            {status === 'loading' && <SkeletonTableRows columns={5} />}
            {status === 'ready' && orders.map((order) => (
              <tr key={order.id}>
                <td>{order.restaurantName ?? order.restaurant}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.status}</td>
                <td>{order.paymentStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
