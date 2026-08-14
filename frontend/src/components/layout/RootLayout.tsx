import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ToastHost } from '@/components/ui'
import { tokenStore } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

export const RootLayout = () => {
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onExpired = () => {
      const hadUser = Boolean(useAuthStore.getState().user || tokenStore.get())
      clearSession()
      if (hadUser && pathname !== '/login' && pathname !== '/register' && pathname !== '/forgot-password') {
        toast.info('Your session expired. Please sign in again.')
        navigate('/login')
      }
    }
    window.addEventListener('sgl:session-expired', onExpired)
    return () => window.removeEventListener('sgl:session-expired', onExpired)
  }, [clearSession, navigate, pathname])



  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main key={pathname} className="animate-fade-in flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastHost />
      <ScrollRestoration />
    </div>
  )
}
