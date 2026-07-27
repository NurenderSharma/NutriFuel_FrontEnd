import {
  ZERO_NUTRITION,
  addNutrition,
  roundNutrition,
  scaleNutrition,
} from "./nutrition";
import { scoreNutritionAgainstGoal } from "./recommendations";
import type {
  CartLine,
  CartSummary,
  RewardCalculation,
  RewardCalculationInput,
  RewardTierName,
  RewardTierStatus,
} from "./types";

interface RewardTierDefinition {
  readonly name: RewardTierName;
  readonly minimumPoints: number;
  readonly perks: readonly string[];
}

export const REWARD_TIERS: readonly RewardTierDefinition[] = Object.freeze([
  {
    name: "bronze",
    minimumPoints: 0,
    perks: ["Member-only nutrition challenges"],
  },
  {
    name: "silver",
    minimumPoints: 500,
    perks: ["Free delivery on orders over ₹499"],
  },
  {
    name: "gold",
    minimumPoints: 1_500,
    perks: ["Free delivery", "Priority support"],
  },
  {
    name: "platinum",
    minimumPoints: 4_000,
    perks: ["Free delivery", "Priority support", "Early menu access"],
  },
]);

export function calculateCartSummary(lines: readonly CartLine[]): CartSummary {
  let itemCount = 0;
  let subtotal = 0;
  let nutrition = ZERO_NUTRITION;

  for (const line of lines) {
    assertValidQuantity(line.quantity);
    itemCount += line.quantity;
    subtotal += line.item.price * line.quantity;
    nutrition = addNutrition(
      nutrition,
      scaleNutrition(line.item.nutrition, line.quantity),
    );
  }

  return {
    lines: [...lines],
    itemCount,
    subtotal: roundCurrency(subtotal),
    nutrition: roundNutrition(nutrition),
  };
}

/**
 * NutriFuel rules: floor(subtotal / 10), +20 for a goal match, then a streak
 * multiplier of 1.1 from day 3 or 1.25 from day 7.
 */
export function calculateRewardPoints(
  input: RewardCalculationInput,
): RewardCalculation {
  if (!Number.isFinite(input.orderSubtotal) || input.orderSubtotal < 0) {
    throw new RangeError("Order subtotal must be finite and non-negative.");
  }
  const streakDays = input.streakDays ?? 0;
  const lifetimePoints = input.lifetimePoints ?? 0;
  if (!Number.isInteger(streakDays) || streakDays < 0) {
    throw new RangeError("Streak days must be a non-negative integer.");
  }
  if (!Number.isInteger(lifetimePoints) || lifetimePoints < 0) {
    throw new RangeError("Lifetime points must be a non-negative integer.");
  }

  const basePoints = Math.floor(input.orderSubtotal / 10);
  const goalMatched = input.goal
    ? scoreNutritionAgainstGoal(input.nutrition, input.goal).matchesGoal
    : false;
  const goalBonus = goalMatched ? 20 : 0;
  const streakMultiplier = streakDays >= 7 ? 1.25 : streakDays >= 3 ? 1.1 : 1;
  const pointsEarned = Math.floor((basePoints + goalBonus) * streakMultiplier);
  const lifetimePointsAfterOrder = lifetimePoints + pointsEarned;
  const tierBeforeOrder = getRewardTierStatus(lifetimePoints);
  const tierAfterOrder = getRewardTierStatus(lifetimePointsAfterOrder);

  return {
    basePoints,
    goalMatched,
    goalBonus,
    streakMultiplier,
    pointsEarned,
    lifetimePointsAfterOrder,
    tierBeforeOrder,
    tierAfterOrder,
    tierChanged: tierBeforeOrder.tier !== tierAfterOrder.tier,
  };
}

export function getRewardTierStatus(lifetimePoints: number): RewardTierStatus {
  if (!Number.isInteger(lifetimePoints) || lifetimePoints < 0) {
    throw new RangeError("Lifetime points must be a non-negative integer.");
  }

  let currentIndex = 0;
  for (let index = REWARD_TIERS.length - 1; index >= 0; index -= 1) {
    if (lifetimePoints >= REWARD_TIERS[index].minimumPoints) {
      currentIndex = index;
      break;
    }
  }

  const current = REWARD_TIERS[currentIndex];
  const next = REWARD_TIERS[currentIndex + 1];
  if (!next) {
    return {
      tier: current.name,
      minimumPoints: current.minimumPoints,
      nextTier: null,
      nextTierAt: null,
      progressPercent: 100,
      pointsToNextTier: 0,
      perks: current.perks,
    };
  }

  const range = next.minimumPoints - current.minimumPoints;
  const progress = lifetimePoints - current.minimumPoints;
  return {
    tier: current.name,
    minimumPoints: current.minimumPoints,
    nextTier: next.name,
    nextTierAt: next.minimumPoints,
    progressPercent: Math.round((progress / range) * 100),
    pointsToNextTier: next.minimumPoints - lifetimePoints,
    perks: current.perks,
  };
}

function assertValidQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError("Cart line quantity must be a positive integer.");
  }
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
