/** Nutrition values for one serving unless a caller has explicitly aggregated them. */
export interface NutritionFacts {
  readonly calories: number;
  readonly protein: number;
  readonly carbs: number;
  readonly fat: number;
  readonly fiber: number;
  readonly sugar: number;
}

export type NutritionMetric = keyof NutritionFacts;

export type DietaryPreference = "vegan" | "vegetarian" | "non-vegetarian";

export type KnownAllergen =
  | "dairy"
  | "eggs"
  | "fish"
  | "gluten"
  | "peanuts"
  | "sesame"
  | "shellfish"
  | "soy"
  | "tree-nuts";

export type FoodCategory =
  | "bowl"
  | "breakfast"
  | "drink"
  | "main"
  | "salad"
  | "side"
  | "snack"
  | "wrap";

export type SpiceLevel = "mild" | "medium" | "hot";

export interface FoodItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: FoodCategory;
  readonly cuisine: string;
  readonly diet: DietaryPreference;
  readonly allergens: readonly KnownAllergen[];
  readonly price: number;
  readonly nutrition: NutritionFacts;
  readonly servingSize: string;
  readonly tags: readonly string[];
  readonly spiceLevel: SpiceLevel;
  readonly prepTimeMinutes: number;
  readonly rating: number;
  readonly reviewCount: number;
  /** Stable key resolved by the UI's image registry or image CDN adapter. */
  readonly imageKey: string;
  readonly available: boolean;
  readonly restaurantId?: string;
  readonly restaurantName?: string;
  readonly restaurantSlug?: string;
  readonly categoryId?: string;
  readonly categoryName?: string;
}

export type NutritionTargets = Partial<NutritionFacts>;
export type NutritionWeights = Partial<Record<NutritionMetric, number>>;

export interface NutritionGoal {
  readonly id?: string;
  readonly name?: string;
  /** Every provided target must be a finite number greater than zero. */
  readonly targets: NutritionTargets;
  /** Relative importance; omitted metrics use the engine defaults. */
  readonly weights?: NutritionWeights;
  /** Default acceptable relative deviation. `0.1` means +/-10%. */
  readonly defaultTolerance?: number;
  /** Per-metric tolerance overrides. */
  readonly tolerance?: Partial<Record<NutritionMetric, number>>;
  /** A hard ceiling, useful when calories are not an exact target. */
  readonly calorieCeiling?: number;
}

export interface RecommendationFilters {
  readonly dietaryPreference?: DietaryPreference;
  readonly excludedAllergens?: readonly KnownAllergen[];
  readonly cuisines?: readonly string[];
  readonly requiredTags?: readonly string[];
  /** Applied to the whole candidate, including the combined price of a combo. */
  readonly maxPrice?: number;
  readonly maxPrepTimeMinutes?: number;
}

export interface MetricMatch {
  readonly metric: NutritionMetric;
  readonly target: number;
  readonly actual: number;
  /** Signed value: positive is over target and negative is under target. */
  readonly difference: number;
  readonly relativeDifference: number;
  readonly tolerance: number;
  readonly weight: number;
  readonly accuracy: number;
  readonly withinTolerance: boolean;
}

export interface NutritionMatchScore {
  /** Target match from 0 to 100. */
  readonly score: number;
  readonly matchesGoal: boolean;
  readonly metrics: readonly MetricMatch[];
}

interface RecommendationBase {
  readonly id: string;
  readonly items: readonly FoodItem[];
  readonly nutrition: NutritionFacts;
  readonly price: number;
  readonly score: number;
  readonly matchesGoal: boolean;
  readonly metricMatches: readonly MetricMatch[];
  readonly reasons: readonly string[];
}

export interface SingleRecommendation extends RecommendationBase {
  readonly kind: "single";
  readonly items: readonly [FoodItem];
}

export interface ComboRecommendation extends RecommendationBase {
  readonly kind: "combo";
  readonly items: readonly [FoodItem, FoodItem];
}

export type FoodRecommendation = SingleRecommendation | ComboRecommendation;

export interface RecommendationRequest {
  readonly items: readonly FoodItem[];
  readonly goal: NutritionGoal;
  readonly filters?: RecommendationFilters;
  readonly includeCombos?: boolean;
  /** Maximum size of the mixed, ranked result. Defaults to 8. */
  readonly limit?: number;
  /** Limits pair generation to the best eligible singles. Defaults to 18. */
  readonly comboPoolSize?: number;
}

export interface RecommendationResult {
  readonly recommendations: readonly FoodRecommendation[];
  readonly singles: readonly SingleRecommendation[];
  readonly combos: readonly ComboRecommendation[];
  readonly eligibleItemCount: number;
  readonly goal: NutritionGoal;
}

export interface CartLine {
  readonly item: FoodItem;
  readonly quantity: number;
}

export interface Cart {
  readonly id: string;
  readonly lines: readonly CartLine[];
  readonly updatedAt: string;
}

export interface CartSummary {
  readonly lines: readonly CartLine[];
  readonly itemCount: number;
  readonly subtotal: number;
  readonly nutrition: NutritionFacts;
}

export type RewardTierName = "bronze" | "silver" | "gold" | "platinum";

export type RewardLedgerType = "earn" | "redeem";

export type RewardLedgerReason =
  | "order"
  | "goal-bonus"
  | "streak-bonus"
  | "referral"
  | "discount-redemption"
  | "free-meal-redemption"
  | "manual-adjustment";

export interface RewardLedgerEntry {
  readonly id: string;
  readonly type: RewardLedgerType;
  /** Stored as a positive magnitude; `type` determines balance direction. */
  readonly points: number;
  readonly reason: RewardLedgerReason;
  readonly createdAt: string;
  readonly orderId?: string;
  readonly note?: string;
}

export interface RewardAccount {
  readonly availablePoints: number;
  readonly lifetimePoints: number;
  readonly streakDays: number;
  readonly tier: RewardTierName;
  readonly ledger: readonly RewardLedgerEntry[];
}

export interface RewardTierStatus {
  readonly tier: RewardTierName;
  readonly minimumPoints: number;
  readonly nextTier: RewardTierName | null;
  readonly nextTierAt: number | null;
  /** Progress through the current tier toward the next, from 0 to 100. */
  readonly progressPercent: number;
  readonly pointsToNextTier: number;
  readonly perks: readonly string[];
}

export interface RewardCalculationInput {
  readonly orderSubtotal: number;
  readonly nutrition: NutritionFacts;
  readonly goal?: NutritionGoal;
  readonly streakDays?: number;
  readonly lifetimePoints?: number;
}

export interface RewardCalculation {
  readonly basePoints: number;
  readonly goalMatched: boolean;
  readonly goalBonus: number;
  readonly streakMultiplier: number;
  readonly pointsEarned: number;
  readonly lifetimePointsAfterOrder: number;
  readonly tierBeforeOrder: RewardTierStatus;
  readonly tierAfterOrder: RewardTierStatus;
  readonly tierChanged: boolean;
}
