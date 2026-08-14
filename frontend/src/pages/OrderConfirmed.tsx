import { Check, CheckCircle2, Copy, MapPin, Package, ShoppingBag, Truck } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { Badge, ErrorState, Skeleton } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { formatDateTime, formatNaira, titleCase } from '@/lib/format'
import { useMyOrder } from '@/lib/queries'
import { toast } from '@/store/toast'

export const OrderConfirmedPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, error } = useMyOrder(id)
  const [copied, setCopied] = useState(false)

  return (
    <div className="bg-ink-50/60 pb-24">
      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header Card */}
          <div className="card-surface overflow-hidden p-8 sm:p-10 text-center shadow-lg border border-ink-100">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-moss-50 border border-moss-200/80 text-moss-700 shadow-xs">
              <CheckCircle2 className="size-9" />
            </div>
            <h1 className="mt-5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-950">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-base text-ink-600 max-w-lg mx-auto">
              Thank you for ordering with Sovereign Gold Livestock. Your livestock is being prepped for dispatch.
            </p>

            {isLoading ? (
              <Skeleton className="mt-8 h-48 w-full rounded-3xl" />
            ) : isError || !order ? (
              <div className="mt-8 text-left">
                <ErrorState message={errorMessage(error, 'We could not load this order right now.')} />
              </div>
            ) : (
              <div className="mt-8 space-y-6 text-left">
                {/* Order Details Highlight Banner */}
                <div className="rounded-3xl bg-linear-to-r from-ink-950 via-ink-900 to-moss-950 p-6 text-white shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Official Order Reference</p>
                      <div className="mt-1 flex items-center gap-2.5">
                        <p className="font-mono text-2xl font-extrabold tracking-wider text-white">
                          {order.orderNumber}
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(order.orderNumber)
                              setCopied(true)
                              toast.success('Order number copied to clipboard!')
                              setTimeout(() => setCopied(false), 2000)
                            } catch {
                              toast.info(`Order #: ${order.orderNumber}`)
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/25 active:scale-95"
                          aria-label="Copy order number"
                        >
                          {copied ? <Check className="size-3.5 text-gold-400" /> : <Copy className="size-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={order.paymentStatus === 'successful' ? 'success' : 'warning'}>
                        Payment {titleCase(order.paymentStatus)}
                      </Badge>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-200">
                        {titleCase(order.status)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-ink-300">
                    Placed on {formatDateTime(order.createdAt)} · Saved to your account
                  </p>
                </div>

                {/* Ordered Items List */}
                <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
                    <ShoppingBag className="size-4 text-gold-600" />
                    <h2 className="text-base font-bold text-ink-900">Ordered Livestock ({order.items.length})</h2>
                  </div>
                  <ul className="divide-y divide-ink-100 mt-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex items-center justify-between py-3.5 text-base">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-xl bg-gold-50 border border-gold-200 font-bold text-xs text-gold-800">
                            ×{item.quantity}
                          </span>
                          <div>
                            <span className="font-semibold text-ink-900 block">{item.name}</span>
                            <span className="text-xs text-ink-400">Unit: {formatNaira(item.unitPrice)}</span>
                          </div>
                        </div>
                        <span className="font-bold text-ink-900">{formatNaira(item.total)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Financial Breakdown */}
                  <div className="mt-4 border-t border-ink-100/80 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-ink-600">
                      <span>Livestock subtotal</span>
                      <span className="font-medium text-ink-800">{formatNaira(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink-600">
                      <span>Delivery fee</span>
                      <span className="font-medium text-ink-800">{formatNaira(order.deliveryFee)}</span>
                    </div>
                    {order.discount ? (
                      <div className="flex justify-between text-moss-700 font-medium">
                        <span>Promo discount applied</span>
                        <span>−{formatNaira(order.discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between border-t border-ink-200/80 pt-3 text-base font-bold text-ink-950">
                      <span>Total Amount</span>
                      <span className="text-xl font-display font-bold text-gold-700">{formatNaira(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Destination Card */}
                <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
                    <MapPin className="size-4 text-moss-700" />
                    <h2 className="text-base font-bold text-ink-900">Delivery Destination</h2>
                  </div>
                  <div className="mt-3 flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-moss-50 text-moss-700">
                      <Truck className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900">{order.deliveryAddress.fullName || 'Recipient'}</p>
                      <p className="text-sm text-ink-600 mt-0.5">
                        {order.deliveryAddress.addressLine}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                      </p>
                      <p className="text-xs text-ink-500 font-mono mt-1">📞 {order.deliveryAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-ink-100 pt-6">
              <ButtonLink to="/account/orders" size="md" icon={<Package className="size-4" />}>
                View My Orders
              </ButtonLink>
              <ButtonLink to="/animals" variant="outline" size="md">
                Browse More Livestock
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
