import type { FoodItem } from '../domain'

/**
 * Appends `incoming` items to `existing`, dropping any item whose id OR image URL has
 * already been shown. A dish should never appear twice in the same feed, and no two
 * cards should ever show the same photo — both checks matter because the same dish can be
 * listed at several restaurants (each with its own id) but must still only render once.
 */
export function dedupeFoodItems(existing: FoodItem[], incoming: FoodItem[]): FoodItem[] {
  const seenIds = new Set(existing.map((food) => food.id))
  const seenImages = new Set(existing.map((food) => food.imageKey))
  const unique: FoodItem[] = []

  for (const food of incoming) {
    if (seenIds.has(food.id) || seenImages.has(food.imageKey)) continue
    seenIds.add(food.id)
    seenImages.add(food.imageKey)
    unique.push(food)
  }

  return [...existing, ...unique]
}
