import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Temporary stand-in for the real reward-points balance until Phase 5 wires
 * the cart/checkout/rewards UI to GET /api/rewards/me. Kept as its own tiny
 * store (rather than component state) since both the cart preview in
 * RootLayout and the rewards section on HomePage need the same value.
 */
interface DemoPointsStore {
  points: number
  setPoints: (points: number) => void
}

export const useDemoPointsStore = create<DemoPointsStore>()(
  persist(
    (set) => ({
      points: 720,
      setPoints: (points) => set({ points }),
    }),
    { name: 'nutrifuel-points', partialize: (state) => ({ points: state.points }) },
  ),
)
