import { NonFoodImageError, type FoodAnalysis, type FoodAnalyzer } from "@/lib/ai/types";

const SAMPLES: FoodAnalysis[] = [
  { foodName: "Cheeseburger", calories: 450, protein: 25, carbs: 35, fat: 22, confidence: 92 },
  { foodName: "Avocado toast", calories: 290, protein: 8, carbs: 30, fat: 16, confidence: 88 },
  { foodName: "Grilled salmon bowl", calories: 520, protein: 38, carbs: 42, fat: 21, confidence: 90 },
  { foodName: "Caesar salad", calories: 360, protein: 14, carbs: 18, fat: 27, confidence: 84 },
  { foodName: "Margherita pizza", calories: 620, protein: 24, carbs: 78, fat: 22, confidence: 91 },
];

const NON_FOOD_HINTS = [
  "car",
  "cat",
  "dog",
  "document",
  "face",
  "house",
  "landscape",
  "person",
  "receipt",
  "screenshot",
  "selfie",
  "shoe",
];

function looksObviouslyNonFood(image: File) {
  const normalizedName = image.name.toLowerCase();
  return NON_FOOD_HINTS.some((hint) => normalizedName.includes(hint));
}

/**
 * Pretends to call a vision model. Adds latency so the scanning animation is
 * visible, and occasionally fails so error handling can be exercised.
 */
export const mockProvider: FoodAnalyzer = (image, _description) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (looksObviouslyNonFood(image)) {
        reject(new NonFoodImageError());
        return;
      }
      if (Math.random() < 0.08) {
        reject(new Error("Mock provider: simulated model timeout"));
        return;
      }
      resolve(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);
    }, 2100);
  });
