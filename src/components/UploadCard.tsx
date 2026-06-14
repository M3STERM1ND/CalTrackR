"use client";

import { useRef, useState, type DragEvent } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanButton } from "@/components/ScanButton";
import { LoadingState } from "@/components/LoadingState";
import { CameraModal } from "@/components/CameraModal";

export type ScanStatus = "idle" | "analyzing" | "done" | "error";

interface UploadCardProps {
  status: ScanStatus;
  imageUrl: string | null;
  onFile: (file: File) => void;
  onReset: () => void;
}

export function UploadCard({ status, imageUrl, onFile, onReset }: UploadCardProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const fallbackCameraInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const pickFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  function handleCameraCapture(file: File) {
    setCameraOpen(false);
    onFile(file);
  }

  function openCamera() {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      setCameraOpen(true);
    } else {
      fallbackCameraInput.current?.click();
    }
  }

  const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
    const base = "pointer-events-none absolute h-[26px] w-[26px] border-[2.5px] border-leaf transition-opacity";
    const corners: Record<string, string> = {
      tl: "left-3 top-3 rounded-tl-lg border-b-0 border-r-0",
      tr: "right-3 top-3 rounded-tr-lg border-b-0 border-l-0",
      bl: "bottom-3 left-3 rounded-bl-lg border-r-0 border-t-0",
      br: "bottom-3 right-3 rounded-br-lg border-l-0 border-t-0",
    };
    return <div className={`${base} ${corners[pos]} ${dragging ? "opacity-100" : "opacity-[0.55]"}`} />;
  };

  const hasImage = Boolean(imageUrl);

  return (
    <>
      {cameraOpen && (
        <CameraModal onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />
      )}

      <div
        className={`relative rounded-xl bg-card p-3.5 shadow-card transition-transform ${dragging ? "-translate-y-0.5" : ""}`}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={handleDrop}
      >
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />

        <div
          className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] text-center transition-colors ${
            hasImage ? "bg-[#0c1410]" : dragging ? "bg-[#F0FAEF]" : "bg-[linear-gradient(180deg,#FBFDFB_0%,#F1F7F2_100%)]"
          }`}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl!} alt="Food preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-[18px] px-6 py-8">
              <div className="grid size-[60px] place-items-center rounded-full bg-secondary text-leaf">
                <Camera className="size-[30px]" strokeWidth={1.8} />
              </div>
              <h2 className="font-display text-[19px] font-semibold tracking-[-0.01em]">
                Scan a plate of food or a drink
              </h2>
              <p className="-mt-2 text-[13.5px] text-ink-muted">
                Drag an image here, or use your camera
              </p>
              <ScanButton
                onPick={() => fileInput.current?.click()}
                onCamera={openCamera}
              />
              <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-muted">
                JPG · PNG · WEBP · up to 10MB
              </div>
            </div>
          )}

          {status === "analyzing" && <LoadingState />}
        </div>

        {hasImage && status !== "analyzing" && (
          <div className="flex justify-end px-1 pb-0.5 pt-2.5">
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw />
              Scan another
            </Button>
          </div>
        )}

        <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={pickFromEvent} />
        <input
          ref={fallbackCameraInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={pickFromEvent}
        />
      </div>
    </>
  );
}
