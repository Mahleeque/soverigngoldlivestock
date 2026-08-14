import {
  Activity,
  Banknote,
  Beef,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Save,
  Send,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { Button } from '@/components/ui/Button'
import { Badge, ConfirmDialog, EmptyState, ErrorState, Field, Input, Select, Skeleton, Textarea } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { cleanName, formatDate, formatDateTime, formatNaira, titleCase } from '@/lib/format'
import { animalImage } from '@/lib/media'
import {
  useAdminConversations,
  useAdminMutations,
  useAdminResource,
  useAnimals,
  useCreateAnimal,
  useDashboardOverview,
  useDeleteAnimal,
  useSalesSummary,
  useReplyConversation,
  useUpdateAnimal,
  useUpdateOrderStatus,
} from '@/lib/queries'
import { toast } from '@/store/toast'
import type { Animal, Conversation, Coupon, DeliveryZone, Order } from '@/types'


const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: typeof Users
  hint?: string
}) => (
  <div className="card-surface p-5">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-400">{label}</span>
      <span className="flex size-9 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
        <Icon className="size-4" />
      </span>
    </div>
    <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
    {hint ? <p className="mt-1 text-sm text-ink-400">{hint}</p> : null}
  </div>
)

export const AdminDashboardPage = () => {
  const overview = useDashboardOverview()
  const sales = useSalesSummary()

  if (overview.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (overview.isError) return <ErrorState message={errorMessage(overview.error)} onRetry={overview.refetch} />

  const data = overview.data

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatNaira(data?.revenue ?? 0)} icon={Banknote} hint="Successful payments" />
        <StatCard label="Orders" value={data?.totalOrders ?? 0} icon={ShoppingCart} />
        <StatCard label="Customers" value={data?.totalUsers ?? 0} icon={Users} />
        <StatCard
          label="Livestock"
          value={data?.totalAnimals ?? 0}
          icon={Beef}
          hint={`${data?.availableAnimals ?? 0} available now`}
        />
        <StatCard label="Payments" value={data?.totalPayments ?? 0} icon={Activity} />
        <StatCard label="WhatsApp orders" value={data?.whatsappOrders ?? 0} icon={MessageCircle} />
        <StatCard
          label="Pending orders"
          value={sales.data?.pendingOrders ?? 0}
          icon={Package}
          hint="Awaiting confirmation"
        />
        <StatCard
          label="Avg. order value"
          value={
            sales.data && sales.data.totalOrders
              ? formatNaira(Math.round(sales.data.totalRevenue / sales.data.totalOrders))
              : '—'
          }
          icon={LayoutDashboard}
          hint={sales.data ? `${formatNaira(sales.data.totalRevenue)} booked` : undefined}
        />
      </div>

      <section className="card-surface p-6">
        <h2 className="text-lg font-semibold">Inventory health</h2>
        <p className="mt-1 text-base text-ink-500">Share of listed livestock currently available to buy.</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-moss-500"
            style={{
              width: `${data?.totalAnimals ? ((data.availableAnimals / data.totalAnimals) * 100).toFixed(0) : 0}%`,
            }}
          />
        </div>
        <p className="mt-2 text-base text-ink-500">
          {data?.availableAnimals ?? 0} of {data?.totalAnimals ?? 0} animals available
        </p>
      </section>
    </div>
  )
}

export const AdminOrdersPage = () => {
  const { data: orders, isLoading, isError, error, refetch } = useAdminResource<Order>('orders')
  const updateStatus = useUpdateOrderStatus()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus })
      toast.success(`Order status updated to ${titleCase(newStatus)}`)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to update order status'))
    } finally {
      setUpdatingId(null)
    }
  }

  const allOrders = orders ?? []

  const filteredOrders = allOrders.filter((order) => {
    const customer = typeof order.customer === 'object' && order.customer !== null ? (order.customer as any) : null
    const customerName = order.deliveryAddress?.fullName || `${customer?.firstName || ''} ${customer?.lastName || ''}`
    const matchesSearch =
      !search.trim() ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (order.deliveryAddress?.phone || '').includes(search) ||
      (order.deliveryAddress?.state || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={refetch} />

  const STATUS_TONES: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    processing: 'info',
    dispatched: 'info',
    delivered: 'success',
    cancelled: 'danger',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Customer Orders</h2>
          <p className="text-sm text-ink-500">
            View, track and update dispatch statuses for live livestock purchases.
          </p>
        </div>
      </div>

      <div className="card-surface p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Search by order #, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
            <option value="all">All Payment Statuses</option>
            <option value="successful">Paid / Successful</option>
            <option value="pending">Payment Pending</option>
            <option value="failed">Payment Failed</option>
          </Select>
        </div>
      </div>

      {!filteredOrders.length ? (
        <EmptyState
          icon={<Package className="size-6" />}
          title="No orders found"
          description={
            allOrders.length
              ? 'Try clearing your filters or search query.'
              : 'Customer orders placed on the website will appear here in real time.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customer = typeof order.customer === 'object' && order.customer !== null ? (order.customer as any) : null
            const customerName =
              order.deliveryAddress?.fullName ||
              `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() ||
              'Valued Customer'
            const phone = order.deliveryAddress?.phone || customer?.phone || '—'

            return (
              <article
                key={order._id}
                className="card-surface overflow-hidden p-5 sm:p-6 transition hover:shadow-elevated"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-bold text-ink-950">{order.orderNumber}</span>
                      <Badge tone={STATUS_TONES[order.status] ?? 'neutral'}>{titleCase(order.status)}</Badge>
                      <Badge tone={order.paymentStatus === 'successful' ? 'success' : 'warning'}>
                        {order.paymentStatus === 'successful' ? 'Paid' : titleCase(order.paymentStatus)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-400">Placed on {formatDateTime(order.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink-500">Update Status:</span>
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 shadow-xs focus:border-moss-600 focus:ring-1 focus:ring-moss-600 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Customer Details</p>
                    <p className="font-bold text-ink-900">{customerName}</p>
                    <p className="text-ink-600">📞 {phone}</p>
                    {customer?.email ? <p className="text-xs text-ink-500">✉️ {customer.email}</p> : null}
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Delivery Address</p>
                    <p className="text-ink-800">
                      {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                    </p>
                    <p className="text-xs text-ink-500">Delivery Fee: {formatNaira(order.deliveryFee)}</p>
                  </div>

                  <div className="space-y-1 text-sm rounded-2xl bg-ink-50/80 p-3.5 border border-ink-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Financial Summary</p>
                    <div className="flex justify-between font-medium text-ink-700">
                      <span>Subtotal:</span>
                      <span>{formatNaira(order.subtotal)}</span>
                    </div>
                    {order.discount ? (
                      <div className="flex justify-between text-xs text-moss-700">
                        <span>Discount:</span>
                        <span>-{formatNaira(order.discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-bold text-ink-950 pt-1.5 border-t border-ink-200/60">
                      <span>Total:</span>
                      <span className="text-base font-bold text-gold-700">{formatNaira(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-ink-100 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Ordered Livestock</p>
                  <ul className="divide-y divide-ink-100/60 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between py-1.5">
                        <span className="font-medium text-ink-800">
                          {item.name} <span className="text-xs font-normal text-ink-400">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-ink-900">{formatNaira(item.total)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}


export const AdminMessagesPage = () => {
  const { data, isLoading, isError, error, refetch } = useAdminConversations()
  const reply = useReplyConversation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const conversations = data ?? []
  const selected = conversations.find((conversation) => conversation._id === selectedId) ?? conversations[0]

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected || !message.trim()) return
    try {
      await reply.mutateAsync({ id: selected._id, message: message.trim() })
      toast.success('Reply sent to client notifications')
      setMessage('')
    } catch (replyError) {
      toast.error(errorMessage(replyError))
    }
  }

  if (isLoading) return <Skeleton className="h-72 w-full" />
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={refetch} />
  if (!conversations.length) {
    return (
      <EmptyState
        icon={<MessageSquare className="size-5" />}
        title="No client messages"
        description="New contact form submissions will appear here for admin and sales replies."
      />
    )
  }

  const latestMessage = (conversation: Conversation) => conversation.messages.at(-1)?.body ?? ''

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <section className="card-surface overflow-hidden">
        <div className="border-b border-ink-100 p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="size-4 text-ink-400" /> Client messages
          </h2>
        </div>
        <div className="max-h-[38rem] overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation._id}
              type="button"
              onClick={() => setSelectedId(conversation._id)}
              className={`block w-full border-b border-ink-100 p-4 text-left transition hover:bg-ink-50 ${
                selected?._id === conversation._id ? 'bg-gold-50' : ''
              }`}
            >
              <span className="block font-semibold">{conversation.name}</span>
              <span className="mt-1 block text-sm uppercase tracking-wide text-ink-400">{conversation.topic}</span>
              <span className="mt-2 line-clamp-2 block text-base text-ink-500">{latestMessage(conversation)}</span>
            </button>
          ))}
        </div>
      </section>

      {selected ? (
        <section className="card-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-5">
            <div>
              <h2 className="text-xl font-semibold">{selected.topic}</h2>
              <p className="mt-1 text-base text-ink-500">
                {selected.name} · {selected.email} · {selected.phone}
              </p>
            </div>
            <Badge tone="info">{titleCase(selected.status)}</Badge>
          </div>

          <div className="mt-5 max-h-[28rem] space-y-4 overflow-y-auto pr-1">
            {selected.messages.map((item, index) => {
              const fromStaff = item.senderRole === 'admin' || item.senderRole === 'sales'
              return (
                <div key={item._id ?? index} className={`flex ${fromStaff ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${fromStaff ? 'bg-ink-900 text-white' : 'bg-ink-50'}`}>
                    <p className={`text-sm font-semibold ${fromStaff ? 'text-gold-200' : 'text-ink-500'}`}>
                      {item.senderName} · {titleCase(item.senderRole)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-base">{item.body}</p>
                    <p className={`mt-2 text-xs ${fromStaff ? 'text-ink-300' : 'text-ink-400'}`}>
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <form className="mt-6 grid gap-3" onSubmit={submit}>
            <Textarea
              required
              minLength={1}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Reply to the client..."
              className="min-h-28"
            />
            <div>
              <Button type="submit" loading={reply.isPending} icon={<Send className="size-4" />}>
                Send reply
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}

const EMPTY_ANIMAL = {
  name: '',
  category: 'ram',
  breed: '',
  description: '',
  price: '',
  depositAmount: '',
  weightKg: '',
  ageMonths: '',
  gender: 'male',
  size: 'medium',
  healthStatus: 'Healthy — vet checked',
  vaccinationStatus: 'Fully vaccinated',
  quantity: '1',
  status: 'available',
  featured: false,
  images: '',
  tags: '',
}

type AnimalForm = typeof EMPTY_ANIMAL

const toForm = (animal: Animal): AnimalForm => ({
  name: animal.name,
  category: animal.category,
  breed: animal.breed,
  description: animal.description,
  price: String(animal.price),
  depositAmount: String(animal.depositAmount ?? ''),
  weightKg: String(animal.weightKg),
  ageMonths: String(animal.ageMonths),
  gender: animal.gender,
  size: animal.size,
  healthStatus: animal.healthStatus,
  vaccinationStatus: animal.vaccinationStatus,
  quantity: String(animal.quantity),
  status: animal.status,
  featured: animal.featured,
  images: (animal.images ?? []).join(', '),
  tags: (animal.tags ?? []).join(', '),
})

const toPayload = (form: AnimalForm): Partial<Animal> => ({
  name: form.name.trim(),
  category: form.category as Animal['category'],
  breed: form.breed.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  depositAmount: form.depositAmount ? Number(form.depositAmount) : Math.round(Number(form.price) * 0.3),
  weightKg: Number(form.weightKg),
  ageMonths: Number(form.ageMonths),
  gender: form.gender as Animal['gender'],
  size: form.size as Animal['size'],
  healthStatus: form.healthStatus.trim(),
  vaccinationStatus: form.vaccinationStatus.trim(),
  quantity: Number(form.quantity),
  status: form.status as Animal['status'],
  featured: form.featured,
  images: form.images
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  tags: form.tags
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
})

const AnimalDialog = ({
  animal,
  onClose,
}: {
  animal: Animal | null
  onClose: () => void
}) => {
  const [form, setForm] = useState<AnimalForm>(animal ? toForm(animal) : EMPTY_ANIMAL)
  const createAnimal = useCreateAnimal()
  const updateAnimal = useUpdateAnimal()
  const saving = createAnimal.isPending || updateAnimal.isPending

  const set = (patch: Partial<AnimalForm>) => setForm((current) => ({ ...current, ...patch }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (animal) {
        await updateAnimal.mutateAsync({ id: animal._id, payload: toPayload(form) })
        toast.success(`${form.name} updated`)
      } else {
        await createAnimal.mutateAsync(toPayload(form))
        toast.success(`${form.name} added to the farm`)
      }
      onClose()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:p-8">
      <div className="animate-zoom-in my-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-elevated sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {animal ? `Edit ${animal.name}` : 'Add a new animal'}
            </h2>
            <p className="mt-1 text-ink-500">Everything buyers see on the listing page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-ink-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
          <Field label="Name">
            <Input required value={form.name} onChange={(event) => set({ name: event.target.value })} />
          </Field>
          <Field label="Breed">
            <Input required value={form.breed} onChange={(event) => set({ breed: event.target.value })} />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(event) => set({ category: event.target.value })}>
              {['ram', 'goat', 'cow', 'pig', 'chicken', 'layer'].map((option) => (
                <option key={option} value={option}>
                  {titleCase(option)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(event) => set({ status: event.target.value })}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold out</option>
              <option value="unavailable">Unavailable</option>
            </Select>
          </Field>
          <Field label="Price (₦)">
            <Input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => set({ price: event.target.value })}
            />
          </Field>
          <Field label="Reservation deposit (₦)" hint="Left blank we use 30% of the price.">
            <Input
              type="number"
              min={0}
              value={form.depositAmount}
              onChange={(event) => set({ depositAmount: event.target.value })}
            />
          </Field>
          <Field label="Weight (kg)">
            <Input
              required
              type="number"
              min={0}
              step="0.1"
              value={form.weightKg}
              onChange={(event) => set({ weightKg: event.target.value })}
            />
          </Field>
          <Field label="Age (months)">
            <Input
              required
              type="number"
              min={0}
              value={form.ageMonths}
              onChange={(event) => set({ ageMonths: event.target.value })}
            />
          </Field>
          <Field label="Gender">
            <Select value={form.gender} onChange={(event) => set({ gender: event.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </Field>
          <Field label="Size">
            <Select value={form.size} onChange={(event) => set({ size: event.target.value })}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </Field>
          <Field label="Quantity in stock">
            <Input
              required
              type="number"
              min={0}
              value={form.quantity}
              onChange={(event) => set({ quantity: event.target.value })}
            />
          </Field>
          <Field label="Health status">
            <Input
              required
              value={form.healthStatus}
              onChange={(event) => set({ healthStatus: event.target.value })}
            />
          </Field>
          <Field label="Vaccination status">
            <Input
              required
              value={form.vaccinationStatus}
              onChange={(event) => set({ vaccinationStatus: event.target.value })}
            />
          </Field>
          <Field label="Tags" hint="Comma separated, e.g. sallah, yankasa">
            <Input value={form.tags} onChange={(event) => set({ tags: event.target.value })} />
          </Field>
          <Field label="Image URLs" hint="Comma separated. Leave blank to use farm artwork." className="sm:col-span-2">
            <Input value={form.images} onChange={(event) => set({ images: event.target.value })} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              required
              minLength={10}
              value={form.description}
              onChange={(event) => set({ description: event.target.value })}
            />
          </Field>

          <label className="flex items-center gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => set({ featured: event.target.checked })}
              className="size-5 rounded border-ink-300 text-moss-600 focus:ring-moss-500"
            />
            <span className="font-medium text-ink-700">Feature this animal on the homepage</span>
          </label>

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" size="lg" loading={saving} icon={<Save className="size-4" />}>
              {animal ? 'Save changes' : 'Add animal'}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const AdminInventoryPage = () => {
  const { data, isLoading, isError, error, refetch } = useAnimals({ limit: 100, status: '' })
  const updateAnimal = useUpdateAnimal()
  const deleteAnimal = useDeleteAnimal()
  const [dialog, setDialog] = useState<{ open: boolean; animal: Animal | null }>({ open: false, animal: null })
  const [search, setSearch] = useState('')

  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const setStatus = async (id: string, status: string) => {
    try {
      await updateAnimal.mutateAsync({ id, payload: { status: status as Animal['status'] } })
      toast.success('Inventory updated')
    } catch (updateError) {
      toast.error(errorMessage(updateError))
    }
  }

  const handleConfirmDelete = async () => {
    if (!animalToDelete) return
    setDeleteLoading(true)
    try {
      await deleteAnimal.mutateAsync(animalToDelete._id)
      toast.success(`${animalToDelete.name} removed from farm listings`)
      setAnimalToDelete(null)
    } catch (deleteError) {
      toast.error(errorMessage(deleteError))
    } finally {
      setDeleteLoading(false)
    }
  }

  const items = (data?.items ?? []).filter((animal) =>
    search
      ? `${animal.name} ${animal.breed} ${animal.sku}`.toLowerCase().includes(search.toLowerCase())
      : true,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search livestock…"
          className="max-w-xs"
        />
        <Button size="lg" onClick={() => setDialog({ open: true, animal: null })} icon={<Plus className="size-4" />}>
          Add animal
        </Button>
      </div>

      {isLoading ? <Skeleton className="h-72 w-full" /> : null}
      {isError ? <ErrorState message={errorMessage(error)} onRetry={refetch} /> : null}

      {!isLoading && !isError ? (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ink-50 text-sm uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">Animal</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Qty</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 text-[0.95rem]">
                {items.map((animal) => (
                  <tr key={animal._id} className="transition hover:bg-ink-50/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={animalImage(animal)} alt="" className="size-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold">{cleanName(animal.name)}</p>
                          <p className="text-sm text-ink-400">
                            {animal.sku} · {animal.breed}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{titleCase(animal.category)}</td>
                    <td className="px-5 py-4 font-semibold">{formatNaira(animal.price)}</td>
                    <td className="px-5 py-4">{animal.quantity}</td>
                    <td className="px-5 py-4">
                      <Select
                        value={animal.status}
                        onChange={(event) => setStatus(animal._id, event.target.value)}
                        className="h-10 w-40 py-0 text-base"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold out</option>
                        <option value="unavailable">Unavailable</option>
                      </Select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDialog({ open: true, animal })}
                          icon={<Pencil className="size-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setAnimalToDelete(animal)}
                          icon={<Trash2 className="size-3.5" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!items.length ? (
            <div className="p-8">
              <EmptyState
                title="No livestock listed"
                description="Add your first animal to start selling."
                action={
                  <Button onClick={() => setDialog({ open: true, animal: null })} icon={<Plus className="size-4" />}>
                    Add animal
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {dialog.open ? (
        <AnimalDialog animal={dialog.animal} onClose={() => setDialog({ open: false, animal: null })} />
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(animalToDelete)}
        onClose={() => setAnimalToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Livestock Listing"
        description="Are you sure you want to remove this animal from the catalog? It will no longer be visible or purchasable by customers."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
        itemSummary={
          animalToDelete
            ? {
                label: 'Livestock Item',
                value: `${animalToDelete.name} (${animalToDelete.sku}) — ${formatNaira(animalToDelete.price)}`,
              }
            : undefined
        }
      />
    </div>
  )
}

export const AdminCouponsPage = () => {
  const coupons = useAdminResource<Coupon>('coupons')
  const { create, update, remove } = useAdminMutations('coupons')
  const [dialog, setDialog] = useState<{ open: boolean; coupon: Coupon | null }>({ open: false, coupon: null })
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  type CouponForm = {
    code: string
    type: 'percentage' | 'fixed'
    value: string
    minOrderAmount: string
    maxDiscountAmount: string
    expiresAt: string
    active: boolean
  }

  const EMPTY_COUPON: CouponForm = {
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    expiresAt: '',
    active: true,
  }

  const CouponDialog = ({ coupon, onClose }: { coupon: Coupon | null; onClose: () => void }) => {
    const [form, setForm] = useState<CouponForm>(
      coupon
        ? {
            code: coupon.code,
            type: (coupon.type as 'percentage' | 'fixed') || 'percentage',
            value: String(coupon.value ?? ''),
            minOrderAmount: String(coupon.minOrderAmount ?? ''),
            maxDiscountAmount: String(coupon.maxDiscountAmount ?? ''),
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
            active: Boolean(coupon.active),
          }
        : EMPTY_COUPON,
    )

    const saving = create.isPending || update.isPending

    const submit = async (event: FormEvent) => {
      event.preventDefault()
      try {
        const payload = {
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: Number(form.value) || 0,
          minOrderAmount: Number(form.minOrderAmount) || 0,
          maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
          active: Boolean(form.active),
        }
        if (coupon) {
          await update.mutateAsync({ id: coupon._id, payload })
          toast.success(`Coupon ${payload.code} updated`)
        } else {
          await create.mutateAsync(payload)
          toast.success(`Coupon ${payload.code} created`)
        }
        onClose()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-xs sm:p-8">
        <div className="animate-zoom-in my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-elevated sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">{coupon ? `Edit Coupon: ${coupon.code}` : 'Create New Coupon'}</h2>
              <p className="mt-1 text-ink-500">Set discount rules, minimum purchase requirements, and expiration dates.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-ink-700"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Coupon code">
                <Input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SALLAH10"
                />
              </Field>
              <Field label="Discount type">
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={form.type === 'percentage' ? 'Discount Value (%)' : 'Discount Value (₦)'}>
                <Input
                  required
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === 'percentage' ? '10' : '5000'}
                />
              </Field>
              <Field label="Minimum Order Amount (₦)">
                <Input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="0"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Max Discount Cap (₦ optional)">
                <Input
                  type="number"
                  value={form.maxDiscountAmount}
                  onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                  placeholder="e.g. 50000"
                />
              </Field>
              <Field label="Expiration Date">
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="size-5 rounded border-ink-300 text-moss-600 focus:ring-moss-500"
              />
              <div>
                <span className="font-medium text-ink-800">Coupon Active</span>
                <p className="text-xs text-ink-500">When active, clients can apply this code at checkout.</p>
              </div>
            </label>

            <div className="mt-2 flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {coupon ? 'Save Changes' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return
    setDeleteLoading(true)
    try {
      await remove.mutateAsync(couponToDelete._id)
      toast.success(`Coupon ${couponToDelete.code} deleted`)
      setCouponToDelete(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <section className="card-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Discount coupons</h2>
          <p className="text-sm text-ink-500">Manage promo codes, percentages, flat discounts, and expiration dates.</p>
        </div>
        <Button size="sm" icon={<Plus className="size-4" />} onClick={() => setDialog({ open: true, coupon: null })}>
          Add coupon
        </Button>
      </div>

      {coupons.isLoading ? (
        <Skeleton className="mt-5 h-24 w-full" />
      ) : coupons.data?.length ? (
        <ul className="mt-5 divide-y divide-ink-100">
          {coupons.data.map((coupon) => (
            <li key={coupon._id} className="flex flex-wrap items-center justify-between gap-3 py-4 transition hover:bg-ink-50/40 rounded-xl px-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-ink-950">{coupon.code}</span>
                  <Badge tone={coupon.active ? 'success' : 'neutral'}>{coupon.active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {coupon.type === 'percentage' ? `${coupon.value}% off` : `${formatNaira(coupon.value)} off`}
                  {coupon.minOrderAmount ? ` · Min order: ${formatNaira(coupon.minOrderAmount)}` : ' · No minimum'}
                  {coupon.maxDiscountAmount ? ` · Cap: ${formatNaira(coupon.maxDiscountAmount)}` : ''}
                  {coupon.expiresAt ? ` · Expires: ${formatDate(coupon.expiresAt)}` : ' · No expiry'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDialog({ open: true, coupon })}
                  icon={<Pencil className="size-3.5" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ink-500 hover:text-red-700"
                  onClick={() => setCouponToDelete(coupon)}
                  icon={<Trash2 className="size-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-base text-ink-500">No coupons configured yet. Click &ldquo;Add coupon&rdquo; to create one.</p>
      )}

      {dialog.open ? <CouponDialog coupon={dialog.coupon} onClose={() => setDialog({ open: false, coupon: null })} /> : null}

      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Promo Coupon"
        description="Are you sure you want to delete this coupon code? Customers will no longer be able to apply it at checkout."
        confirmText="Delete Coupon"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
        itemSummary={
          couponToDelete
            ? {
                label: 'Coupon Code',
                value: `${couponToDelete.code} (${couponToDelete.type === 'percentage' ? `${couponToDelete.value}% off` : `${formatNaira(couponToDelete.value)} off`})`,
              }
            : undefined
        }
      />
    </section>
  )
}


export const AdminDeliveryPage = () => {
  const zones = useAdminResource<DeliveryZone>('deliveryZones')
  const { create, update, remove } = useAdminMutations('deliveryZones')
  const [dialog, setDialog] = useState<{ open: boolean; zone: DeliveryZone | null }>({ open: false, zone: null })
  const [zoneToDelete, setZoneToDelete] = useState<DeliveryZone | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  type ZoneForm = {
    name: string
    states: string
    baseFee: string
    estimatedDaysMin: string
    estimatedDaysMax: string
    active: boolean
  }

  const EMPTY_ZONE: ZoneForm = {
    name: '',
    states: '',
    baseFee: '',
    estimatedDaysMin: '1',
    estimatedDaysMax: '3',
    active: true,
  }

  const ZoneDialog = ({ zone, onClose }: { zone: DeliveryZone | null; onClose: () => void }) => {
    const [form, setForm] = useState<ZoneForm>(
      zone
        ? {
            name: zone.name,
            states: (zone.states ?? []).join(', '),
            baseFee: String(zone.baseFee ?? ''),
            estimatedDaysMin: String(zone.estimatedDaysMin ?? '1'),
            estimatedDaysMax: String(zone.estimatedDaysMax ?? '3'),
            active: Boolean(zone.active),
          }
        : EMPTY_ZONE,
    )

    const saving = create.isPending || update.isPending

    const submit = async (event: FormEvent) => {
      event.preventDefault()
      try {
        const payload = {
          name: form.name.trim(),
          states: form.states.split(',').map((s) => s.trim()).filter(Boolean),
          baseFee: Number(form.baseFee) || 0,
          estimatedDaysMin: Number(form.estimatedDaysMin) || 1,
          estimatedDaysMax: Number(form.estimatedDaysMax) || 1,
          active: Boolean(form.active),
        }
        if (zone) {
          await update.mutateAsync({ id: zone._id, payload })
          toast.success('Delivery zone updated')
        } else {
          await create.mutateAsync(payload)
          toast.success('Delivery zone created')
        }
        onClose()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:p-8">
        <div className="animate-zoom-in my-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-elevated sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">{zone ? `Edit ${zone.name}` : 'Add delivery zone'}</h2>
              <p className="mt-1 text-ink-500">Zones are used to determine delivery fees by state.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-ink-700"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <Field label="Name">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="States" hint="Comma separated, e.g. Lagos, Ogun">
              <Input required value={form.states} onChange={(e) => setForm({ ...form, states: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Base fee (₦)">
                <Input required type="number" value={form.baseFee} onChange={(e) => setForm({ ...form, baseFee: e.target.value })} />
              </Field>
              <Field label="Est. days min">
                <Input required type="number" value={form.estimatedDaysMin} onChange={(e) => setForm({ ...form, estimatedDaysMin: e.target.value })} />
              </Field>
              <Field label="Est. days max">
                <Input required type="number" value={form.estimatedDaysMax} onChange={(e) => setForm({ ...form, estimatedDaysMax: e.target.value })} />
              </Field>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-5 rounded border-ink-300 text-moss-600" />
              <span className="font-medium text-ink-700">Active</span>
            </label>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" loading={saving}>{zone ? 'Save' : 'Create'}</Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const handleConfirmRemoveZone = async () => {
    if (!zoneToDelete) return
    setDeleteLoading(true)
    try {
      await remove.mutateAsync(zoneToDelete._id)
      toast.success(`Delivery zone “${zoneToDelete.name}” deleted`)
      setZoneToDelete(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <section className="card-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Delivery zones</h2>
        <Button size="sm" icon={<Plus className="size-4" />} onClick={() => setDialog({ open: true, zone: null })}>
          Add zone
        </Button>
      </div>

      {zones.isLoading ? (
        <Skeleton className="mt-5 h-24 w-full" />
      ) : zones.data?.length ? (
        <ul className="mt-5 divide-y divide-ink-100">
          {zones.data.map((zone) => (
            <li key={zone._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{zone.name}</p>
                <p className="text-base text-ink-500">{zone.states.join(', ')} · {zone.estimatedDaysMin}–{zone.estimatedDaysMax} days</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatNaira(zone.baseFee)}</span>
                <Badge tone={zone.active ? 'success' : 'neutral'}>{zone.active ? 'Active' : 'Inactive'}</Badge>
                <Button size="sm" variant="outline" onClick={() => setDialog({ open: true, zone })} icon={<Pencil className="size-3.5" />}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setZoneToDelete(zone)} icon={<Trash2 className="size-3.5" />}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-base text-ink-500">No delivery zones configured.</p>
      )}

      {dialog.open ? <ZoneDialog zone={dialog.zone} onClose={() => setDialog({ open: false, zone: null })} /> : null}

      <ConfirmDialog
        isOpen={Boolean(zoneToDelete)}
        onClose={() => setZoneToDelete(null)}
        onConfirm={handleConfirmRemoveZone}
        title="Delete Delivery Zone"
        description="Are you sure you want to delete this delivery zone? Shipping rates will need to be reconfigured for covered states."
        confirmText="Yes, Delete Zone"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
        itemSummary={
          zoneToDelete
            ? {
                label: 'Zone Name',
                value: `${zoneToDelete.name} (${zoneToDelete.states.join(', ')})`,
              }
            : undefined
        }
      />
    </section>
  )
}

export const AdminSecurityPage = () => (
  <section className="card-surface max-w-2xl p-6 sm:p-8">
    <h2 className="text-xl font-semibold">Change your password</h2>
    <p className="mt-2 text-ink-500">
      Staff accounts hold sensitive customer data — rotate your password regularly.
    </p>
    <div className="mt-7">
      <ChangePasswordForm />
    </div>
  </section>
)
