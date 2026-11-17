import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Project } from "../data/content";
import { lockScroll, unlockScroll, scrollToTarget } from "../lib/scroll";
import { cn } from "../utils/cn";

interface Props {
  project: Project | null;
  onClose: () => void;
}

/** Functional project-detail view — centered modal dialog. */
export function ProjectModal({ project, onClose }: Props) {
  const [rendered, setRendered] = useState<Project | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>(0);

  const handleClose = useCallback(() => {
    unlockScroll();
    onClose();
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setRendered(null), 350);
  }, [onClose]);

  useEffect(() => {
    if (!project) return;
    setRendered(project);
    lockScroll();
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [project, handleClose]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  if (!rendered) return null;
  const open = !!project;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 md:p-8 transition-opacity duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`${rendered.name} — project details`}
    >
      {/* backdrop */}
      <div
        aria-label="Close project details"
        onClick={handleClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-sm cursor-pointer"
      />

      {/* panel - centered dialog */}
      <div
        className={cn(
          "relative z-10 flex h-auto max-h-[92vh] w-full max-w-[760px] flex-col overflow-y-auto border border-line bg-ink shadow-2xl transition-all duration-300 ease-out",
          open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
        data-lenis-prevent="true"
      >
        {/* sticky top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink/95 backdrop-blur-md px-5 py-4 md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
            <span className="text-ember">({rendered.index})</span> {rendered.kind} — {rendered.year}
          </p>
          <button
            ref={closeRef}
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center border border-line text-paper transition-colors hover:border-ember hover:text-ember"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* preview image */}
        <div className="border-b border-line bg-surface">
          <img
            src={rendered.image}
            alt={rendered.alt}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* details body */}
        <div className="flex-1 space-y-8 px-5 py-7 md:px-8 md:py-8">
          {/* centered title section */}
          <div className="text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.32em] text-ember">
              {rendered.category}
            </p>
            <h3 className="font-display text-4xl font-bold uppercase tracking-tight text-paper md:text-5xl">
              {rendered.name}
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-fog md:text-lg">
              {rendered.description}
            </p>
          </div>

          {/* Scope and Stack */}
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            <div className="bg-ink p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Scope
              </p>
              <ul className="space-y-2">
                {rendered.scope.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-sm text-paper">
                    <span className="h-1 w-1 bg-ember" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                Stack
              </p>
              <ul className="space-y-2">
                {rendered.stack.map((s) => (
                  <li key={s} className="font-mono text-[13px] text-paper">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="border-l-2 border-ember pl-4 text-xs leading-relaxed text-fog">
            {rendered.kind} — designed and engineered by ORIGIN to demonstrate the studio&rsquo;s
            approach. No live client data, no borrowed branding.
          </p>
        </div>

        {/* bottom action row with Visit Now button */}
        <div className="sticky bottom-0 z-10 border-t border-line bg-ink/95 backdrop-blur-md px-5 py-4 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={rendered.link || "#"}
              target={rendered.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex flex-1 items-center justify-center gap-2 border border-ember bg-ember py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-transparent hover:text-ember"
            >
              Visit now
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => {
                handleClose();
                window.setTimeout(() => scrollToTarget("#contact"), 420);
              }}
              className="group flex flex-1 items-center justify-center gap-2 border border-line py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:border-paper"
            >
              Build something like this
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
