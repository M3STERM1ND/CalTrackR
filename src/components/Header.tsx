export function Header() {
  return (
    <header className="mb-7 text-center sm:mb-10">
      <div className="mb-3.5 inline-flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/caltrackR.png" alt="CalTrackR logo" className="h-10 w-10 object-contain" />
        <span className="font-display text-[clamp(30px,7vw,40px)] font-bold leading-none tracking-[-0.02em]">
          CalTrack<span className="text-leaf">R</span>
        </span>
      </div>
      <p className="text-[15px] font-normal tracking-[0.01em] text-black">
        Track your calorie intake and macros in seconds.
      </p>
    </header>
  );
}
