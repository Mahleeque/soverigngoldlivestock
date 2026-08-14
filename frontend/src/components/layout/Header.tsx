import clsx from 'clsx'
import { Gift, LayoutDashboard, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AvailableCouponsModal } from '@/components/AvailableCouponsModal'
import { Logo } from '@/components/Logo'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui'
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
  const [couponsOpen, setCouponsOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

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

  const handleConfirmLogout = async () => {
    await logout()
    setLogoutConfirmOpen(false)
    toast.success('Signed out successfully')
    navigate('/')
  }

  return (
    <>
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
            <button
              type="button"
              onClick={() => setCouponsOpen(true)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-base font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
            >
              <Gift className="size-4 text-gold-600" />
              <span>Deals</span>
            </button>
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
              <div className="relative hidden items-center gap-2 sm:flex">
                {isStaff(user.role) ? (
                  <ButtonLink to="/admin" variant="outline" size="sm" icon={<LayoutDashboard className="size-4" />}>
                    Dashboard
                  </ButtonLink>
                ) : (
                  <ButtonLink to="/account" variant="ghost" size="sm" icon={<User className="size-4" />}>
                    {user.firstName}
                  </ButtonLink>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogoutConfirmOpen(true)}
                  className="text-ink-500 hover:text-ink-900"
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <ButtonLink to="/login" variant="ghost" size="sm">
                  Sign in
                </ButtonLink>
                <ButtonLink to="/register" size="sm">
                  Create account
                </ButtonLink>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex size-11 items-center justify-center rounded-full border border-ink-100 text-ink-700 hover:bg-ink-50 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open ? (
          <div className="border-t border-ink-100 bg-white px-6 py-6 lg:hidden">
            <nav className="flex flex-col gap-2">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-700 hover:bg-ink-50"
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setCouponsOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-ink-700 transition hover:bg-ink-50 text-left"
              >
                <Gift className="size-4 text-gold-600" />
                <span>Active Deals &amp; Coupons</span>
              </button>

              <div className="my-2 border-t border-ink-100" />

              {user ? (
                <>
                  <Link
                    to={isStaff(user.role) ? '/admin' : '/account'}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-ink-900 hover:bg-ink-50"
                  >
                    <User className="size-4" />
                    <span>{user.firstName} ({isStaff(user.role) ? 'Staff' : 'My Account'})</span>
                  </Link>

                  <Button
                    variant="outline"
                    className="mt-2 text-ink-700"
                    onClick={() => {
                      setOpen(false)
                      setLogoutConfirmOpen(true)
                    }}
                    icon={<LogOut className="size-4" />}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <ButtonLink to="/login" variant="outline">
                    Sign in
                  </ButtonLink>
                  <ButtonLink to="/register">
                    Create account
                  </ButtonLink>
                </div>
              )}
            </nav>
          </div>
        ) : null}
      </header>

      {/* Available Deals & Coupons Modal */}
      <AvailableCouponsModal
        isOpen={couponsOpen}
        onClose={() => setCouponsOpen(false)}
      />

      {/* Sign Out Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your Sovereign Gold Livestock account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="primary"
        icon={<LogOut className="size-6 text-moss-700" />}
      />
    </>
  )
}
