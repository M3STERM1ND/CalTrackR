import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ImageBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { type FoodAnalysis } from "@/lib/ai/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

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

  const mediaType = ALLOWED_TYPES.has(file.type)
    ? (file.type as ImageBlockParam["source"] extends { media_type: infer T } ? T : never)
    : "image/jpeg";

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  let raw: string;
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64,
              },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });
    raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  } catch (e) {
    console.error("Anthropic API error:", e);
    return NextResponse.json({ error: "model_error" }, { status: 502 });
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("Failed to parse model output:", raw);
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
