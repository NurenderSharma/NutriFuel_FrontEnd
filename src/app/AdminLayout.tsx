import { DashboardLayout } from '../components/DashboardLayout'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/restaurants', label: 'Restaurants' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
]

export function AdminLayout() {
  return <DashboardLayout title="Admin" navItems={NAV_ITEMS} />
}
