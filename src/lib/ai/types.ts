/**
 * Shared shape every vision provider must return.
 * Keeping this in one place means the UI never depends on a specific provider.
 */
export interface FoodAnalysis {
  foodName?: string;
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  confidence: number; // 0–100
}

/** A provider takes an image file and an optional description, resolves to a FoodAnalysis. */
export type FoodAnalyzer = (image: File, description?: string) => Promise<FoodAnalysis>;

export type ProviderName = "mock" | "openai" | "gemini" | "claude";

export class NonFoodImageError extends Error {
  constructor() {
    super("The uploaded image does not appear to contain food.");
    this.name = "NonFoodImageError";
  }
}

export function isNonFoodImageError(error: unknown): error is NonFoodImageError {
  return error instanceof NonFoodImageError;
}
