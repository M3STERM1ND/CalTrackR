import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { type FoodAnalysis } from "@/lib/ai/types";

// Bypass SSL verification for corporate/school network proxies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const PROMPT = `You are a precise nutrition analyzer. Look at this image carefully.

Step 1 – Is there real food visible?
- If the image contains NO food (e.g. a person, animal, landscape, document, screenshot), output: {"error":"not_food"}
- If the food is WRAPPED, PACKAGED, or in a sealed container you cannot see through (e.g. chip bags, granola bar wrappers, foil-wrapped items, canned/boxed items showing only the package), output: {"error":"not_food"}
- Only proceed if you can clearly see unwrapped, plainly visible food.

Step 2 – Estimate nutrition for the visible portion.
Base your estimates on:
• The exact food type(s) you see
• The visible portion size (compare against plate, bowl, or standard sizing cues)
• Standard USDA / nutritional database values for that food

Respond with ONLY this JSON and nothing else (no markdown, no code fences):
{"calories":<kcal integer>,"protein":<grams integer>,"carbs":<grams integer>,"fat":<grams integer>,"confidence":<0-100 integer>}`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  const description = formData.get("description");
  const descriptionNote = description
    ? `\n\nUser's note about this meal: "${description}"\nUse this only as supplemental context — the photo is your primary source.`
    : "";

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = (file.type || "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

  let raw: string;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType } },
      PROMPT + descriptionNote,
    ]);
    raw = result.response.text().trim();
  } catch (e) {
    console.error("Gemini API error:", e);
    return NextResponse.json({ error: "model_error" }, { status: 502 });
  }

  // Strip markdown code fences if the model adds them anyway
  const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Gemini output:", raw);
    return NextResponse.json({ error: "parse_error" }, { status: 500 });
  }

  if (parsed.error === "not_food") {
    return NextResponse.json({ error: "not_food" }, { status: 422 });
  }

  const result: FoodAnalysis = {
    calories: Number(parsed.calories) || 0,
    protein: Number(parsed.protein) || 0,
    carbs: Number(parsed.carbs) || 0,
    fat: Number(parsed.fat) || 0,
    confidence: Number(parsed.confidence) || 0,
  };

  return NextResponse.json(result);
}
