import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui'
import { formatNaira } from '@/lib/format'
import { cartDeposit, cartSubtotal, useCartStore } from '@/store/cart'

export const CartPage = () => {
  const { lines, setQuantity, remove, clear } = useCartStore()
  const subtotal = cartSubtotal(lines)
  const deposit = cartDeposit(lines)

  if (!lines.length) {
    return (
      <div className="container-page py-20">
          <EmptyState
          icon={<ShoppingCart className="size-5" />}
          title="Your cart is empty"
          description="Browse the catalogue and add livestock to get started."
          action={<ButtonLink to="/animals">Browse livestock</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <div className="bg-ink-50 pb-20">
      <div className="container-page py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Your cart</h1>
        <p className="mt-2 text-ink-500">{lines.length} listing(s) reserved in your basket.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {lines.map((line) => (
              <article key={line.animalId} className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link to={`/animals/${line.slug}`} className="size-24 shrink-0 overflow-hidden rounded-2xl bg-ink-100">
                  {line.image ? <img src={line.image} alt={line.name} className="size-full object-cover" /> : null}
                </Link>

                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-600">{line.breed}</p>
                  <h2 className="mt-0.5 text-lg font-semibold">
                    <Link to={`/animals/${line.slug}`} className="hover:text-moss-600">
                      {line.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-base text-ink-500">{formatNaira(line.unitPrice)} each</p>
                </div>

                <div className="flex items-center gap-1 rounded-full border border-ink-200 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.animalId, line.quantity - 1)}
                    className="flex size-8 items-center justify-center rounded-full hover:bg-ink-50"
                    aria-label="Decrease"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-7 text-center text-base font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.animalId, line.quantity + 1)}
                    disabled={line.quantity >= line.maxQuantity}
                    className="flex size-8 items-center justify-center rounded-full hover:bg-ink-50 disabled:opacity-40"
                    aria-label="Increase"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="text-right sm:w-32">
                  <p className="font-semibold">{formatNaira(line.unitPrice * line.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      if (confirm(`Remove ${line.name} from your cart?`)) remove(line.animalId)
                    }}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              </article>
            ))}

            <Button
              variant="ghost"
              onClick={() => {
                // confirm destructive action
                // eslint-disable-next-line no-restricted-globals
                if (confirm('Clear your cart? This will remove all reserved items.')) clear()
              }}
              className="text-red-600 hover:bg-red-50"
            >
              Clear cart
            </Button>
          </div>

          <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-base">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-semibold">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Deposit option</dt>
                <dd className="font-semibold">{formatNaira(deposit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Delivery</dt>
                <dd className="text-ink-400">Calculated at checkout</dd>
              </div>
            </dl>
            <div className="mt-5 flex justify-between border-t border-ink-100 pt-4">
              <span className="font-semibold">Estimated total</span>
              <span className="font-display text-xl font-semibold">{formatNaira(subtotal)}</span>
            </div>
            <ButtonLink to="/checkout" className="mt-6 w-full" size="lg" icon={<ArrowRight className="size-4" />}>
              Proceed to checkout
            </ButtonLink>
            <p className="mt-3 text-center text-sm text-ink-400">Coupons and delivery zones are applied next.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}
