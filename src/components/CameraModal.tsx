"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface CameraModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setReady(true);
        }
      })
      .catch(() => setError("Camera access denied. Please allow camera permissions and try again."));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onCapture(new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 sm:items-center">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-t-2xl bg-black sm:rounded-2xl">
        <button
          onClick={onClose}
          aria-label="Close camera"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
        >
          <X className="size-5" />
        </button>

        {error ? (
          <div className="flex min-h-[240px] items-center justify-center p-8 text-center text-sm text-white/80">
            {error}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-[4/3] w-full bg-black object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-center px-4 py-5">
              <button
                onClick={capture}
                disabled={!ready}
                aria-label="Take photo"
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 text-white transition hover:bg-white/30 active:scale-95 disabled:opacity-40"
              >
                <Camera className="size-7" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
