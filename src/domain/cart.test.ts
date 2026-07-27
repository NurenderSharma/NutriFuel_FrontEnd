import { describe, expect, it } from "vitest";
import { foodCatalog } from "../data/foodCatalog";
import {
  calculateCartSummary,
  calculateRewardPoints,
  getRewardTierStatus,
} from "./cart";

describe("calculateCartSummary", () => {
  it("aggregates price, item count and every nutrition field by quantity", () => {
    const first = foodCatalog[0];
    const second = foodCatalog[1];
    const summary = calculateCartSummary([
      { item: first, quantity: 2 },
      { item: second, quantity: 1 },
    ]);

    expect(summary.itemCount).toBe(3);
    expect(summary.subtotal).toBe(first.price * 2 + second.price);
    expect(summary.nutrition.calories).toBe(
      first.nutrition.calories * 2 + second.nutrition.calories,
    );
    expect(summary.nutrition.protein).toBe(
      first.nutrition.protein * 2 + second.nutrition.protein,
    );
    expect(summary.nutrition.fiber).toBe(
      first.nutrition.fiber * 2 + second.nutrition.fiber,
    );
  });

  it("rejects invalid cart quantities", () => {
    expect(() =>
      calculateCartSummary([{ item: foodCatalog[0], quantity: 0 }]),
    ).toThrow(/positive integer/i);
  });
});

describe("calculateRewardPoints", () => {
  const exactNutrition = {
    calories: 500,
    protein: 40,
    carbs: 50,
    fat: 15,
    fiber: 10,
    sugar: 8,
  };

  it("applies spend points, goal bonus, streak multiplier and a tier upgrade", () => {
    const reward = calculateRewardPoints({
      orderSubtotal: 500,
      nutrition: exactNutrition,
      goal: { targets: { calories: 500, protein: 40 } },
      streakDays: 3,
      lifetimePoints: 460,
    });

    expect(reward.basePoints).toBe(50);
    expect(reward.goalMatched).toBe(true);
    expect(reward.goalBonus).toBe(20);
    expect(reward.streakMultiplier).toBe(1.1);
    expect(reward.pointsEarned).toBe(77);
    expect(reward.tierBeforeOrder.tier).toBe("bronze");
    expect(reward.tierAfterOrder.tier).toBe("silver");
    expect(reward.tierChanged).toBe(true);
  });

  it("does not grant a goal bonus when one selected target misses tolerance", () => {
    const reward = calculateRewardPoints({
      orderSubtotal: 500,
      nutrition: { ...exactNutrition, protein: 25 },
      goal: { targets: { calories: 500, protein: 40 } },
    });

    expect(reward.goalMatched).toBe(false);
    expect(reward.goalBonus).toBe(0);
    expect(reward.pointsEarned).toBe(50);
  });
});

describe("getRewardTierStatus", () => {
  it("calculates progress within a tier", () => {
    const status = getRewardTierStatus(1_000);

    expect(status.tier).toBe("silver");
    expect(status.nextTier).toBe("gold");
    expect(status.progressPercent).toBe(50);
    expect(status.pointsToNextTier).toBe(500);
  });

  it("caps platinum progress", () => {
    const status = getRewardTierStatus(9_000);

    expect(status.tier).toBe("platinum");
    expect(status.nextTier).toBeNull();
    expect(status.progressPercent).toBe(100);
  });
});
