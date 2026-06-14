"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Card className="mt-4 flex items-start gap-3.5 animate-rise border border-[#F6D7D0] bg-[#FFF4F2] p-5 shadow-none">
      <AlertCircle className="mt-0.5 size-[22px] shrink-0 text-fat" />
      <div>
        <h4 className="text-[15px] font-semibold">{title}</h4>
        <p className="mt-0.5 text-[13.5px] leading-snug text-ink-soft">{message}</p>
        <Button variant="ghost" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </Card>
  );
}
