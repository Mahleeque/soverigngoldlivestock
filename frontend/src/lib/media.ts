import type { AnimalCategory } from '@/types'

const FALLBACKS: Record<AnimalCategory, string[]> = {
  ram: ['/images/ram-1.jpg', '/images/ram-2.jpg', '/images/ram-3.jpg'],
  goat: ['/images/goat-1.jpg', '/images/goat-2.jpg', '/images/goat-3.jpg'],
  cow: ['/images/cow-1.jpg', '/images/cow-2.jpg', '/images/cow-3.jpg'],
  pig: ['/images/pig-1.jpg', '/images/pig-2.jpg', '/images/pig-3.jpg'],
  chicken: ['/images/chicken-1.jpg', '/images/chicken-2.jpg', '/images/chicken-3.jpg'],
  layer: ['/images/layer-1.jpg', '/images/layer-2.jpg', '/images/layer-3.jpg'],
}

const PLACEHOLDER_HOSTS = ['res.cloudinary.com/demo', 'via.placeholder.com', 'example.com']

const isUsable = (url?: string): boolean =>
  Boolean(url) && !PLACEHOLDER_HOSTS.some((host) => url!.includes(host))

const hash = (value: string): number => {
  let total = 0
  for (let index = 0; index < value.length; index += 1) total = (total + value.charCodeAt(index)) % 997
  return total
}

/** Category artwork used when an animal has no real photography attached yet. */
export const categoryImage = (category: AnimalCategory, seed = '', offset = 0): string => {
  const pool = FALLBACKS[category] ?? FALLBACKS.ram
  return pool[(hash(seed) + offset) % pool.length]
}

export const animalImages = (animal: {
  images?: string[]
  category: AnimalCategory
  slug: string
}): string[] => {
  const real = (animal.images ?? []).filter(isUsable)
  if (real.length) return real
  const pool = FALLBACKS[animal.category] ?? FALLBACKS.ram
  const start = hash(animal.slug)
  return pool.map((_, index) => pool[(start + index) % pool.length])
}

export const animalImage = (animal: { images?: string[]; category: AnimalCategory; slug: string }): string =>
  animalImages(animal)[0]

export const CATEGORY_META: Record<AnimalCategory, { label: string; blurb: string; image: string }> = {
  ram: { label: 'Rams', blurb: 'Sallah-ready Yankasa, Uda & Balami', image: '/images/ram-1.jpg' },
  goat: { label: 'Goats', blurb: 'Boer, WAD & Sokoto Red stock', image: '/images/goat-1.jpg' },
  cow: { label: 'Cattle', blurb: 'White Fulani, Gudali & crossbreeds', image: '/images/cow-1.jpg' },
  pig: { label: 'Pigs', blurb: 'Large White & Landrace finishers', image: '/images/pig-1.jpg' },
  chicken: { label: 'Broilers', blurb: 'Table-ready birds, farm fresh', image: '/images/chicken-1.jpg' },
  layer: { label: 'Layers', blurb: 'Point-of-lay hens in full production', image: '/images/layer-1.jpg' },
}

export const HERO_IMAGE = '/images/farm-1.jpg'
export const STORY_IMAGE = '/images/farm-2.jpg'
export const CTA_IMAGE = '/images/farm-3.jpg'
