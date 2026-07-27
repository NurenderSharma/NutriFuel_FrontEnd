import type { NutritionFacts, NutritionMetric } from "./types";

export const NUTRITION_METRICS = [
  "calories",
  "protein",
  "carbs",
  "fat",
  "fiber",
  "sugar",
] as const satisfies readonly NutritionMetric[];

export const ZERO_NUTRITION: NutritionFacts = Object.freeze({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
});

export function addNutrition(
  left: NutritionFacts,
  right: NutritionFacts,
): NutritionFacts {
  return {
    calories: left.calories + right.calories,
    protein: left.protein + right.protein,
    carbs: left.carbs + right.carbs,
    fat: left.fat + right.fat,
    fiber: left.fiber + right.fiber,
    sugar: left.sugar + right.sugar,
  };
}

export function scaleNutrition(
  nutrition: NutritionFacts,
  quantity: number,
): NutritionFacts {
  if (!Number.isFinite(quantity) || quantity < 0) {
    throw new RangeError("Nutrition quantity must be a finite, non-negative number.");
  }

  return {
    calories: nutrition.calories * quantity,
    protein: nutrition.protein * quantity,
    carbs: nutrition.carbs * quantity,
    fat: nutrition.fat * quantity,
    fiber: nutrition.fiber * quantity,
    sugar: nutrition.sugar * quantity,
  };
}

/** Keeps calculated UI values stable without losing meaningful macro precision. */
export function roundNutrition(nutrition: NutritionFacts): NutritionFacts {
  return {
    calories: Math.round(nutrition.calories),
    protein: roundToOneDecimal(nutrition.protein),
    carbs: roundToOneDecimal(nutrition.carbs),
    fat: roundToOneDecimal(nutrition.fat),
    fiber: roundToOneDecimal(nutrition.fiber),
    sugar: roundToOneDecimal(nutrition.sugar),
  };
}

export function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}
