import { describe, expect, it } from "vitest";
import { foodCatalog } from "../data/foodCatalog";
import {
  filterFoodItems,
  getRecommendations,
  scoreNutritionAgainstGoal,
} from "./recommendations";
import type { FoodItem, NutritionFacts } from "./types";

const baseNutrition: NutritionFacts = {
  calories: 200,
  protein: 20,
  carbs: 20,
  fat: 5,
  fiber: 4,
  sugar: 2,
};

function makeItem(
  id: string,
  nutrition: NutritionFacts,
  overrides: Partial<FoodItem> = {},
): FoodItem {
  return {
    id,
    name: id,
    description: `${id} test fixture`,
    category: "bowl",
    cuisine: "Test kitchen",
    diet: "vegan",
    allergens: [],
    price: 100,
    nutrition,
    servingSize: "1 serving",
    tags: ["test"],
    spiceLevel: "mild",
    prepTimeMinutes: 10,
    rating: 4.5,
    reviewCount: 10,
    imageKey: `food/${id}`,
    available: true,
    ...overrides,
  };
}

describe("scoreNutritionAgainstGoal", () => {
  it("gives an exact target a perfect, explainable match", () => {
    const result = scoreNutritionAgainstGoal(baseNutrition, {
      targets: { calories: 200, protein: 20 },
    });

    expect(result.score).toBe(100);
    expect(result.matchesGoal).toBe(true);
    expect(result.metrics).toHaveLength(2);
    expect(result.metrics.every((metric) => metric.withinTolerance)).toBe(true);
  });

  it("honors caller-supplied metric weights", () => {
    const goal = {
      targets: { calories: 500, protein: 40 },
      weights: { calories: 0.2, protein: 0.8 },
    } as const;
    const exactProtein = scoreNutritionAgainstGoal(
      { ...baseNutrition, calories: 600, protein: 40 },
      goal,
    );
    const exactCalories = scoreNutritionAgainstGoal(
      { ...baseNutrition, calories: 500, protein: 30 },
      goal,
    );

    expect(exactProtein.score).toBeGreaterThan(exactCalories.score);
  });

  it("rejects empty and non-positive targets", () => {
    expect(() => scoreNutritionAgainstGoal(baseNutrition, { targets: {} })).toThrow(
      /at least one target/i,
    );
    expect(() =>
      scoreNutritionAgainstGoal(baseNutrition, { targets: { protein: 0 } }),
    ).toThrow(/greater than zero/i);
  });
});

describe("recommendation filtering", () => {
  it("enforces vegan and allergy filters before scoring", () => {
    const result = filterFoodItems(foodCatalog, {
      dietaryPreference: "vegan",
      excludedAllergens: ["soy"],
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.diet === "vegan")).toBe(true);
    expect(result.every((item) => !item.allergens.includes("soy"))).toBe(true);
  });

  it("allows vegan meals for vegetarian diners but excludes meat", () => {
    const result = filterFoodItems(foodCatalog, {
      dietaryPreference: "vegetarian",
    });

    expect(result.some((item) => item.diet === "vegan")).toBe(true);
    expect(result.some((item) => item.diet === "vegetarian")).toBe(true);
    expect(result.some((item) => item.diet === "non-vegetarian")).toBe(false);
  });
});

describe("getRecommendations", () => {
  it("builds and ranks a two-item combo that precisely fills a target", () => {
    const first = makeItem("first", baseNutrition);
    const second = makeItem("second", baseNutrition);
    const light = makeItem("light", {
      calories: 100,
      protein: 5,
      carbs: 12,
      fat: 2,
      fiber: 2,
      sugar: 1,
    });

    const result = getRecommendations({
      items: [first, second, light],
      goal: { targets: { calories: 400, protein: 40 } },
      includeCombos: true,
      limit: 5,
    });

    expect(result.combos[0].items.map((item) => item.id)).toEqual([
      "first",
      "second",
    ]);
    expect(result.combos[0].score).toBe(100);
    expect(result.combos[0].matchesGoal).toBe(true);
    expect(result.combos[0].reasons[0]).toMatch(/matches all/i);
  });

  it("uses calorie ceilings and total combo prices as hard limits", () => {
    const items = [
      makeItem("a", baseNutrition, { price: 120 }),
      makeItem("b", baseNutrition, { price: 120 }),
      makeItem("large", { ...baseNutrition, calories: 550 }, { price: 80 }),
    ];
    const result = getRecommendations({
      items,
      goal: {
        targets: { protein: 40 },
        calorieCeiling: 450,
      },
      filters: { maxPrice: 220 },
      limit: 10,
    });

    expect(result.recommendations.every((candidate) => candidate.price <= 220)).toBe(
      true,
    );
    expect(
      result.recommendations.every(
        (candidate) => candidate.nutrition.calories <= 450,
      ),
    ).toBe(true);
    expect(result.combos).toHaveLength(0);
  });

  it("returns separate single, combo and mixed views with stable result limits", () => {
    const result = getRecommendations({
      items: foodCatalog,
      goal: { targets: { calories: 500, protein: 40 } },
      limit: 4,
    });

    expect(result.singles.length).toBeLessThanOrEqual(4);
    expect(result.combos.length).toBeLessThanOrEqual(4);
    expect(result.recommendations).toHaveLength(4);
    expect(result.recommendations[0].score).toBeGreaterThanOrEqual(
      result.recommendations[3].score,
    );
  });
});
