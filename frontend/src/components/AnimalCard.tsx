import clsx from 'clsx'
import { Heart, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatAge, formatNaira, titleCase, cleanName } from '@/lib/format'
import { animalImage } from '@/lib/media'
import { useCartStore } from '@/store/cart'
import { toast } from '@/store/toast'
import type { Animal } from '@/types'

export const AnimalCard = ({
  animal,
  onWishlist,
  wished = false,
}: {
  animal: Animal
  onWishlist?: (animal: Animal) => void
  wished?: boolean
}) => {
  const add = useCartStore((state) => state.add)
  const sellable = animal.status === 'available' && animal.quantity > 0
  const displayName = cleanName(animal.name)
  const handleAdd = () => {
    add({
      animalId: animal._id,
      slug: animal.slug,
      name: displayName,
      category: animal.category,
      breed: animal.breed,
      unitPrice: animal.price,
      depositAmount: animal.depositAmount,
      image: animalImage(animal),
      maxQuantity: Math.max(animal.quantity, 1),
    })
    toast.success(`${displayName} added to cart`)
  }

  return (
    <article className="group card-surface flex flex-col h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <Link to={`/animals/${animal.slug}`} className="relative block aspect-4/3 overflow-hidden bg-ink-100">
        <img
          src={animalImage(animal)}
          alt={displayName}
          loading="lazy"
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        {!sellable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-4">
            <span className="rounded-full bg-red-500/95 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              Sold out
            </span>
          </div>
        ) : null}
        <div className="absolute inset-x-0 top-0 flex items-start justify-end p-3">
          {onWishlist ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                onWishlist(animal)
              }}
              className="flex size-9 items-center justify-center rounded-full bg-white/90 text-ink-600 backdrop-blur transition hover:bg-white"
              aria-label="Toggle wishlist"
            >
              <Heart className={clsx('size-4', wished && 'fill-red-500 text-red-500')} />
            </button>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-gold-600 truncate">
            {titleCase(animal.category)} · {animal.breed}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug line-clamp-2 h-11">
            <Link to={`/animals/${animal.slug}`} className="hover:text-moss-600">
              {displayName}
            </Link>
          </h3>

          <dl className="mt-3 grid grid-cols-3 divide-x divide-ink-200/80 rounded-2xl bg-ink-50 px-2 py-2.5 text-center text-xs">
            <div className="px-1">
              <dt className="text-ink-400 font-medium">Weight</dt>
              <dd className="mt-0.5 font-bold text-ink-800 text-[0.85rem]">{animal.weightKg}kg</dd>
            </div>
            <div className="px-1">
              <dt className="text-ink-400 font-medium">Age</dt>
              <dd className="mt-0.5 font-bold text-ink-800 text-[0.85rem]">{formatAge(animal.ageMonths)}</dd>
            </div>
            <div className="px-1">
              <dt className="text-ink-400 font-medium">Size</dt>
              <dd className="mt-0.5 font-bold text-ink-800 text-[0.85rem]">{titleCase(animal.size)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-ink-100/80 pt-3">
          <div>
            <p className="text-lg font-bold text-ink-900">{formatNaira(animal.price)}</p>
            <p className="text-xs text-ink-400">or {formatNaira(animal.depositAmount)} deposit</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!sellable}
            className="flex size-10 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-moss-600 disabled:cursor-not-allowed disabled:bg-ink-200"
            aria-label={`Add ${displayName} to cart`}
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

export const AnimalCardSkeleton = () => (
  <div className="card-surface overflow-hidden">
    <div className="skeleton aspect-4/3 rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-5 w-40" />
      <div className="skeleton h-14 w-full" />
      <div className="skeleton h-6 w-28" />
    </div>
  </div>
)
