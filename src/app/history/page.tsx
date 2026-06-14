"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase, type ScanRecord } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

const MACROS = [
  { key: "protein" as const, label: "Protein", color: "#3B6FE0" },
  { key: "carbs"   as const, label: "Carbs",   color: "#E8A93B" },
  { key: "fat"     as const, label: "Fat",      color: "#E2664A" },
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function HistoryPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("scan_history")
      .select("*")
      .order("scanned_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setScans(data as ScanRecord[]);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-ink-soft">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[580px] px-[18px] pb-16 pt-[clamp(20px,5vw,48px)]">
      {/* Header row */}
      <div className="mb-7 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold text-leaf transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="size-3.5" /> Back to scanner
        </button>
        <button
          onClick={async () => { await signOut(); router.replace("/login"); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold text-leaf transition-opacity hover:opacity-80"
        >
          Sign out
        </button>
      </div>

      <h1 className="mb-6 font-display text-[26px] font-bold tracking-[-0.015em]">
        Scan history
      </h1>

      {scans.length === 0 ? (
        <div className="rounded-xl bg-card p-8 text-center shadow-card">
          <p className="text-[15px] text-ink-soft">No scans yet. Go scan your first meal!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {scans.map((scan) => {
            const { date, time } = formatDateTime(scan.scanned_at);
            return (
              <div key={scan.id} className="overflow-hidden rounded-xl bg-card shadow-card">
                {/* Food image */}
                {scan.image_data && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={scan.image_data}
                    alt="Food scan"
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  {/* Date + time + confidence */}
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{date}</p>
                      <p className="text-[12px] text-ink-muted">{time}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-leaf-press">
                      <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                      {scan.confidence}% confident
                    </span>
                  </div>

                  {/* Optional description */}
                  {scan.description && (
                    <p className="mb-3 text-[13px] italic text-ink-soft">"{scan.description}"</p>
                  )}

                  {/* Calories */}
                  <div className="mb-3 flex items-baseline gap-1.5">
                    <span className="font-mono text-[38px] font-bold leading-none tracking-tight">
                      {scan.calories.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-ink-muted">kcal</span>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-2">
                    {MACROS.map((m) => (
                      <div key={m.key} className="rounded-lg border border-line p-2.5">
                        <div className="mb-1 flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                          <span className="h-2 w-2 rounded-[3px]" style={{ background: m.color }} />
                          {m.label}
                        </div>
                        <span className="font-mono text-[17px] font-bold">
                          {scan[m.key]}
                          <span className="ml-0.5 text-[10px] font-medium text-ink-muted">g</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
