import { NavLink, Outlet } from 'react-router-dom'

export interface DashboardNavItem {
  to: string
  label: string
  end?: boolean
}

export function DashboardLayout({ title, navItems }: { title: string; navItems: DashboardNavItem[] }) {
  return (
    <main className="dashboard-main">
      <aside className="dashboard-sidebar">
        <p className="section-kicker">{title}</p>
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </main>
  )
}
