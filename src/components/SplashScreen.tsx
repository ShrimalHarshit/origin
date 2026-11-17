import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Mark } from "./Mark";
import { lockScroll, unlockScroll } from "../lib/scroll";

gsap.registerPlugin(useGSAP);

interface SplashScreenProps {
  /** Fired the moment the curtain starts sliding up — start the hero reveal. */
  onReveal: () => void;
  /** Fired when the exit animation has fully completed. */
  onComplete: () => void;
}

const STATUS_LINES: [number, string][] = [
  [0, "> LOADING TYPE + MOTION"],
  [34, "> COMPOSING INTERFACE"],
  [72, "> FINAL CHECKS"],
  [100, "> READY"],
];

/**
 * ORIGIN splash screen — dark curtain, 0→100 counter, power4.inOut slide-up
 * exit with the hero revealing underneath. Scoped + cleaned up via useGSAP.
 */
export function SplashScreen({ onReveal, onComplete }: SplashScreenProps) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const suffix = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* lock the document while loading */
      lockScroll();
      document.body.style.overflow = "hidden";

      const value = { pct: 0 };
      const statusEl = status.current;

      const tl = gsap.timeline({
        onComplete: () => {
          /* restore scrolling, then hand control back to the app */
          unlockScroll();
          document.body.style.overflow = "";
          onComplete();
        },
      });

      /* 1 — count 0% → 100% */
      tl.to(value, {
        pct: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.max(0, Math.min(100, Math.round(value.pct)));
          if (counter.current) counter.current.textContent = String(v).padStart(3, "0");
          if (suffix.current)
            suffix.current.style.opacity = v >= 100 ? "1" : "0.45";
          if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
          if (statusEl) {
            const [, line] =
              STATUS_LINES.reduce<[number, string]>(
                (best, cur) => (v >= cur[0] ? cur : best),
                STATUS_LINES[0]
              ) ?? STATUS_LINES[0];
            if (statusEl.textContent !== line) statusEl.textContent = line;
          }
        },
      });

      /* 2 — soft tick at 100%: inner content lifts out */
      tl.to(
        [inner.current, ".splash-meta"],
        { y: -48, opacity: 0, duration: 0.45, ease: "power3.in" },
        "+=0.18"
      );

      /* 3 — curtain exits; the hero reveal fires in sync */
      tl.add(() => onReveal());
      tl.to(panel.current, { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, "<");

      return () => {
        /* unmount / HMR safety: kill the timeline and restore scroll */
        tl.kill();
        unlockScroll();
        document.body.style.overflow = "";
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={panel}
        className="grid-bg pointer-events-auto flex h-full w-full flex-col justify-between bg-ink"
      >
        {/* top edge */}
        <div className="splash-meta flex items-center justify-between px-5 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-fog md:px-10 md:pt-8">
          <span className="flex items-center gap-3">
            <Mark className="h-5 w-5 text-paper" />
            <span className="text-paper">Origin</span>
          </span>
          <span className="hidden sm:block">Splash / 001</span>
        </div>

        {/* center counter */}
        <div ref={inner} className="flex flex-col items-center gap-5 px-5">
          <p className="flex items-start font-display font-bold leading-none tracking-[-0.03em] text-paper">
            <span
              ref={counter}
              className="tabular-nums text-[clamp(6rem,24vw,17rem)]"
            >
              000
            </span>
            <span
              ref={suffix}
              className="mt-4 text-[clamp(1.5rem,5vw,3.5rem)] text-ember opacity-45 md:mt-7"
            >
              %
            </span>
          </p>
          <p
            ref={status}
            className="font-mono text-[10px] uppercase tracking-[0.34em] text-fog md:text-[11px]"
          >
            &gt; LOADING TYPE + MOTION
          </p>
        </div>

        {/* bottom edge */}
        <div className="splash-meta px-5 pb-6 md:px-10 md:pb-8">
          <div className="mb-5 h-px w-full bg-line">
            <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-ember" />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            <span>Design × Engineering</span>
            <span>
              Hold still — <span className="text-ember">beginning</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
