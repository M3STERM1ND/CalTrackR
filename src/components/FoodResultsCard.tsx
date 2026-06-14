"use client";

import { RotateCcw } from "lucide-react";
import type { FoodAnalysis } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FoodResultsCardProps {
  data: FoodAnalysis;
  onRescan: () => void;
}

const MACROS = [
  { key: "protein", label: "Protein", color: "#3B6FE0", kcalPerGram: 4 },
  { key: "carbs", label: "Carbs", color: "#E8A93B", kcalPerGram: 4 },
  { key: "fat", label: "Fat", color: "#E2664A", kcalPerGram: 9 },
] as const;

export function FoodResultsCard({ data, onRescan }: FoodResultsCardProps) {
  const calsFromMacro = MACROS.map((m) => data[m.key] * m.kcalPerGram);
  const totalMacroCals = calsFromMacro.reduce((a, b) => a + b, 0) || 1;

  return (
    <Card className="mt-4 animate-rise p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
            Nutrition estimate
          </div>
          {data.foodName && (
            <h3 className="font-display text-[22px] font-semibold tracking-[-0.015em]">
              {data.foodName}
            </h3>
          )}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary px-2.5 py-1.5 text-xs font-semibold text-leaf-press">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
          {data.confidence}% confident
        </span>
      </div>

      <div className="my-5 flex items-baseline gap-2">
        <span className="font-mono text-[46px] font-bold leading-none tracking-[-0.02em]">
          {data.calories.toLocaleString()}
        </span>
        <span className="font-mono text-[15px] font-medium text-ink-muted">kcal estimated</span>
      </div>

      <div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-[#EEF3EF]" aria-hidden="true">
        {MACROS.map((m, i) => (
          <span
            key={m.key}
            className="block h-full transition-[width] duration-700"
            style={{
              width: `${(calsFromMacro[i] / totalMacroCals) * 100}%`,
              background: m.color,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {MACROS.map((m) => (
          <div key={m.key} className="rounded-[14px] border border-line p-3.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: m.color }} />
              {m.label}
            </div>
            <div className="font-mono text-[21px] font-bold tracking-[-0.01em]">
              {data[m.key]}
              <span className="ml-0.5 text-xs font-medium text-ink-muted">g</span>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-5 w-full" onClick={onRescan}>
        <RotateCcw />
        Scan another meal
      </Button>
    </Card>
  );
}
