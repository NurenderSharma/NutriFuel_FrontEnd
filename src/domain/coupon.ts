export interface Coupon {
  id: string
  restaurantId: string
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxRedemptions: number | null
  redemptionCount: number
  expiresAt: string | null
  active: boolean
}
