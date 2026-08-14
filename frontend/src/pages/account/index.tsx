import { Bell, CalendarClock, Check, Copy, Heart, MapPin, MessageSquare, Package, Plus, Save, Send, Truck } from 'lucide-react'

import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimalCard } from '@/components/AnimalCard'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Badge, EmptyState, ErrorState, Field, Input, Skeleton, Textarea } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { formatDateTime, formatNaira, timeUntil, titleCase } from '@/lib/format'

import {
  useAddAddress,
  useMarkNotificationRead,
  useMyConversations,
  useMyNotifications,
  useMyOrders,
  useMyReservations,
  useReplyConversation,
  useProfile,
  useUpdateProfile,
} from '@/lib/queries'
import { toast } from '@/store/toast'
import type { Animal } from '@/types'

const Panel = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="card-surface p-6 sm:p-7">
    <h2 className="text-lg font-semibold">{title}</h2>
    {description ? <p className="mt-1 text-base text-ink-500">{description}</p> : null}
    <div className="mt-6">{children}</div>
  </section>
)

export const ProfilePage = () => {
  const profile = useProfile()
  const update = useUpdateProfile()
  const orders = useMyOrders()
  const reservations = useMyReservations()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })

  useEffect(() => {
    if (profile.data) {
      setForm({
        firstName: profile.data.firstName,
        lastName: profile.data.lastName,
        phone: profile.data.phone ?? '',
      })
    }
  }, [profile.data])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await update.mutateAsync(form)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const stats = [
    { label: 'Orders', value: orders.data?.length ?? 0, icon: Package, to: '/account/orders' },
    { label: 'Reservations', value: reservations.data?.length ?? 0, icon: CalendarClock, to: '/account/reservations' },
    { label: 'Wishlist', value: profile.data?.wishlist?.length ?? 0, icon: Heart, to: '/account/wishlist' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} className="card-surface flex items-center gap-4 p-5 hover:shadow-elevated">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
              <stat.icon className="size-5" />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold">{stat.value}</span>
              <span className="block text-sm uppercase tracking-wide text-ink-400">{stat.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <Panel title="Personal details" description="Keep your contact information current so deliveries reach you.">
        {profile.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
            <Field label="First name">
              <Input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
            </Field>
            <Field label="Last name">
              <Input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </Field>
            <Field label="Email">
              <Input value={profile.data?.email ?? ''} disabled />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" loading={update.isPending} icon={<Save className="size-4" />}>
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Panel>
    </div>
  )
}


const ORDER_TONE = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  dispatched: 'info',
  delivered: 'success',
  cancelled: 'danger',
  reserved: 'warning',
} as const

export const OrdersPage = () => {
  const { data, isLoading, isError, error, refetch } = useMyOrders()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (isLoading) return <Skeleton className="h-56 w-full rounded-3xl" />
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={refetch} />
  if (!data?.length) {
    return (
      <EmptyState
        icon={<Package className="size-6" />}
        title="No orders yet"
        description="When you place an order it will appear here with live delivery status and receipts."
        action={<ButtonLink to="/animals">Browse livestock</ButtonLink>}
      />
    )
  }

  return (
    <div className="space-y-5">
      {data.map((order) => (
        <article key={order._id} className="card-surface overflow-hidden p-6 sm:p-7 shadow-xs border border-ink-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Order Reference</p>
              <div className="mt-0.5 flex items-center gap-2">
                <h3 className="font-mono text-lg font-bold text-ink-950">{order.orderNumber}</h3>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(order.orderNumber)
                      setCopiedId(order._id)
                      toast.success('Order number copied!')
                      setTimeout(() => setCopiedId(null), 2000)
                    } catch {
                      toast.info(`Order #: ${order.orderNumber}`)
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-2 py-0.5 text-xs font-medium text-ink-700 shadow-2xs transition hover:bg-ink-100"
                >
                  {copiedId === order._id ? <Check className="size-3 text-moss-600" /> : <Copy className="size-3" />}
                  <span>{copiedId === order._id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-ink-400">Placed on {formatDateTime(order.createdAt)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone={ORDER_TONE[order.status]}>{titleCase(order.status)}</Badge>
              <Badge tone={order.paymentStatus === 'successful' ? 'success' : 'warning'}>
                Payment {titleCase(order.paymentStatus)}
              </Badge>
              <Badge tone="neutral">{titleCase(order.deliveryStatus)}</Badge>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">Items Purchased</p>
            <ul className="divide-y divide-ink-100/70 text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between py-2">
                  <span className="font-medium text-ink-900">
                    {item.name} <span className="text-xs text-ink-400 font-normal">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-ink-900">{formatNaira(item.total)}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.deliveryAddress ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-ink-50 p-3.5 text-xs text-ink-600 border border-ink-100/60">
              <Truck className="size-4 shrink-0 text-ink-400 mt-0.5" />
              <div>
                <span className="font-semibold text-ink-900">Delivery to: </span>
                {order.deliveryAddress.addressLine}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                {order.deliveryFee ? <span className="text-ink-400 font-normal"> (Fee: {formatNaira(order.deliveryFee)})</span> : null}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
            <p className="text-sm text-ink-500">
              Deposit {formatNaira(order.depositDue)} · Balance {formatNaira(order.balanceDue)}
            </p>
            <div className="text-right">
              <span className="text-xs text-ink-400 uppercase tracking-wider font-semibold block">Total</span>
              <span className="font-display text-xl font-bold text-gold-700">{formatNaira(order.total)}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}


export const ReservationsPage = () => {
  const { data, isLoading, isError, error, refetch } = useMyReservations()

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={refetch} />
  if (!data?.length) {
    return (
      <EmptyState
        icon={<CalendarClock className="size-5" />}
        title="No active reservations"
        description="Reserve an animal to hold it for 48 hours while you arrange payment."
        action={<ButtonLink to="/animals">Find an animal</ButtonLink>}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.map((reservation) => {
        const animal = typeof reservation.animal === 'string' ? null : reservation.animal
        return (
          <article key={reservation._id} className="card-surface flex flex-wrap items-center gap-4 p-5">
            <div className="flex-1">
              <h3 className="font-semibold">{animal?.name ?? 'Reserved animal'}</h3>
              <p className="mt-1 text-base text-ink-500">
                Deposit {formatNaira(reservation.depositAmount)} · expires {timeUntil(reservation.expiresAt)}
              </p>
            </div>
            <Badge tone={reservation.status === 'active' ? 'success' : 'neutral'}>{titleCase(reservation.status)}</Badge>
            {animal ? (
              <ButtonLink to={`/animals/${animal.slug}`} variant="outline" size="sm">
                View animal
              </ButtonLink>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export const WishlistPage = () => {
  const profile = useProfile()
  const wishlist = (profile.data?.wishlist ?? []).filter((item): item is Animal => typeof item !== 'string')

  if (profile.isLoading) return <Skeleton className="h-56 w-full" />
  if (!wishlist.length) {
    return (
      <EmptyState
        icon={<Heart className="size-5" />}
        title="Your wishlist is empty"
        description="Tap the heart on any listing to save it here."
        action={<ButtonLink to="/animals">Browse livestock</ButtonLink>}
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {wishlist.map((animal) => (
        <AnimalCard key={animal._id} animal={animal} />
      ))}
    </div>
  )
}

export const AddressesPage = () => {
  const profile = useProfile()
  const addAddress = useAddAddress()
  const [form, setForm] = useState({ label: 'Home', addressLine: '', city: '', state: '', phone: '' })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await addAddress.mutateAsync(form)
      toast.success('Address saved')
      setForm({ label: 'Home', addressLine: '', city: '', state: '', phone: '' })
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Saved addresses" description="Used to pre-fill checkout.">
        {profile.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : profile.data?.addresses?.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {profile.data.addresses.map((address, index) => (
              <li key={index} className="rounded-2xl border border-ink-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{address.label}</p>
                  {address.isDefault ? <Badge tone="success">Default</Badge> : null}
                </div>
                <p className="mt-2 flex items-start gap-2 text-base text-ink-600">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  {address.addressLine}, {address.city}, {address.state}
                </p>
                {address.phone ? <p className="mt-1 text-base text-ink-400">{address.phone}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-ink-500">No saved addresses yet.</p>
        )}
      </Panel>

      <Panel title="Add an address">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <Field label="Label">
            <Input required value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          <Field label="Street address" className="sm:col-span-2">
            <Input
              required
              value={form.addressLine}
              onChange={(event) => setForm({ ...form, addressLine: event.target.value })}
            />
          </Field>
          <Field label="City">
            <Input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
          </Field>
          <Field label="State">
            <Input required value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" loading={addAddress.isPending} icon={<Plus className="size-4" />}>
              Save address
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  )
}

export const NotificationsPage = () => {
  const { data, isLoading, isError, error, refetch } = useMyNotifications()
  const conversations = useMyConversations()
  const markRead = useMarkNotificationRead()
  const reply = useReplyConversation()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const conversationById = new Map((conversations.data ?? []).map((conversation) => [conversation._id, conversation]))

  const submitReply = async (conversationId: string) => {
    const message = drafts[conversationId]?.trim()
    if (!message) return
    try {
      await reply.mutateAsync({ id: conversationId, message })
      toast.success('Reply sent')
      setDrafts((current) => ({ ...current, [conversationId]: '' }))
    } catch (replyError) {
      toast.error(errorMessage(replyError))
    }
  }

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={refetch} />
  if (!data?.length) {
    return (
      <EmptyState
        icon={<Bell className="size-5" />}
        title="No notifications"
        description="Order and delivery updates will show up here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {data.map((notification) => (
        (() => {
          const conversationId =
            typeof notification.metadata?.conversationId === 'string' ? notification.metadata.conversationId : undefined
          const conversation = conversationId ? conversationById.get(conversationId) : undefined
          return (
            <article
              key={notification._id}
              className={`card-surface p-5 ${notification.readAt ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  {conversation ? <MessageSquare className="size-4" /> : <Bell className="size-4" />}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-1 text-base text-ink-600">{notification.message}</p>
                  <p className="mt-2 text-sm text-ink-400">{formatDateTime(notification.createdAt)}</p>
                </div>
                {!notification.readAt ? (
                  <Button variant="ghost" size="sm" onClick={() => markRead.mutate(notification._id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>

              {conversation ? (
                <div className="mt-5 border-t border-ink-100 pt-5">
                  <div className="space-y-3">
                    {conversation.messages.map((item, index) => (
                      <div key={item._id ?? index} className="rounded-2xl bg-ink-50 p-4">
                        <p className="text-sm font-semibold text-ink-500">
                          {item.senderName} · {titleCase(item.senderRole)}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-base text-ink-700">{item.body}</p>
                        <p className="mt-2 text-xs text-ink-400">{formatDateTime(item.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                  <form
                    className="mt-4 grid gap-3"
                    onSubmit={(event) => {
                      event.preventDefault()
                      void submitReply(conversation._id)
                    }}
                  >
                    <Textarea
                      required
                      minLength={1}
                      value={drafts[conversation._id] ?? ''}
                      onChange={(event) =>
                        setDrafts((current) => ({ ...current, [conversation._id]: event.target.value }))
                      }
                      placeholder="Reply to the sales desk..."
                      className="min-h-24"
                    />
                    <div>
                      <Button type="submit" size="sm" loading={reply.isPending} icon={<Send className="size-4" />}>
                        Send reply
                      </Button>
                    </div>
                  </form>
                </div>
              ) : null}
            </article>
          )
        })()
      ))}
    </div>
  )
}
