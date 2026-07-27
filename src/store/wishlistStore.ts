import { create } from 'zustand'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import { apiClient } from '../lib/apiClient'

interface WishlistStore {
  ids: Set<string>
  foods: FoodItem[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  fetchWishlist: () => Promise<void>
  toggle: (foodId: string) => Promise<void>
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: new Set(),
  foods: [],
  status: 'idle',

  fetchWishlist: async () => {
    set({ status: 'loading' })
    try {
      const foods = await apiClient.get<ApiCatalogFood[]>('/wishlist')
      const mapped = foods.map(mapApiFoodToFoodItem)
      set({ foods: mapped, ids: new Set(mapped.map((food) => food.id)), status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },

  toggle: async (foodId: string) => {
    const { ids } = get()
    const wasWishlisted = ids.has(foodId)
    const nextIds = new Set(ids)
    if (wasWishlisted) nextIds.delete(foodId)
    else nextIds.add(foodId)
    set({ ids: nextIds })

    try {
      if (wasWishlisted) await apiClient.del(`/wishlist/${foodId}`)
      else await apiClient.post(`/wishlist/${foodId}`)
    } catch {
      set({ ids }) // revert optimistic update on failure
    }
  },

  clear: () => set({ ids: new Set(), foods: [], status: 'idle' }),
}))
