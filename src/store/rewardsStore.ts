import { create } from 'zustand'
import { apiClient } from '../lib/apiClient'

export interface RewardCatalogEntry {
  id: string
  name: string
  cost: number
  unlocked: boolean
}

export interface RewardLedgerEntry {
  id: string
  type: 'earn' | 'redeem'
  points: number
  reason: string
  orderId?: string
  balanceAfter: number
  createdAt: string
}

export interface RewardSummary {
  points: number
  lifetimePoints: number
  tier: string
  nextTier: string | null
  nextTierAt: number | null
  progressPercent: number
  pointsToNextTier: number
  rewards: RewardCatalogEntry[]
  ledger: RewardLedgerEntry[]
}

interface RewardsStore {
  summary: RewardSummary | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  fetchSummary: () => Promise<void>
  clear: () => void
}

export const useRewardsStore = create<RewardsStore>((set) => ({
  summary: null,
  status: 'idle',
  fetchSummary: async () => {
    set({ status: 'loading' })
    try {
      const summary = await apiClient.get<RewardSummary>('/rewards/me')
      set({ summary, status: 'ready' })
    } catch {
      set({ summary: null, status: 'error' })
    }
  },
  clear: () => set({ summary: null, status: 'idle' }),
}))
