import clsx from 'clsx'
import { Heart, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button, ButtonLink } from '@/components/ui/Button'
import { isStaff, useAuthStore } from '@/store/auth'
import { cartCount, useCartStore } from '@/store/cart'
import { toast } from '@/store/toast'

const LINKS = [
  { to: '/animals', label: 'Livestock' },
  { to: '/animals?category=ram', label: 'Sallah rams' },
  { to: '/about', label: 'Our farm' },
  { to: '/contact', label: 'Contact' },
]

export const Header = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuthStore()
  const lines = useCartStore((state) => state.lines)
  const location = useLocation()
  const navigate = useNavigate()
  const count = cartCount(lines)

  useEffect(() => setOpen(false), [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return
    await logout()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 border-b transition duration-300',
        scrolled ? 'border-ink-100 bg-white/90 backdrop-blur-xl' : 'border-transparent bg-white',
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'rounded-full px-4 py-2 text-base font-medium transition',
                  isActive && link.to === location.pathname + location.search
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex size-11 items-center justify-center rounded-full border border-ink-100 text-ink-700 transition hover:border-ink-200 hover:bg-ink-50"
            aria-label="Cart"
          >
            <ShoppingCart className="size-5" />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-gold-400 text-[0.65rem] font-bold text-ink-900">
                {count}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="group relative hidden lg:block">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-full border border-ink-100 pl-1.5 pr-4 text-base font-semibold text-ink-800 transition hover:bg-ink-50"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-300">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
                {user.firstName}
              </button>
              <div className="invisible absolute right-0 top-full w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="card-surface overflow-hidden p-1.5 shadow-elevated">
                  <Link to="/account" className="flex items-center gap-2 rounded-xl px-3 py-2 text-base hover:bg-ink-50">
                    <User className="size-4 text-ink-400" /> My account
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-base hover:bg-ink-50">
                    <Package className="size-4 text-ink-400" /> Orders
                  </Link>
                  <Link to="/account/wishlist" className="flex items-center gap-2 rounded-xl px-3 py-2 text-base hover:bg-ink-50">
                    <Heart className="size-4 text-ink-400" /> Wishlist
                  </Link>
                  {isStaff(user.role) ? (
                    <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-base hover:bg-ink-50">
                      <LayoutDashboard className="size-4 text-ink-400" /> Admin console
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-base text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <ButtonLink to="/login" variant="ghost">
                Sign in
              </ButtonLink>
              <ButtonLink to="/register" variant="gold">
                Create account
              </ButtonLink>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex size-11 items-center justify-center rounded-full border border-ink-100 text-ink-700 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-ink-50">
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-ink-100" />
            {user ? (
              <>
                <Link to="/account" className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-ink-50">
                  My account
                </Link>
                <Link to="/account/orders" className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-ink-50">
                  Orders
                </Link>
                {isStaff(user.role) ? (
                  <Link to="/admin" className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-ink-50">
                    Admin console
                  </Link>
                ) : null}
                <Button variant="outline" className="mt-2" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <ButtonLink to="/login" variant="outline">
                  Sign in
                </ButtonLink>
                <ButtonLink to="/register" variant="gold">
                  Register
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
