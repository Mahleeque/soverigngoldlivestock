import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http, unwrap, unwrapPaged } from '@/lib/api'
import type {
  AdminUser,
  Animal,
  Conversation,
  Coupon,
  DashboardOverview,
  DeliveryZone,
  Notification,
  Order,
  Payment,
  Profile,
  Reservation,
  Review,
  SalesSummary,
} from '@/types'

export interface AnimalFilters {
  search?: string
  category?: string
  gender?: string
  size?: string
  status?: string
  featured?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: number
  limit?: number
}

const clean = (filters: AnimalFilters): Record<string, string> =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== '' && value !== null)
      .map(([key, value]) => [key, String(value)]),
  )

export const useAnimals = (filters: AnimalFilters) =>
  useQuery({
    queryKey: ['animals', filters],
    queryFn: () => unwrapPaged<Animal>(http.get('/animals', { params: clean(filters) })),
    staleTime: 30_000,
  })

export const useAnimal = (slug?: string) =>
  useQuery({
    queryKey: ['animal', slug],
    queryFn: () => unwrap<Animal>(http.get(`/animals/${slug}`)),
    enabled: Boolean(slug),
  })

export const useAnimalReviews = (animalId?: string) =>
  useQuery({
    queryKey: ['reviews', animalId],
    queryFn: () => unwrap<Review[]>(http.get(`/reviews/animals/${animalId}`)),
    enabled: Boolean(animalId),
  })

export const useDeliveryZones = () =>
  useQuery({
    queryKey: ['delivery-zones'],
    queryFn: () => unwrap<DeliveryZone[]>(http.get('/checkout/delivery-zones')),
    staleTime: 300_000,
  })

export const useActiveCoupons = () =>
  useQuery({
    queryKey: ['active-coupons'],
    queryFn: () => unwrap<Coupon[]>(http.get('/checkout/coupons/active')),
    staleTime: 60_000,
  })

export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => unwrap<Profile>(http.get('/users/me')),
    enabled,
  })

export const useMyOrders = (enabled = true) =>
  useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: () => unwrap<Order[]>(http.get('/orders/mine')),
    enabled,
  })

export const useMyOrder = (id?: string) =>
  useQuery({
    queryKey: ['orders', 'mine', id],
    queryFn: () => unwrap<Order>(http.get(`/orders/mine/${id}`)),
    enabled: Boolean(id),
  })

export const useMyReservations = (enabled = true) =>
  useQuery({
    queryKey: ['reservations'],
    queryFn: () => unwrap<Reservation[]>(http.get('/users/me/reservations')),
    enabled,
  })

export const useMyNotifications = (enabled = true) =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: () => unwrap<Notification[]>(http.get('/users/me/notifications')),
    enabled,
  })

export const useMyConversations = (enabled = true) =>
  useQuery({
    queryKey: ['conversations', 'mine'],
    queryFn: () => unwrap<Conversation[]>(http.get('/conversations/mine')),
    enabled,
  })

export const useAdminConversations = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'conversations'],
    queryFn: () => unwrap<Conversation[]>(http.get('/admin/conversations')),
    enabled,
  })

export const useCreateConversation = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; email: string; phone: string; topic: string; message: string }) =>
      unwrap<Conversation>(http.post('/conversations', payload)),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['conversations'] })
      client.invalidateQueries({ queryKey: ['admin', 'conversations'] })
    },
  })
}

export const useReplyConversation = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      unwrap<Conversation>(http.post(`/conversations/${id}/messages`, { message })),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['conversations'] })
      client.invalidateQueries({ queryKey: ['admin', 'conversations'] })
      client.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useDashboardOverview = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => unwrap<DashboardOverview>(http.get('/admin/dashboard/overview')),
    enabled,
  })

export const useSalesSummary = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'sales-summary'],
    queryFn: () => unwrap<SalesSummary>(http.get('/reports/sales-summary')),
    enabled,
  })

export const useAdminResource = <T>(
  resource: 'coupons' | 'deliveryZones' | 'settings' | 'orders' | 'payments',
  enabled = true,
) =>
  useQuery({
    queryKey: ['admin', resource],
    queryFn: () => unwrap<T[]>(http.get(`/admin/${resource}`)),
    enabled,
  })


export const useToggleWishlist = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (animalId: string) => unwrap<{ wished: boolean }>(http.post(`/users/me/wishlist/${animalId}`)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export interface CreateOrderPayload {
  items: { animal: string; quantity: number }[]
  deliveryAddress: {
    fullName: string
    phone: string
    addressLine: string
    city: string
    state: string
  }
  deliveryFee?: number
  couponCode?: string
}

export const useCreateOrder = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => unwrap<Order>(http.post('/orders', payload)),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['orders'] })
      client.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export const useValidateCoupon = () =>
  useMutation({
    mutationFn: (payload: { code: string; subtotal: number }) =>
      unwrap<{ coupon: Coupon; discount: number }>(http.post('/checkout/coupons/validate', payload)),
  })

export const useCreateReservation = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (animalId: string) => unwrap<Reservation>(http.post('/orders/reservations', { animalId })),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['reservations'] })
      client.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export const useInitializePayment = () =>
  useMutation({
    mutationFn: (payload: { orderId: string; provider: 'paystack' | 'flutterwave'; email?: string }) =>
      unwrap<Payment>(
        http.post(`/payments/${payload.provider}/initialize`, { orderId: payload.orderId, email: payload.email }),
      ),
  })

export const useUpdateProfile = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string }) =>
      unwrap<Profile>(http.patch('/users/me', payload)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export const useAddAddress = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: { label: string; addressLine: string; city: string; state: string; phone?: string }) =>
      unwrap<Profile['addresses']>(http.post('/users/me/addresses', payload)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export const useMarkNotificationRead = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<Notification>(http.patch(`/notifications/${id}/read`)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export interface AdminUserFilters {
  search?: string
  role?: string
  status?: string
  limit?: number
}

export const useAdminUsers = (filters: AdminUserFilters = {}, enabled = true) =>
  useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () =>
      unwrapPaged<AdminUser>(http.get('/admin/users', { params: clean(filters as AnimalFilters) })),
    enabled,
  })

export const useAdminUserMutations = () => {
  const client = useQueryClient()
  const invalidate = () => client.invalidateQueries({ queryKey: ['admin', 'users'] })
  return {
    setRole: useMutation({
      mutationFn: ({ id, role }: { id: string; role: string }) =>
        unwrap<AdminUser>(http.patch(`/admin/users/${id}/role`, { role })),
      onSuccess: invalidate,
    }),
    setBlocked: useMutation({
      mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
        unwrap<AdminUser>(http.patch(`/admin/users/${id}/blocked`, { blocked })),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => unwrap<AdminUser>(http.delete(`/admin/users/${id}`)),
      onSuccess: invalidate,
    }),
  }
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      unwrap(http.post('/auth/change-password', payload)),
  })

export const useDeleteAnimal = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<Animal>(http.delete(`/animals/${id}`)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['animals'] }),
  })
}

export const useCreateAnimal = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Animal>) => unwrap<Animal>(http.post('/animals', payload)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['animals'] }),
  })
}

export const useUpdateAnimal = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Animal> }) =>
      unwrap<Animal>(http.patch(`/animals/${id}`, payload)),
    onMutate: async ({ id, payload }: { id: string; payload: Partial<Animal> }) => {
      await client.cancelQueries({ queryKey: ['animals'] })
      const previous = client.getQueriesData({ queryKey: ['animals'] })
      const updated = (data: any) => {
        if (!data) return data
        // paged shape: { items: Animal[] }
        if (Array.isArray(data.items)) {
          return { ...data, items: data.items.map((a: Animal) => (a._id === id ? { ...a, ...payload } : a)) }
        }
        // single-list shape
        if (Array.isArray(data)) {
          return data.map((a: Animal) => (a._id === id ? { ...a, ...payload } : a))
        }
        return data
      }
      // update all cached queries that start with ['animals']
      client.getQueriesData({ queryKey: ['animals'] }).forEach(([qkey]) => {
        client.setQueryData(qkey as any, (old: any) => updated(old))
      })
      return { previous }
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) {
        context.previous.forEach(([qkey, data]: any) => client.setQueryData(qkey as any, data))
      }
    },
    onSettled: () => client.invalidateQueries({ queryKey: ['animals'] }),
  })
}

export const useUpdateOrderStatus = () => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string
      status?: string
      paymentStatus?: string
      deliveryStatus?: string
      note?: string
    }) => unwrap<Order>(http.patch(`/orders/${id}/status`, payload)),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['admin', 'orders'] })
      client.invalidateQueries({ queryKey: ['admin', 'overview'] })
      client.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}


export const useAdminMutations = (resource: 'coupons' | 'deliveryZones') => {
  const client = useQueryClient()
  const invalidate = () => client.invalidateQueries({ queryKey: ['admin', resource] })
  return {
    create: useMutation({
      mutationFn: (payload: Record<string, unknown>) => unwrap(http.post(`/admin/${resource}`, payload)),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        unwrap(http.patch(`/admin/${resource}/${id}`, payload)),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => unwrap(http.delete(`/admin/${resource}/${id}`)),
      onSuccess: invalidate,
    }),
  }
}
