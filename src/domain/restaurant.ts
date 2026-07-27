export interface RestaurantCategorySummary {
  id: string
  name: string
  slug: string
  sortOrder: number
}

export interface RestaurantAddress {
  line1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface Restaurant {
  id: string
  owner: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  coverImageUrl: string | null
  gallery: string[]
  cuisines: string[]
  address: RestaurantAddress
  contactEmail: string | null
  contactPhone: string | null
  status: 'pending' | 'approved' | 'suspended'
  isActive: boolean
  rating: number
  numReviews: number
  createdAt: string
}

export interface RestaurantDetail extends Restaurant {
  categories: RestaurantCategorySummary[]
}
