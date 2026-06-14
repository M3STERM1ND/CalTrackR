"use client";

import { Camera, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanButtonProps {
  onPick: () => void;
  onCamera: () => void;
}

export function ScanButton({ onPick, onCamera }: ScanButtonProps) {
  return (
    <div className="flex gap-2.5">
      <Button onClick={onPick}>
        <ImageUp />
        Upload photo
      </Button>
      <Button variant="ghost" onClick={onCamera}>
        <Camera />
        Camera
      </Button>
    </div>
  );
}
