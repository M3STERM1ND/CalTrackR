"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: "signin" | "signup" =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  function switchMode() {
    setError(null);
    setMessage(null);
    router.push(mode === "signin" ? "/login?mode=signup" : "/login");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.replace("/");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data.user || data.user.identities?.length === 0) {
        setError("Email already registered.");
        setLoading(false);
        return;
      }
      setMessage("Check your email for a confirmation link, then sign in.");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/caltrackR.png" alt="CalTrackR" className="h-16 w-16 object-contain" />
          <h1 className="font-display text-[32px] font-bold leading-none tracking-[-0.02em]">
            CalTrack<span className="text-leaf">R</span>
          </h1>
          <p className="text-[14px] text-ink-soft">Track your calorie intake and macros in seconds.</p>
        </div>

        <div className="rounded-2xl bg-card p-7 shadow-card">
          <h2 className="mb-5 font-display text-[20px] font-semibold">
            {mode === "signin" ? "Sign in to your account" : "Create an account"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-widest text-ink-muted">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-line bg-[#fafafa] px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-muted focus:border-leaf focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-widest text-ink-muted">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-line bg-[#fafafa] px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-muted focus:border-leaf focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-[#FFF4F2] px-3.5 py-2.5 text-[13px] text-[#c0392b]">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-lg bg-secondary px-3.5 py-2.5 text-[13px] text-leaf-press">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-11 w-full rounded-lg bg-leaf font-semibold text-white transition hover:bg-leaf-press disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-ink-soft">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              className="font-semibold text-leaf hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
