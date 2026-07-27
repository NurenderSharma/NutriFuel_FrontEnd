import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

interface Stats {
  pendingRestaurants: number
  approvedRestaurants: number
  totalOrders: number
  totalUsers: number
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      apiClient.getPage('/restaurants?status=pending&limit=1'),
      apiClient.getPage('/restaurants?status=approved&limit=1'),
      apiClient.getPage('/orders?limit=1'),
      apiClient.getPage('/users?limit=1'),
    ]).then(([pending, approved, orders, users]) => {
      setStats({
        pendingRestaurants: pending.meta.total,
        approvedRestaurants: approved.meta.total,
        totalOrders: orders.meta.total,
        totalUsers: users.meta.total,
      })
    })
  }, [])

  return (
    <div>
      <h1>Admin overview</h1>
      <div className="dashboard-stats">
        <div><b>{stats?.pendingRestaurants ?? '—'}</b><span>Pending restaurants</span></div>
        <div><b>{stats?.approvedRestaurants ?? '—'}</b><span>Approved restaurants</span></div>
        <div><b>{stats?.totalOrders ?? '—'}</b><span>Total orders</span></div>
        <div><b>{stats?.totalUsers ?? '—'}</b><span>Total users</span></div>
      </div>
    </div>
  )
}
