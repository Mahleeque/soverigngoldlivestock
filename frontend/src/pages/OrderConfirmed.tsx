import { CheckCircle2, Package, Truck } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { Badge, ErrorState, Skeleton } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { formatDate, formatNaira, titleCase } from '@/lib/format'
import { useMyOrder } from '@/lib/queries'

export const OrderConfirmedPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, error } = useMyOrder(id)

  return (
    <div className="bg-ink-50 pb-20">
      <div className="container-page py-14">
        <div className="card-surface mx-auto max-w-3xl p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold">Order received</h1>
          <p className="mt-2 text-ink-500">
            Thank you — our sales desk is confirming availability and will contact you shortly.
          </p>

          {isLoading ? (
            <Skeleton className="mt-8 h-40 w-full" />
          ) : isError || !order ? (
            <div className="mt-8 text-left">
              <ErrorState message={errorMessage(error, 'We could not load this order right now.')} />
            </div>
          ) : (
            <div className="mt-8 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-50 px-5 py-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-ink-400">Order number</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone="info">{titleCase(order.status)}</Badge>
                  <Badge tone={order.paymentStatus === 'successful' ? 'success' : 'warning'}>
                    Payment {titleCase(order.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <ul className="mt-5 divide-y divide-ink-100">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-3 text-base">
                    <span>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-ink-400">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold">{formatNaira(item.total)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2 border-t border-ink-100 pt-5 text-base">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Delivery fee</dt>
                  <dd>{formatNaira(order.deliveryFee)}</dd>
                </div>
                {order.discount ? (
                  <div className="flex justify-between text-moss-600">
                    <dt>Discount</dt>
                    <dd>−{formatNaira(order.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatNaira(order.total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Deposit due</dt>
                  <dd>{formatNaira(order.depositDue)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Balance on delivery</dt>
                  <dd>{formatNaira(order.balanceDue)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-ink-100">
                <Truck className="mt-0.5 size-4 text-ink-400" />
                <p className="text-base text-ink-600">
                  Delivering to {order.deliveryAddress.addressLine}, {order.deliveryAddress.city},{' '}
                  {order.deliveryAddress.state}. Placed {formatDate(order.createdAt)}.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/account/orders" icon={<Package className="size-4" />}>
              View my orders
            </ButtonLink>
            <ButtonLink to="/animals" variant="outline">
              Continue shopping
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}
