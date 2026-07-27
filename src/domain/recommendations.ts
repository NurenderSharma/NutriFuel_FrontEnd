import {
  NUTRITION_METRICS,
  addNutrition,
  roundNutrition,
} from "./nutrition";
import type {
  ComboRecommendation,
  DietaryPreference,
  FoodItem,
  FoodRecommendation,
  MetricMatch,
  NutritionFacts,
  NutritionGoal,
  NutritionMatchScore,
  NutritionMetric,
  RecommendationFilters,
  RecommendationRequest,
  RecommendationResult,
  SingleRecommendation,
} from "./types";

export const DEFAULT_NUTRITION_WEIGHTS: Readonly<
  Record<NutritionMetric, number>
> = Object.freeze({
  calories: 0.3,
  protein: 0.4,
  carbs: 0.12,
  fat: 0.1,
  fiber: 0.06,
  sugar: 0.02,
});

const DEFAULT_TOLERANCE = 0.1;
const DEFAULT_RESULT_LIMIT = 8;
const DEFAULT_COMBO_POOL_SIZE = 18;

const METRIC_LABELS: Record<NutritionMetric, string> = {
  calories: "Calories",
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
  fiber: "Fiber",
  sugar: "Sugar",
};

const METRIC_UNITS: Record<NutritionMetric, string> = {
  calories: "kcal",
  protein: "g",
  carbs: "g",
  fat: "g",
  fiber: "g",
  sugar: "g",
};

/**
 * Scores nutrition using weighted relative distance from each selected target.
 * Weights are normalized across only the metrics present in the goal.
 */
export function scoreNutritionAgainstGoal(
  nutrition: NutritionFacts,
  goal: NutritionGoal,
): NutritionMatchScore {
  validateGoal(goal);

  const metrics = NUTRITION_METRICS.flatMap<MetricMatch>((metric) => {
    const target = goal.targets[metric];
    if (target === undefined) return [];

    const weight = goal.weights?.[metric] ?? DEFAULT_NUTRITION_WEIGHTS[metric];
    if (!Number.isFinite(weight) || weight < 0) {
      throw new RangeError(`Weight for ${metric} must be finite and non-negative.`);
    }

    const actual = nutrition[metric];
    const relativeDifference = Math.abs(actual - target) / target;
    const tolerance = goal.tolerance?.[metric] ??
      goal.defaultTolerance ??
      DEFAULT_TOLERANCE;

    if (!Number.isFinite(tolerance) || tolerance < 0) {
      throw new RangeError(
        `Tolerance for ${metric} must be finite and non-negative.`,
      );
    }

    return [
      {
        metric,
        target,
        actual,
        difference: actual - target,
        relativeDifference,
        tolerance,
        weight,
        accuracy: Math.max(0, 1 - Math.min(relativeDifference, 1)) * 100,
        withinTolerance: relativeDifference <= tolerance,
      },
    ];
  });

  const totalWeight = metrics.reduce((total, metric) => total + metric.weight, 0);
  if (totalWeight <= 0) {
    throw new RangeError("At least one selected nutrition target needs a positive weight.");
  }

  const weightedDistance = metrics.reduce(
    (total, metric) =>
      total + Math.min(metric.relativeDifference, 1) * metric.weight,
    0,
  ) / totalWeight;
  const respectsCalorieCeiling =
    goal.calorieCeiling === undefined ||
    nutrition.calories <= goal.calorieCeiling;

  return {
    score: roundScore(Math.max(0, 1 - weightedDistance) * 100),
    matchesGoal:
      respectsCalorieCeiling && metrics.every((metric) => metric.withinTolerance),
    metrics,
  };
}

/** A preference describes what a diner can eat, not a required recipe label. */
export function isDietCompatible(
  itemDiet: DietaryPreference,
  preference: DietaryPreference,
): boolean {
  if (preference === "vegan") return itemDiet === "vegan";
  if (preference === "vegetarian") return itemDiet !== "non-vegetarian";
  return true;
}

export function filterFoodItems(
  items: readonly FoodItem[],
  filters: RecommendationFilters = {},
): FoodItem[] {
  const excludedAllergens = new Set(filters.excludedAllergens ?? []);
  const cuisines = new Set(
    (filters.cuisines ?? []).map((cuisine) => cuisine.toLocaleLowerCase()),
  );

  return items.filter((item) => {
    if (!item.available) return false;
    if (
      filters.dietaryPreference &&
      !isDietCompatible(item.diet, filters.dietaryPreference)
    ) {
      return false;
    }
    if (item.allergens.some((allergen) => excludedAllergens.has(allergen))) {
      return false;
    }
    if (cuisines.size > 0 && !cuisines.has(item.cuisine.toLocaleLowerCase())) {
      return false;
    }
    if (
      filters.requiredTags?.some(
        (tag) => !item.tags.some((itemTag) => itemTag === tag),
      )
    ) {
      return false;
    }
    if (
      filters.maxPrice !== undefined &&
      item.price > filters.maxPrice
    ) {
      return false;
    }
    if (
      filters.maxPrepTimeMinutes !== undefined &&
      item.prepTimeMinutes > filters.maxPrepTimeMinutes
    ) {
      return false;
    }
    return true;
  });
}

export function getRecommendations(
  request: RecommendationRequest,
): RecommendationResult {
  validateGoal(request.goal);
  const limit = positiveIntegerOrDefault(request.limit, DEFAULT_RESULT_LIMIT);
  const comboPoolSize = positiveIntegerOrDefault(
    request.comboPoolSize,
    DEFAULT_COMBO_POOL_SIZE,
  );
  const filters = request.filters ?? {};
  const eligibleItems = filterFoodItems(request.items, filters);

  const allSingles = eligibleItems
    .filter((item) => candidateWithinHardLimits(item.nutrition, item.price, request.goal, filters))
    .map((item) => createSingleRecommendation(item, request.goal))
    .sort(compareRecommendations);

  const allCombos: ComboRecommendation[] = [];
  if (request.includeCombos !== false) {
    const comboPool = allSingles
      .slice(0, comboPoolSize)
      .map((recommendation) => recommendation.items[0]);

    for (let firstIndex = 0; firstIndex < comboPool.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < comboPool.length;
        secondIndex += 1
      ) {
        const first = comboPool[firstIndex];
        const second = comboPool[secondIndex];
        const nutrition = roundNutrition(
          addNutrition(first.nutrition, second.nutrition),
        );
        const price = first.price + second.price;

        if (!candidateWithinHardLimits(nutrition, price, request.goal, filters)) {
          continue;
        }
        allCombos.push(
          createComboRecommendation(first, second, nutrition, price, request.goal),
        );
      }
    }
    allCombos.sort(compareRecommendations);
  }

  const singles = allSingles.slice(0, limit);
  const combos = allCombos.slice(0, limit);
  const recommendations = [...singles, ...combos]
    .sort(compareRecommendations)
    .slice(0, limit);

  return {
    recommendations,
    singles,
    combos,
    eligibleItemCount: eligibleItems.length,
    goal: request.goal,
  };
}

function createSingleRecommendation(
  item: FoodItem,
  goal: NutritionGoal,
): SingleRecommendation {
  const match = scoreNutritionAgainstGoal(item.nutrition, goal);
  return {
    kind: "single",
    id: `single:${item.id}`,
    items: [item],
    nutrition: item.nutrition,
    price: item.price,
    score: match.score,
    matchesGoal: match.matchesGoal,
    metricMatches: match.metrics,
    reasons: buildReasons(match, goal, [item]),
  };
}

function createComboRecommendation(
  first: FoodItem,
  second: FoodItem,
  nutrition: NutritionFacts,
  price: number,
  goal: NutritionGoal,
): ComboRecommendation {
  const match = scoreNutritionAgainstGoal(nutrition, goal);
  return {
    kind: "combo",
    id: `combo:${first.id}+${second.id}`,
    items: [first, second],
    nutrition,
    price,
    score: match.score,
    matchesGoal: match.matchesGoal,
    metricMatches: match.metrics,
    reasons: buildReasons(match, goal, [first, second]),
  };
}

function buildReasons(
  match: NutritionMatchScore,
  goal: NutritionGoal,
  items: readonly FoodItem[],
): string[] {
  const reasons: string[] = [];
  if (match.matchesGoal) {
    reasons.push("Matches all selected nutrition targets within your tolerance.");
  }

  const byImportance = [...match.metrics].sort(
    (left, right) => right.weight - left.weight,
  );
  for (const metric of byImportance.slice(0, match.matchesGoal ? 2 : 3)) {
    reasons.push(formatMetricReason(metric));
  }

  if (
    goal.calorieCeiling !== undefined &&
    items.reduce((total, item) => total + item.nutrition.calories, 0) <=
      goal.calorieCeiling &&
    reasons.length < 3
  ) {
    reasons.push(`Stays under your ${goal.calorieCeiling} kcal ceiling.`);
  }

  if (reasons.length < 3 && items.every((item) => item.diet === "vegan")) {
    reasons.push("Entirely plant-based.");
  }

  return reasons.slice(0, 3);
}

function formatMetricReason(metric: MetricMatch): string {
  const label = METRIC_LABELS[metric.metric];
  const unit = METRIC_UNITS[metric.metric];
  const actual = formatNumber(metric.actual);
  const target = formatNumber(metric.target);
  const percent = Math.round(metric.relativeDifference * 100);

  if (metric.withinTolerance) {
    return `${label} is within ${percent}% of your target (${actual} ${unit} vs ${target} ${unit}).`;
  }

  const direction = metric.difference > 0 ? "above" : "below";
  return `${label} is ${percent}% ${direction} target (${actual} ${unit} vs ${target} ${unit}).`;
}

function candidateWithinHardLimits(
  nutrition: NutritionFacts,
  price: number,
  goal: NutritionGoal,
  filters: RecommendationFilters,
): boolean {
  if (
    goal.calorieCeiling !== undefined &&
    nutrition.calories > goal.calorieCeiling
  ) {
    return false;
  }
  return filters.maxPrice === undefined || price <= filters.maxPrice;
}

function compareRecommendations(
  left: FoodRecommendation,
  right: FoodRecommendation,
): number {
  if (right.score !== left.score) return right.score - left.score;
  if (right.matchesGoal !== left.matchesGoal) return Number(right.matchesGoal) - Number(left.matchesGoal);

  const rightRating = averageRating(right.items);
  const leftRating = averageRating(left.items);
  if (rightRating !== leftRating) return rightRating - leftRating;
  if (left.price !== right.price) return left.price - right.price;
  return left.id.localeCompare(right.id);
}

function averageRating(items: readonly FoodItem[]): number {
  return items.reduce((total, item) => total + item.rating, 0) / items.length;
}

function validateGoal(goal: NutritionGoal): void {
  const activeTargets = NUTRITION_METRICS.filter(
    (metric) => goal.targets[metric] !== undefined,
  );
  if (activeTargets.length === 0) {
    throw new RangeError("A nutrition goal must contain at least one target.");
  }

  for (const metric of activeTargets) {
    const target = goal.targets[metric];
    if (target === undefined || !Number.isFinite(target) || target <= 0) {
      throw new RangeError(`Target for ${metric} must be finite and greater than zero.`);
    }
  }

  if (
    goal.calorieCeiling !== undefined &&
    (!Number.isFinite(goal.calorieCeiling) || goal.calorieCeiling <= 0)
  ) {
    throw new RangeError("Calorie ceiling must be finite and greater than zero.");
  }
}

function positiveIntegerOrDefault(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError("Recommendation limits must be positive integers.");
  }
  return value;
}

function roundScore(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
