import type { FoodAnalyzer } from "@/lib/ai/types";

/**
 * STUB — wire up OpenAI Vision here.
 *
 * Recommended pattern: POST the image to a Next.js route handler
 * (e.g. /api/analyze) that holds OPENAI_API_KEY server-side, calls the
 * Responses/Chat Completions API with an image part, and asks the model to
 * reply with JSON matching FoodAnalysis. Never expose the key to the client.
 */
export const openaiProvider: FoodAnalyzer = async () => {
  throw new Error("openaiProvider not implemented — see lib/ai/providers/openaiProvider.ts");
};
