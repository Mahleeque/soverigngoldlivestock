import {
  ArrowLeft,
  CalendarClock,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Syringe,
  Truck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimalCard } from '@/components/AnimalCard'
import { Button } from '@/components/ui/Button'
import { Badge, ErrorState, SectionHeading, Skeleton } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { cleanName, formatAge, formatDate, formatNaira, titleCase } from '@/lib/format'
import { animalImages } from '@/lib/media'
import { useAnimal, useAnimals, useCreateReservation, useProfile, useToggleWishlist } from '@/lib/queries'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { toast } from '@/store/toast'

export const AnimalDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: animal, isLoading, isError, error, refetch } = useAnimal(slug)
  const related = useAnimals({ category: animal?.category, status: 'available', limit: 4 })
  const user = useAuthStore((state) => state.user)
  const profile = useProfile(Boolean(user))
  const wishlist = useToggleWishlist()
  const reservation = useCreateReservation()
  const add = useCartStore((state) => state.add)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const images = useMemo(() => (animal ? animalImages(animal) : []), [animal])
  const wished = useMemo(() => {
    const items = profile.data?.wishlist ?? []
    return items.some((item) => (typeof item === 'string' ? item : item._id) === animal?._id)
  }, [profile.data, animal?._id])

  if (isLoading) {
    return (
      <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-4/3 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    )
  }

  if (isError || !animal) {
    return (
      <div className="container-page py-16">
        <ErrorState message={errorMessage(error, 'This animal could not be found.')} onRetry={refetch} />
        <Link to="/animals" className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-moss-600">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
      </div>
    )
  }

  const sellable = animal.status === 'available' && animal.quantity > 0
  const maxQuantity = Math.max(animal.quantity, 1)

  const displayName = cleanName(animal.name)

  const handleAdd = () => {
    add(
      {
        animalId: animal._id,
        slug: animal.slug,
        name: displayName,
        category: animal.category,
        breed: animal.breed,
        unitPrice: animal.price,
        depositAmount: animal.depositAmount,
        image: images[0],
        maxQuantity,
      },
      quantity,
    )
    toast.success(`${displayName} added to cart`)
  }

  const handleReserve = async () => {
    if (!user) {
      toast.info('Sign in to reserve this animal')
      return
    }
    try {
      await reservation.mutateAsync(animal._id)
      toast.success('Reserved for 48 hours — see it in your account')
    } catch (reserveError) {
      toast.error(errorMessage(reserveError))
    }
  }

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Sign in to save animals')
      return
    }
    try {
      const result = await wishlist.mutateAsync(animal._id)
      toast.success(result.wished ? 'Saved to wishlist' : 'Removed from wishlist')
    } catch (wishError) {
      toast.error(errorMessage(wishError))
    }
  }

  const specs = [
    { label: 'Breed', value: animal.breed },
    { label: 'Live weight', value: `${animal.weightKg} kg` },
    { label: 'Age', value: formatAge(animal.ageMonths) },
    { label: 'Gender', value: titleCase(animal.gender) },
    { label: 'Size grade', value: titleCase(animal.size) },
    { label: 'SKU', value: animal.sku },
    { label: 'Listed', value: formatDate(animal.createdAt) },
    { label: 'In stock', value: `${animal.quantity}` },
  ]

  return (
    <div className="bg-ink-50 pb-20">
      <div className="container-page pt-8">
        <Link to="/animals" className="inline-flex items-center gap-2 text-base font-medium text-ink-500 hover:text-ink-800">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
      </div>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-4xl bg-white">
            <img src={images[activeImage]} alt={displayName} className="aspect-4/3 w-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="mt-4 flex gap-3">
              {images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`size-20 overflow-hidden rounded-2xl ring-2 transition ${
                    index === activeImage ? 'ring-ink-900' : 'ring-transparent hover:ring-ink-200'
                  }`}
                >
                  <img src={image} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{titleCase(animal.category)}</Badge>
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{displayName}</h1>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-base text-ink-400">{animal.breed}</span>
                  </div>

          <p className="mt-5 leading-relaxed text-ink-600">{animal.description}</p>

          <div className="mt-7 card-surface p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-semibold">{formatNaira(animal.price)}</p>
                <p className="mt-1 text-base text-ink-500">
                  Reserve with {formatNaira(animal.depositAmount)} · balance on delivery
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-ink-200 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-ink-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-base font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-ink-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleAdd} disabled={!sellable} icon={<ShoppingCart className="size-4" />}>
                {sellable ? 'Add to cart' : 'Unavailable'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReserve}
                loading={reservation.isPending}
                disabled={!sellable}
                icon={<CalendarClock className="size-4" />}
              >
                Reserve 48h
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={handleWishlist}
                icon={<Heart className={`size-4 ${wished ? 'fill-red-500 text-red-500' : ''}`} />}
              >
                {wished ? 'Saved' : 'Save'}
              </Button>
            </div>

            <ul className="mt-6 grid gap-2 border-t border-ink-100 pt-5 text-base text-ink-600 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-moss-500" /> {animal.healthStatus}
              </li>
              <li className="flex items-center gap-2">
                <Syringe className="size-4 text-moss-500" /> {animal.vaccinationStatus}
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-moss-500" /> Delivery in 24–72 hours
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-moss-500" /> Live weight verified at dispatch
              </li>
            </ul>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink-100 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white px-4 py-4">
                <dt className="text-sm uppercase tracking-wide text-ink-400">{spec.label}</dt>
                <dd className="mt-1 text-base font-semibold text-ink-800">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {animal.tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {animal.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Reviews removed per request */}

      {related.data?.items.filter((item) => item._id !== animal._id).length ? (
        <section className="container-page py-10">
          <SectionHeading eyebrow="You may also like" title={`More ${titleCase(animal.category)}s`} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.data.items
              .filter((item) => item._id !== animal._id)
              .slice(0, 4)
              .map((item) => (
                <AnimalCard key={item._id} animal={item} />
              ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
