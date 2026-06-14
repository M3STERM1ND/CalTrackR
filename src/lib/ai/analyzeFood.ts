import type { FoodAnalysis, ProviderName } from "@/lib/ai/types";
import { mockProvider } from "@/lib/ai/providers/mockProvider";
import { openaiProvider } from "@/lib/ai/providers/openaiProvider";
import { geminiProvider } from "@/lib/ai/providers/geminiProvider";
import { claudeProvider } from "@/lib/ai/providers/claudeProvider";

const REGISTRY = {
  mock: mockProvider,
  openai: openaiProvider,
  gemini: geminiProvider,
  claude: claudeProvider,
} as const;

function selectedProvider(): ProviderName {
  const fromEnv = process.env.NEXT_PUBLIC_AI_PROVIDER as ProviderName | undefined;
  return fromEnv && fromEnv in REGISTRY ? fromEnv : "gemini";
}

/**
 * The single function the UI calls. Swap providers via NEXT_PUBLIC_AI_PROVIDER
 * (or by editing the registry) without touching any component.
 */
export function analyzeFood(image: File, description?: string): Promise<FoodAnalysis> {
  return REGISTRY[selectedProvider()](image, description);
}
