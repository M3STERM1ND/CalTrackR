"use client";

import { useRouter } from "next/navigation";
import { History, LogIn, LogOut, UserPlus, ScanLine, Info, ImageUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold text-leaf transition-opacity hover:opacity-80"
    >
      {children}
    </button>
  );
}

export function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  return (
    <nav className="relative w-full bg-leaf px-5 py-2.5 flex items-center justify-between shadow-sm">
      {/* Center — app name */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/caltrackR.png" alt="" className="h-6 w-6 object-contain opacity-90" />
        <span className="font-display text-[17px] font-bold tracking-[-0.01em] text-white drop-shadow-sm">
          CalTrack<span className="text-lime">R</span>
        </span>
      </div>
      {/* Left — Scan, History, Learn More */}
      <div className="flex items-center gap-2">
        <NavBtn onClick={() => router.push("/")}>
          <ScanLine className="size-3.5" />
          Scan
        </NavBtn>

        <NavBtn onClick={() => router.push("/history")}>
          <History className="size-3.5" />
          History
        </NavBtn>

        <NavBtn onClick={() => router.push("/learn-more")}>
          <Info className="size-3.5" />
          Learn More
        </NavBtn>
      </div>

      {/* Right — auth buttons */}
      <div className="flex items-center gap-2 min-w-0">
        {!loading && (
          user ? (
            <>
              <span className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold text-leaf max-w-[200px] truncate">
                {user.email}
              </span>
              <NavBtn onClick={async () => { await signOut(); router.refresh(); }}>
                <LogOut className="size-3.5" />
                Sign out
              </NavBtn>
            </>
          ) : (
            <>
              <NavBtn onClick={() => router.push("/login?mode=signup")}>
                <UserPlus className="size-3.5" />
                Sign up
              </NavBtn>
              <NavBtn onClick={() => router.push("/login")}>
                <LogIn className="size-3.5" />
                Sign in
              </NavBtn>
            </>
          )
        )}
      </div>
    </nav>
  );
}
