export function LoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-[rgba(12,20,16,0.28)] backdrop-blur-[1px]">
      <div
        className="absolute left-0 right-0 h-0.5 animate-sweep bg-[linear-gradient(90deg,transparent,#B6E84B,transparent)] shadow-[0_0_14px_2px_rgba(182,232,75,0.7)]"
        aria-hidden="true"
      />
      <div className="z-[2] inline-flex items-center gap-2.5 rounded-full bg-[rgba(12,20,16,0.5)] px-3.5 py-2 font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-white">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" />
        Analyzing food
      </div>
    </div>
  );
}
