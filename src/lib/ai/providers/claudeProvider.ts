import { NonFoodImageError, type FoodAnalyzer } from "@/lib/ai/types";

export const claudeProvider: FoodAnalyzer = async (image, description) => {
  const body = new FormData();
  body.append("image", image);
  if (description) body.append("description", description);

  const res = await fetch("/api/analyze", { method: "POST", body });

  if (res.status === 422) throw new NonFoodImageError();

  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(`Analysis failed (${res.status}): ${msg.error ?? "unknown"}`);
  }

  return res.json();
};
