import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/components/RequireAuth'
import { AccountLayout } from '@/components/layout/AccountLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { RootLayout } from '@/components/layout/RootLayout'
import { AnimalDetailPage } from '@/pages/AnimalDetail'
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from '@/pages/Auth'
import { CartPage } from '@/pages/Cart'
import { CatalogPage } from '@/pages/Catalog'
import { CheckoutPage } from '@/pages/Checkout'
import { HomePage } from '@/pages/Home'
import { OrderConfirmedPage } from '@/pages/OrderConfirmed'
import { AboutPage, ContactPage, NotFoundPage } from '@/pages/Static'
import {
  AddressesPage,
  NotificationsPage,
  OrdersPage,
  ProfilePage,
  ReservationsPage,
  WishlistPage,
} from '@/pages/account'
import {
  AdminCouponsPage,
  AdminDashboardPage,
  AdminDeliveryPage,
  AdminInventoryPage,
  AdminMessagesPage,
  AdminOrdersPage,
  AdminSecurityPage,
} from '@/pages/admin'
import { AdminUsersPage } from '@/pages/admin/users'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/animals', element: <CatalogPage /> },
      { path: '/animals/:slug', element: <AnimalDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/reset-password/:token', element: <ResetPasswordPage /> },
      {
        path: '/order-confirmed/:id',
        element: (
          <RequireAuth>
            <OrderConfirmedPage />
          </RequireAuth>
        ),
      },
      {
        path: '/account',
        element: (
          <RequireAuth>
            <AccountLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'reservations', element: <ReservationsPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'addresses', element: <AddressesPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
      {
        path: '/admin',
        element: (
          <RequireAuth staffOnly>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'messages', element: <AdminMessagesPage /> },
          { path: 'inventory', element: <AdminInventoryPage /> },
          {
            path: 'users',
            element: (
              <RequireAuth adminOnly>
                <AdminUsersPage />
              </RequireAuth>
            ),
          },
          { path: 'coupons', element: <AdminCouponsPage /> },
          { path: 'delivery', element: <AdminDeliveryPage /> },
          { path: 'security', element: <AdminSecurityPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

export default App

