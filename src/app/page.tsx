"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Header } from "@/components/Header";
import { UploadCard, type ScanStatus } from "@/components/UploadCard";
import { FoodResultsCard } from "@/components/FoodResultsCard";
import { ErrorState } from "@/components/ErrorState";
import { analyzeFood } from "@/lib/ai/analyzeFood";
import { isNonFoodImageError, type FoodAnalysis } from "@/lib/ai/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 10 * 1024 * 1024;

function compressToThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_W = 480;
      const MAX_H = 360;
      const ratio = Math.min(MAX_W / img.width, MAX_H / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(blobUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
}

interface ErrorInfo {
  title: string;
  message: string;
}

export default function Home() {
  const { user } = useAuth();

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);

  function reset() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setStatus("idle");
    setImageUrl(null);
    setSelectedFile(null);
    setDescription("");
    setResult(null);
    setError(null);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError({ title: "That file isn't an image", message: "Upload a JPG, PNG, or WEBP photo of your food." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setError({ title: "Image is too large", message: "Keep it under 10 MB and try again." });
      return;
    }
    setError(null);
    setResult(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    setStatus("idle");
  }

  async function saveScan(file: File, data: FoodAnalysis) {
    if (!user) return;
    try {
      const image_data = await compressToThumbnail(file);
      const { error: insertErr } = await supabase.from("scan_history").insert({
        user_id: user.id,
        image_data,
        description: description.trim() || null,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        confidence: data.confidence,
      });
      if (insertErr) console.error("Failed to save scan:", insertErr.message);
    } catch (e) {
      console.error("Failed to save scan:", e);
    }
  }

  async function handleAnalyze() {
    if (!selectedFile) return;
    setStatus("analyzing");
    setError(null);
    try {
      const data = await analyzeFood(selectedFile, description.trim() || undefined);
      setResult(data);
      setStatus("done");
      saveScan(selectedFile, data);
    } catch (err) {
      setStatus("error");
      if (isNonFoodImageError(err)) {
        setError({ title: "Please upload a food photo", message: "That image does not look like food. Try a clear photo of a meal, snack, or drink." });
        return;
      }
      setError({ title: "Couldn't analyze that photo", message: "The model didn't respond. Check your connection and scan again." });
    }
  }

  const imageSelected = Boolean(selectedFile) && status === "idle";
  const analyzing = status === "analyzing";

  return (
    <main className="mx-auto flex w-full max-w-[580px] flex-col px-[18px] pb-16 pt-[clamp(20px,5vw,56px)]">
      <Header />

      <UploadCard status={status} imageUrl={imageUrl} onFile={handleFile} onReset={reset} />

      {!analyzing && status !== "done" && (
        <div className="mt-3 rounded-xl bg-card p-4 shadow-card">
          <label htmlFor="meal-description" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Describe your meal{" "}
            <span className="normal-case font-normal tracking-normal text-ink-muted">(optional)</span>
          </label>
          <textarea
            id="meal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. large bowl of ramen with pork belly, two soft-boiled eggs, and noodles"
            rows={2}
            maxLength={300}
            className="mt-2 w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-ink placeholder:text-ink-muted focus:outline-none"
          />
          {description.length > 0 && (
            <div className="mt-1 text-right text-[11px] text-ink-muted">{description.length}/300</div>
          )}
        </div>
      )}

      {imageSelected && (
        <Button className="mt-3 w-full" onClick={handleAnalyze}>
          <ScanLine /> Analyze Photo
        </Button>
      )}

      {status === "done" && result && <FoodResultsCard data={result} onRescan={reset} />}

      {error && <ErrorState title={error.title} message={error.message} onRetry={reset} />}

      <footer className="mt-7 text-center text-xs text-black font-bold">
        Nutrition estimates are AI-generated and may not be 100% accurate.
        <div className="mt-1 font-normal text-ink-muted">&copy; 2026 CalTrackR. All rights reserved.</div>
      </footer>
    </main>
  );
}
