import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FoodItem, FoodRecommendation } from '../domain'

export interface CartStoreLine {
  item: FoodItem
  quantity: number
}

type ConflictingAddition = FoodItem | FoodRecommendation

interface CartStore {
  lines: CartStoreLine[]
  isOpen: boolean
  pendingConflict: ConflictingAddition | null
  addItem: (item: FoodItem) => void
  addRecommendation: (recommendation: FoodRecommendation) => void
  decrementItem: (itemId: string) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  resolveConflict: (action: 'replace' | 'cancel') => void
}

function itemsOf(addition: ConflictingAddition): FoodItem[] {
  return 'items' in addition ? [...addition.items] : [addition]
}

function conflictsWithCart(lines: CartStoreLine[], incoming: FoodItem): boolean {
  const currentRestaurantId = lines[0]?.item.restaurantId
  return Boolean(currentRestaurantId && incoming.restaurantId && currentRestaurantId !== incoming.restaurantId)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      pendingConflict: null,

      addItem: (item) =>
        set((state) => {
          if (conflictsWithCart(state.lines, item)) return { pendingConflict: item }

          const existing = state.lines.find((line) => line.item.id === item.id)
          return {
            isOpen: true,
            lines: existing
              ? state.lines.map((line) =>
                  line.item.id === item.id
                    ? { ...line, quantity: line.quantity + 1 }
                    : line,
                )
              : [...state.lines, { item, quantity: 1 }],
          }
        }),

      addRecommendation: (recommendation) =>
        set((state) => {
          const firstItem = recommendation.items[0]
          if (firstItem && conflictsWithCart(state.lines, firstItem)) return { pendingConflict: recommendation }

          const next = [...state.lines]
          for (const item of recommendation.items) {
            const index = next.findIndex((line) => line.item.id === item.id)
            if (index >= 0) next[index] = { ...next[index], quantity: next[index].quantity + 1 }
            else next.push({ item, quantity: 1 })
          }
          return { lines: next, isOpen: true }
        }),

      decrementItem: (itemId) =>
        set((state) => ({
          lines: state.lines.flatMap((line) =>
            line.item.id !== itemId
              ? [line]
              : line.quantity > 1
                ? [{ ...line, quantity: line.quantity - 1 }]
                : [],
          ),
        })),
      removeItem: (itemId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.item.id !== itemId) })),
      clearCart: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      resolveConflict: (action) =>
        set((state) => {
          if (!state.pendingConflict) return {}
          if (action === 'cancel') return { pendingConflict: null }
          return {
            pendingConflict: null,
            isOpen: true,
            lines: itemsOf(state.pendingConflict).map((item) => ({ item, quantity: 1 })),
          }
        }),
    }),
    {
      name: 'nutrifuel-cart',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)
