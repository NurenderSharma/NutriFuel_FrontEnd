import type { DietaryPreference, FoodCategory, FoodItem, KnownAllergen, NutritionFacts } from './types'

export interface ApiCatalogFood {
  id: string
  name: string
  description: string
  images: string[]
  category: string
  cuisine: string
  dietaryPreference: 'veg' | 'nonveg' | 'vegan'
  isVeg: boolean
  isVegan: boolean
  allergens: string[]
  price: number
  nutrition: NutritionFacts
  tags: string[]
  rating: number
  numReviews: number
  available: boolean
  prepTimeMinutes: number
  restaurantId?: string
  restaurantName?: string
  restaurantSlug?: string
  categoryId?: string
  categoryName?: string
}

const FALLBACK_IMAGE = '/images/nutrifuel-hero.png'

const FOOD_CATEGORIES: readonly FoodCategory[] = ['bowl', 'breakfast', 'drink', 'main', 'salad', 'side', 'snack', 'wrap']

function mapCategory(raw: string): FoodCategory {
  const normalized = raw.trim().toLowerCase().replace(/s$/, '')
  return (FOOD_CATEGORIES as readonly string[]).includes(normalized) ? (normalized as FoodCategory) : 'main'
}

function mapDiet(preference: ApiCatalogFood['dietaryPreference']): DietaryPreference {
  if (preference === 'vegan') return 'vegan'
  if (preference === 'veg') return 'vegetarian'
  return 'non-vegetarian'
}

const ALLERGEN_MAP: Record<string, KnownAllergen> = {
  milk: 'dairy',
  dairy: 'dairy',
  egg: 'eggs',
  eggs: 'eggs',
  fish: 'fish',
  wheat: 'gluten',
  gluten: 'gluten',
  peanut: 'peanuts',
  peanuts: 'peanuts',
  sesame: 'sesame',
  shellfish: 'shellfish',
  soy: 'soy',
  'tree-nut': 'tree-nuts',
  'tree-nuts': 'tree-nuts',
}

function mapAllergens(allergens: string[]): KnownAllergen[] {
  return allergens
    .map((allergen) => ALLERGEN_MAP[allergen.trim().toLowerCase()])
    .filter((allergen): allergen is KnownAllergen => allergen !== undefined)
}

export function mapApiFoodToFoodItem(raw: ApiCatalogFood): FoodItem {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    category: mapCategory(raw.category),
    cuisine: raw.cuisine,
    diet: mapDiet(raw.dietaryPreference),
    allergens: mapAllergens(raw.allergens),
    price: raw.price,
    nutrition: raw.nutrition,
    servingSize: '1 serving',
    tags: raw.tags,
    spiceLevel: 'medium',
    prepTimeMinutes: raw.prepTimeMinutes,
    rating: raw.rating,
    reviewCount: raw.numReviews,
    imageKey: raw.images[0] ?? FALLBACK_IMAGE,
    available: raw.available,
    ...(raw.restaurantId ? { restaurantId: raw.restaurantId } : {}),
    ...(raw.restaurantName ? { restaurantName: raw.restaurantName } : {}),
    ...(raw.restaurantSlug ? { restaurantSlug: raw.restaurantSlug } : {}),
    ...(raw.categoryId ? { categoryId: raw.categoryId } : {}),
    ...(raw.categoryName ? { categoryName: raw.categoryName } : {}),
  }
}
