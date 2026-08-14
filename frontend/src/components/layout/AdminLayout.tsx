import clsx from 'clsx'
import { BadgePercent, Beef, KeyRound, LayoutDashboard, MessageSquare, Package, Truck, Users } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const LINKS = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard, title: 'Operations overview' },
  { to: '/admin/orders', label: 'Orders', icon: Package, title: 'Customer orders' },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, title: 'Client messages' },
  { to: '/admin/inventory', label: 'Livestock', icon: Beef, title: 'Livestock inventory' },
  { to: '/admin/users', label: 'Users', icon: Users, title: 'User management', adminOnly: true },
  { to: '/admin/coupons', label: 'Coupons', icon: BadgePercent, title: 'Discount coupons' },
  { to: '/admin/delivery', label: 'Delivery zones', icon: Truck, title: 'Delivery zones' },
  { to: '/admin/security', label: 'Password', icon: KeyRound, title: 'Account security' },
]

export const AdminLayout = () => {
  const user = useAuthStore((state) => state.user)
  const { pathname } = useLocation()
  const title = LINKS.find((link) => link.to === pathname)?.title ?? 'Admin console'
  const links = LINKS.filter((link) => !link.adminOnly || user?.role === 'admin')

  return (
    <div className="bg-ink-50 pb-20">
      <div className="bg-ink-950">
        <div className="container-page py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">
            {user?.role === 'sales' ? 'Sales console' : 'Admin console'}
          </p>
          <h1 className="animate-rise mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-ink-300">
            Signed in as {user?.firstName} {user?.lastName} · {user?.role}
          </p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[15rem_1fr]">
        <aside>
          <nav className="card-surface sticky top-24 flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  clsx(
                    'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-base font-medium transition',
                    isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50',
                  )
                }
              >
                <link.icon className="size-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
