import type { NutritionGoal } from "../domain/types";

export const goalPresets = [
  {
    id: "post-workout",
    name: "Post-workout fuel",
    targets: { calories: 500, protein: 40, carbs: 50 },
    weights: { protein: 0.55, calories: 0.3, carbs: 0.15 },
    defaultTolerance: 0.15,
    calorieCeiling: 600,
  },
  {
    id: "lean-and-light",
    name: "Lean & light",
    targets: { calories: 400, protein: 35, carbs: 25, fat: 15 },
    weights: { calories: 0.35, protein: 0.4, carbs: 0.15, fat: 0.1 },
    defaultTolerance: 0.15,
    calorieCeiling: 475,
  },
  {
    id: "fiber-boost",
    name: "Fiber boost",
    targets: { calories: 450, fiber: 15, protein: 20 },
    weights: { fiber: 0.5, protein: 0.25, calories: 0.25 },
    defaultTolerance: 0.2,
    calorieCeiling: 550,
  },
  {
    id: "balanced-dinner",
    name: "Balanced dinner",
    targets: { calories: 550, protein: 30, carbs: 55, fat: 18, fiber: 10 },
    defaultTolerance: 0.15,
    calorieCeiling: 650,
  },
] as const satisfies readonly NutritionGoal[];

export type GoalPresetId = (typeof goalPresets)[number]["id"];
