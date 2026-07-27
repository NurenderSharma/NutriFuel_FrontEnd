import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentlyViewedEntry {
  kind: 'food' | 'restaurant'
  id: string
  name: string
  imageKey: string
  restaurantSlug?: string
  viewedAt: number
}

interface RecentlyViewedStore {
  entries: RecentlyViewedEntry[]
  record: (entry: Omit<RecentlyViewedEntry, 'viewedAt'>) => void
  clear: () => void
}

const MAX_ENTRIES = 12

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      entries: [],

      record: (entry) =>
        set((state) => {
          const withoutDuplicate = state.entries.filter(
            (existing) => !(existing.kind === entry.kind && existing.id === entry.id),
          )
          return { entries: [{ ...entry, viewedAt: Date.now() }, ...withoutDuplicate].slice(0, MAX_ENTRIES) }
        }),

      clear: () => set({ entries: [] }),
    }),
    { name: 'nutrifuel-recently-viewed' },
  ),
)
