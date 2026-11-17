import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SITE } from "../data/content";
import { Fade } from "./Reveal";
import { scrollToTarget } from "../lib/scroll";
import { useReducedMotion } from "../hooks/useReducedMotion";
import Crosshair from "./Crosshair";
import VectorTechText from "./VectorTechText";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  /** flip to true when the splash curtain starts lifting */
  play: boolean;
}

export function Hero({ play }: HeroProps) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* subtle background parallax drift on scroll */
  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-bg-img", {
        y: 60,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink"
      aria-label="Introduction"
    >
      {/* ── Cinematic AI Landscape Background (subject on right) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="hero-bg-img h-full w-full object-cover object-right md:object-right opacity-65 transition-opacity duration-1000 scale-105"
        />
        {/* Left-to-right gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 via-45% to-transparent" />
        {/* Top gradient for navbar blend */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent opacity-90" />
        {/* Bottom gradient to blend seamlessly into ticker */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
        {/* Subtle coordinate grid overlay */}
        <div className="grid-bg absolute inset-0 opacity-25 mix-blend-overlay" />
      </div>

      <Crosshair
        containerRef={section}
        color="#e85223"
        targetEffect="lock"
        thickness={1}
        opacity={0.8}
        smoothing={0.28}
        showCoordinates
      />

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-5 pt-28 pb-16 md:px-10">

        <h1 className="sr-only">We design the digital. We build what&rsquo;s next.</h1>
        <VectorTechText />

        <Fade immediate play={play} delay={0.72}>
          <p className="mt-10 max-w-md text-base leading-relaxed text-fog md:mt-14 md:text-lg">
            {SITE.description}
          </p>
        </Fade>

        <Fade immediate play={play} delay={0.88}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row md:mt-14">
            <button
              onClick={() => scrollToTarget("#contact")}
              className="group flex items-center justify-center gap-3 border border-ember bg-ember px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-ember"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button
              onClick={() => scrollToTarget("#work")}
              className="group flex items-center justify-center gap-3 border border-line px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:border-paper"
            >
              Explore work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/** The ORIGIN mark at scale — a focal point slowly orbiting a coordinate plane. */
export function OriginRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      <g className="origin-center animate-[spin-slow_48s_linear_infinite]">
        <circle
          cx="100"
          cy="100"
          r="96"
          stroke="rgba(245,240,234,0.14)"
          strokeWidth="0.75"
          strokeDasharray="2 5"
        />
        <circle cx="100" cy="4" r="3" fill="#e85223" />
      </g>
      <circle cx="100" cy="100" r="64" stroke="rgba(245,240,234,0.12)" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="34" stroke="rgba(232,82,35,0.5)" strokeWidth="1" />
      <line x1="100" y1="86" x2="100" y2="114" stroke="rgba(245,240,234,0.35)" strokeWidth="0.75" />
      <line x1="86" y1="100" x2="114" y2="100" stroke="rgba(245,240,234,0.35)" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="9" fill="#e85223" />
    </svg>
  );
}
