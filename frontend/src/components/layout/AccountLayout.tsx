import clsx from 'clsx'
import { Bell, CalendarClock, Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

const LINKS = [
  { to: '/account', end: true, label: 'Profile', icon: User },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/reservations', label: 'Reservations', icon: CalendarClock },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
]

export const AccountLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return
    await logout()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="bg-ink-50 pb-20">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-page py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">My account</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : 'Account'}
          </h1>
          <p className="mt-2 text-ink-500">{user?.email}</p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[15rem_1fr]">
        <aside>
          <nav className="card-surface sticky top-24 flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {LINKS.map((link) => (
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
            <Button
              variant="ghost"
              className="mt-1 justify-start px-3.5 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
              icon={<LogOut className="size-4" />}
            >
              Sign out
            </Button>
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
