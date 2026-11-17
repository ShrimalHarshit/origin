import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/content";
import { Wordmark } from "./Mark";
import { scrollToTarget, lockScroll, unlockScroll } from "../lib/scroll";
import { cn } from "../utils/cn";

export function Nav({ revealed = true }: { revealed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  /* shrink nav + paint border after leaving the top */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active-section indicator */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* menu scroll-lock + escape + focus */
  useEffect(() => {
    if (open) {
      lockScroll();
      closeBtn.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        unlockScroll();
      };
    }
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // small delay so the menu can close before lenis animates
    window.setTimeout(() => scrollToTarget(`#${id}`), open ? 60 : 0);
  };

  return (
    <>
      <a
        href="#work"
        onClick={(e) => {
          e.preventDefault();
          go("work");
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ember focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,opacity,transform] duration-700 ease-out",
          revealed ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
          scrolled || open
            ? "border-b border-line bg-ink/95"
            : "border-b border-transparent bg-transparent"
        )}
      >
        {/* scroll progress */}
        <ScrollProgress />

        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-[72px] md:px-10"
        >
          <button
            onClick={() => scrollToTarget("#top")}
            className="text-paper transition-colors hover:text-ember"
            aria-label="ORIGIN — back to top"
          >
            <Wordmark />
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "group relative flex items-baseline gap-1.5 py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors",
                    active === link.id ? "text-paper" : "text-fog hover:text-paper"
                  )}
                >
                  <span
                    className={cn(
                      "text-[9px] transition-colors",
                      active === link.id ? "text-ember" : "text-smoke group-hover:text-ember"
                    )}
                  >
                    {link.index}
                  </span>
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-ember transition-all duration-500",
                      active === link.id ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go("contact")}
              className="rounded-md group hidden items-center gap-2 border border-ember bg-ember px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-ember sm:flex"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center border border-line text-paper transition-colors hover:border-ember hover:text-ember lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu ─────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          open
            ? "[clip-path:inset(0_0_0%_0)]"
            : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent="true"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Wordmark className="text-paper" />
          <button
            ref={closeBtn}
            className="flex h-10 w-10 items-center justify-center border border-line text-paper transition-colors hover:border-ember hover:text-ember"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-5">
          <ul className="space-y-2">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.id}
                className={cn(
                  "border-b border-line-soft pb-2 transition-all delay-100 duration-700",
                  open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: open ? `${140 + i * 70}ms` : "0ms" }}
              >
                <button
                  onClick={() => go(link.id)}
                  className="group flex w-full items-baseline gap-4 py-3 text-left"
                >
                  <span className="font-mono text-xs text-ember">{link.index}</span>
                  <span className="font-display text-5xl font-semibold uppercase tracking-tight text-paper transition-colors group-hover:text-ember sm:text-6xl">
                    {link.label}
                  </span>
                  <ArrowUpRight className="ml-auto h-6 w-6 text-smoke transition-colors group-hover:text-ember" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-5 pb-10">
          <button
            onClick={() => go("contact")}
            className="flex w-full items-center justify-center gap-2 border border-ember bg-ember py-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-ink transition-colors hover:bg-transparent hover:text-ember"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            Design × Engineering
          </p>
        </div>
      </div>
    </>
  );
}

function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-ember"
    />
  );
}
