import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../utils/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface MaskLineProps {
  children: ReactNode;
  className?: string;
  /** delay in seconds once triggered */
  delay?: number;
  /** fire immediately on mount instead of on scroll */
  immediate?: boolean;
  /** gate for immediate animations — runs only once this becomes true */
  play?: boolean;
}

/**
 * Masked line reveal — the inner element rises out of an overflow-hidden
 * container. Used for display headlines across the site.
 */
export function MaskLine({
  children,
  className,
  delay = 0,
  immediate = false,
  play = true,
}: MaskLineProps) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !outer.current || !inner.current) return;
    if (immediate && !play) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: 112, rotate: 2.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.15,
          delay,
          ease: "power4.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: outer.current,
                  start: "top 88%",
                  once: true,
                },
              }),
        }
      );
    }, outer);
    return () => ctx.revert();
  }, [delay, immediate, play, reduced]);

  return (
    <span ref={outer} className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", className)}>
      <span ref={inner} className="block origin-left will-change-transform">
        {children}
      </span>
    </span>
  );
}

interface FadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
  /** gate for immediate animations — runs only once this becomes true */
  play?: boolean;
}

/** Subtle rise-and-fade entrance on scroll. */
export function Fade({
  children,
  className,
  delay = 0,
  y = 32,
  immediate = false,
  play = true,
}: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    if (immediate && !play) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "power3.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 92%",
                  once: true,
                },
              }),
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, y, immediate, play, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
