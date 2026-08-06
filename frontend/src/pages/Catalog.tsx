import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimalCard, AnimalCardSkeleton } from '@/components/AnimalCard'
import { Button } from '@/components/ui/Button'
import { EmptyState, ErrorState, Field, Input, Select } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { cleanName, titleCase } from '@/lib/format'
import { CATEGORY_META } from '@/lib/media'
import { useAnimals, useProfile, useToggleWishlist } from '@/lib/queries'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'
import type { Animal, AnimalCategory } from '@/types'

const SORTS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-averageRating', label: 'Top rated' },
  { value: '-weightKg', label: 'Heaviest' },
]

const CATEGORIES = Object.keys(CATEGORY_META) as AnimalCategory[]
const LIMIT = 12

export const CatalogPage = () => {
  const [params, setParams] = useSearchParams()
  const [searchDraft, setSearchDraft] = useState(params.get('search') ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const profile = useProfile(Boolean(user))
  const wishlist = useToggleWishlist()

  const page = Number(params.get('page') ?? 1)

  useEffect(() => setSearchDraft(params.get('search') ?? ''), [params])

  const filters = useMemo(
    () => ({
      search: params.get('search') ?? undefined,
      category: params.get('category') ?? undefined,
      gender: params.get('gender') ?? undefined,
      size: params.get('size') ?? undefined,
      featured: params.get('featured') ?? undefined,
      minPrice: params.get('minPrice') ?? undefined,
      maxPrice: params.get('maxPrice') ?? undefined,
      sort: params.get('sort') ?? '-createdAt',
      status: params.get('status') ?? 'available',
      page,
      limit: LIMIT,
    }),
    [params, page],
  )

  const { data, isLoading, isError, error, refetch, isFetching } = useAnimals(filters)

  const wishedIds = useMemo(() => {
    const items = profile.data?.wishlist ?? []
    return new Set(items.map((item) => (typeof item === 'string' ? item : item._id)))
  }, [profile.data])

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  const clearAll = () => setParams(new URLSearchParams())

  const activeFilters = ['category', 'gender', 'size', 'minPrice', 'maxPrice', 'featured', 'search'].filter((key) =>
    params.get(key),
  )

  const handleWishlist = async (animal: Animal) => {
    if (!user) {
      toast.info('Sign in to save animals to your wishlist')
      return
    }
    try {
      const result = await wishlist.mutateAsync(animal._id)
      toast.success(result.wished ? `${cleanName(animal.name)} saved` : `${cleanName(animal.name)} removed`)
    } catch (wishlistError) {
      toast.error(errorMessage(wishlistError))
    }
  }

  const totalPages = data?.meta.pages ?? 1

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="field-label">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setParam('category')}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              params.get('category') ? 'border-ink-200 text-ink-600 hover:bg-ink-50' : 'border-ink-900 bg-ink-900 text-white'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setParam('category', category)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                params.get('category') === category
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-200 text-ink-600 hover:bg-ink-50'
              }`}
            >
              {CATEGORY_META[category].label}
            </button>
          ))}
        </div>
      </div>

      <Field label="Gender">
        <Select value={params.get('gender') ?? ''} onChange={(event) => setParam('gender', event.target.value)}>
          <option value="">Any gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </Field>

      <Field label="Size">
        <Select value={params.get('size') ?? ''} onChange={(event) => setParam('size', event.target.value)}>
          <option value="">Any size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price">
          <Input
            type="number"
            min={0}
            placeholder="0"
            defaultValue={params.get('minPrice') ?? ''}
            onBlur={(event) => setParam('minPrice', event.target.value)}
          />
        </Field>
        <Field label="Max price">
          <Input
            type="number"
            min={0}
            placeholder="1,000,000"
            defaultValue={params.get('maxPrice') ?? ''}
            onBlur={(event) => setParam('maxPrice', event.target.value)}
          />
        </Field>
      </div>

      <Field label="Availability">
        <Select value={params.get('status') ?? 'available'} onChange={(event) => setParam('status', event.target.value)}>
          <option value="available">Available now</option>
          <option value="reserved">Reserved</option>
          <option value="">Show everything</option>
        </Select>
      </Field>

      <label className="flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-3 text-base">
        <input
          type="checkbox"
          className="size-4 rounded border-ink-300 text-moss-600 focus:ring-moss-500"
          checked={params.get('featured') === 'true'}
          onChange={(event) => setParam('featured', event.target.checked ? 'true' : undefined)}
        />
        Featured animals only
      </label>

      {activeFilters.length ? (
        <Button variant="ghost" className="w-full" onClick={clearAll} icon={<X className="size-4" />}>
          Clear filters
        </Button>
      ) : null}
    </div>
  )

  return (
    <div className="bg-ink-50">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-page py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Catalogue</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {params.get('category') ? CATEGORY_META[params.get('category') as AnimalCategory]?.label : 'All livestock'}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-500">
            {data?.meta.total ?? 0} animals matching your filters. Prices include health documentation; delivery is
            calculated at checkout.
          </p>

          <form
            className="mt-7 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              setParam('search', searchDraft || undefined)
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-300" />
              <Input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Search by name, breed or tag…"
                className="pl-11"
              />
            </div>
            <Select
              value={params.get('sort') ?? '-createdAt'}
              onChange={(event) => setParam('sort', event.target.value)}
              className="sm:w-52"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </Select>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setFiltersOpen((value) => !value)}
              icon={<SlidersHorizontal className="size-4" />}
            >
              Filters
            </Button>
          </form>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[17rem_1fr]">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="card-surface sticky top-24 p-6">
            <p className="mb-5 flex items-center gap-2 text-base font-semibold">
              <Filter className="size-4 text-ink-400" /> Refine
            </p>
            {filterPanel}
          </div>
        </aside>

        <div>
          {activeFilters.length ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeFilters.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setParam(key)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-600 ring-1 ring-ink-100"
                >
                  {titleCase(key)}: {params.get(key)}
                  <X className="size-3" />
                </button>
              ))}
            </div>
          ) : null}

          {isError ? (
            <ErrorState message={errorMessage(error)} onRetry={refetch} />
          ) : isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <AnimalCardSkeleton key={index} />
              ))}
            </div>
          ) : data?.items.length ? (
            <>
              <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
                {data.items.map((animal) => (
                  <AnimalCard
                    key={animal._id}
                    animal={animal}
                    onWishlist={handleWishlist}
                    wished={wishedIds.has(animal._id)}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setParam('page', String(page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-3 text-base text-ink-500">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setParam('page', String(page + 1))}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="No animals match those filters"
              description="Try widening your price range or clearing a filter."
              action={
                <Button variant="outline" onClick={clearAll}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
