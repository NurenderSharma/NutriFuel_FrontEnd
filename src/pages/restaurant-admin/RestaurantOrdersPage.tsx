import { useEffect, useState } from 'react'
import { SkeletonTableRows } from '../../components/Skeleton'
import { apiClient } from '../../lib/apiClient'

interface ApiOrder {
  id: string
  totalPrice: number
  status: string
  paymentStatus: string
  createdAt: string
}

const NEXT_STATUSES: Record<string, string[]> = {
  placed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
}

export function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = () => {
    setStatus('loading')
    apiClient
      .get<ApiOrder[]>('/orders/restaurant/mine?limit=50')
      .then((data) => {
        setOrders(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const updateStatus = async (id: string, nextStatus: string) => {
    await apiClient.patch(`/orders/${id}/status`, { status: nextStatus })
    load()
  }

  return (
    <div>
      <h1>Orders</h1>
      {status === 'error' && <p className="browse-status">Couldn't load orders.</p>}
      {status === 'ready' && orders.length === 0 && <p className="browse-status">No orders yet.</p>}
      {status !== 'error' && (status === 'loading' || orders.length > 0) && (
        <table className="data-table">
          <thead><tr><th>Order</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {status === 'loading' && <SkeletonTableRows columns={5} />}
            {status === 'ready' && orders.map((order) => {
              const options = NEXT_STATUSES[order.status] ?? []
              return (
                <tr key={order.id}>
                  <td>{order.id.slice(-8)}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.status}</td>
                  <td>
                    {options.length > 0 ? (
                      <select defaultValue="" onChange={(event) => event.target.value && updateStatus(order.id, event.target.value)}>
                        <option value="" disabled>Choose…</option>
                        {options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : (
                      <span className="browse-status" style={{ margin: 0 }}>Final</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
