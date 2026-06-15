# CalTrackR

An AI calorie scanner. Upload or photograph a meal and get an estimate of its
food name, calories, and macros (protein / carbs / fat) with a confidence score.

Built with **Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn-style UI**.
The AI layer ships with a mock provider so the whole app works end-to-end before
any API keys exist.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — defaults to the mock provider
npm run dev
```

Open http://localhost:3000.

## How it works

Upload, drag-and-drop, or capture a photo → `analyzeFood(image)` runs → results
render in a card. The scanner card doubles as a viewfinder: corner brackets frame
the image and a scan-line sweeps across it while the model "analyzes."

## Swapping in a real vision model

The UI only ever calls one function — `analyzeFood(image)` in
`src/lib/ai/analyzeFood.ts`. It picks a provider from the registry based on
`NEXT_PUBLIC_AI_PROVIDER` (`mock` | `openai` | `gemini` | `claude`).

Every provider returns the same `FoodAnalysis` shape (`src/lib/ai/types.ts`), so
nothing in the UI changes when you switch. To go live:

1. Add a server route (e.g. `src/app/api/analyze/route.ts`) that holds your API
   key server-side, forwards the image to the vision model, and asks it to reply
   with JSON matching `FoodAnalysis`.
2. Fill in the matching stub in `src/lib/ai/providers/` to POST the image to that
   route.
3. Set `NEXT_PUBLIC_AI_PROVIDER` to that provider.

Keep API keys server-side only — never expose them to the client bundle.

## Project structure

```
src/
  app/
    layout.tsx          Root layout, fonts, metadata
    page.tsx            Scan state machine (idle → analyzing → done / error)
    globals.css         Tokens, canvas gradient, base styles
  components/
    Header.tsx
    UploadCard.tsx      Viewfinder: drag & drop, file + camera inputs, preview
    ScanButton.tsx
    FoodResultsCard.tsx Calorie readout + calorie-weighted macro bar + tiles
    LoadingState.tsx    Scan-line overlay
    ErrorState.tsx
    ui/                 button.tsx, card.tsx (shadcn-style, brand-tuned)
  lib/
    utils.ts            cn()
    ai/
      types.ts          FoodAnalysis, FoodAnalyzer, ProviderName
      analyzeFood.ts    Provider registry + selector (the only entry point)
      providers/        mockProvider + openai/gemini/claude stubs
```

## Design notes

- Mint canvas, forest-green ink, a single grocery-green action color, and lime
  reserved only for the scan reticle.
- Space Grotesk (display) · Inter (body) · JetBrains Mono (numeric readouts).
- Macro bar widths reflect each macro's share of total calories (4/4/9 kcal/g),
  not raw grams.
