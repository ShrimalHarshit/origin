import { cn } from "../utils/cn";

/** ORIGIN mark emblem (hidden if unused) */
export function Mark({ className }: { className?: string }) {
  return null;
}

export function Wordmark({ className }: { className?: string }) {
  /* ─────────────────────────────────────────────────────────────
     1. "ORIGIN" STYLING OPTIONS
     Change size, color, or letter-spacing of ORIGIN here:
  ──────────────────────────────────────────────────────────────── */
  const originStyle =
    "font-display text-[26px] md:text-[28px] font-extrabold uppercase tracking-[0.22em] text-paper";

  /* ─────────────────────────────────────────────────────────────
     2. "STUDIO" STYLING OPTIONS
     Change `tracking-[...]` below to adjust STUDIO letter spacing!
     Examples: tracking-[0.2em] (narrower), tracking-[0.32em] (standard), tracking-[0.45em] (wider)
  ──────────────────────────────────────────────────────────────── */
  const studioStyle =
    "absolute top-full left-1 mt-1 font-display text-[8.8px] font-black uppercase tracking-[0.5em] text-ember leading-none";

  return (
    <span className={cn("inline-flex flex-col items-start leading-none select-none", className)}>
      <span className={originStyle}>
        <span>ORI</span>
        <span className="relative inline-flex flex-col">
          <span>GIN</span>
          <span className={studioStyle}>
            STUDIO
          </span>
        </span>
      </span>
    </span>
  );
}
