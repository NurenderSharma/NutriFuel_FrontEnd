import { DashboardLayout } from '../components/DashboardLayout'

const NAV_ITEMS = [
  { to: '/restaurant-admin', label: 'Overview', end: true },
  { to: '/restaurant-admin/foods', label: 'Foods' },
  { to: '/restaurant-admin/categories', label: 'Categories' },
  { to: '/restaurant-admin/coupons', label: 'Coupons' },
  { to: '/restaurant-admin/orders', label: 'Orders' },
  { to: '/restaurant-admin/settings', label: 'Settings' },
]

export function RestaurantAdminLayout() {
  return <DashboardLayout title="Restaurant" navItems={NAV_ITEMS} />
}
