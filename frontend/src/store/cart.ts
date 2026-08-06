import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Animal } from '@/types'

export interface CartLine {
  animalId: string
  slug: string
  name: string
  category: Animal['category']
  breed: string
  unitPrice: number
  depositAmount: number
  image?: string
  maxQuantity: number
  quantity: number
}

interface CartState {
  lines: CartLine[]
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void
  setQuantity: (animalId: string, quantity: number) => void
  remove: (animalId: string) => void
  clear: () => void
}

const storageKey = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'sgl.cart.admin' : 'sgl.cart'

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((item) => item.animalId === line.animalId)
          if (existing) {
            return {
              lines: state.lines.map((item) =>
                item.animalId === line.animalId
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) }
                  : item,
              ),
            }
          }
          return { lines: [...state.lines, { ...line, quantity: Math.min(quantity, line.maxQuantity) }] }
        }),
      setQuantity: (animalId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((item) =>
              item.animalId === animalId
                ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      remove: (animalId) => set((state) => ({ lines: state.lines.filter((item) => item.animalId !== animalId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: storageKey },
  ),
)

export const cartSubtotal = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)

export const cartDeposit = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.depositAmount * line.quantity, 0)

export const cartCount = (lines: CartLine[]): number => lines.reduce((sum, line) => sum + line.quantity, 0)
