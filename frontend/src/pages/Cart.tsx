import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ConfirmDialog, EmptyState } from '@/components/ui'
import { formatNaira } from '@/lib/format'
import { cartDeposit, cartSubtotal, useCartStore, type CartLine } from '@/store/cart'

export const CartPage = () => {
  const { lines, setQuantity, remove, clear } = useCartStore()
  const subtotal = cartSubtotal(lines)
  const deposit = cartDeposit(lines)

  const [itemToRemove, setItemToRemove] = useState<CartLine | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

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
                    className="flex size-8 items-center justify-center rounded-full hover:bg-ink-50"
                    aria-label="Increase"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="text-right sm:w-32">
                  <p className="font-semibold">{formatNaira(line.unitPrice * line.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => setItemToRemove(line)}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              </article>
            ))}

            <Button
              variant="ghost"
              onClick={() => setShowClearConfirm(true)}
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
            </dl>

            <div className="mt-6 flex items-end justify-between border-t border-ink-100 pt-4">
              <span className="font-semibold">Estimated total</span>
              <span className="font-display text-2xl font-semibold">{formatNaira(subtotal)}</span>
            </div>

            <ButtonLink to="/checkout" size="lg" className="mt-6 w-full" icon={<ArrowRight className="size-4" />}>
              Proceed to checkout
            </ButtonLink>
          </aside>
        </div>
      </div>

      {/* Remove Single Item Modal */}
      <ConfirmDialog
        isOpen={Boolean(itemToRemove)}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            remove(itemToRemove.animalId)
            setItemToRemove(null)
          }
        }}
        title="Remove Item from Cart"
        description="Are you sure you want to remove this livestock item from your shopping cart?"
        confirmText="Yes, Remove"
        cancelText="Keep Item"
        variant="danger"
        itemSummary={
          itemToRemove
            ? {
                label: 'Item to remove',
                value: `${itemToRemove.name} (Qty ${itemToRemove.quantity}) — ${formatNaira(itemToRemove.unitPrice * itemToRemove.quantity)}`,
              }
            : undefined
        }
      />

      {/* Clear Entire Cart Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clear()
          setShowClearConfirm(false)
        }}
        title="Clear Entire Cart"
        description="Are you sure you want to empty your shopping cart? All reserved livestock items will be removed."
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
