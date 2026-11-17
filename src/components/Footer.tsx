import { ArrowUp, ArrowUpRight } from "lucide-react";
import { SITE, NAV_LINKS, SOCIALS } from "../data/content";
import { Mark } from "./Mark";
import { scrollToTarget } from "../lib/scroll";

export function Footer() {
  const year = new Date().getFullYear();
  const activeSocials = SOCIALS.filter((s) => s.href.trim().length > 0);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink" aria-label="Footer">
      <div className="mx-auto max-w-[1680px] px-5 pt-16 md:px-10 md:pt-24">
        {/* top row */}
        <div className="flex flex-col justify-between gap-10 pb-14 md:flex-row md:items-start md:pb-20">
          <div className="max-w-md">
            <span className="flex items-center gap-3 text-paper">
              <Mark className="h-7 w-7" />
              <span className="font-display text-2xl font-bold uppercase tracking-[0.22em]">
                Origin
              </span>
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fog">{SITE.altStatement}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-3 md:gap-x-24">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToTarget(`#${link.id}`)}
                className="group flex items-center gap-2 text-left font-mono text-xs uppercase tracking-[0.24em] text-fog transition-colors hover:text-paper"
              >
                <span className="text-[9px] text-smoke group-hover:text-ember">{link.index}</span>
                {link.label}
              </button>
            ))}
            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-ember"
            >
              Email us
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {activeSocials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-fog transition-colors hover:text-paper"
              >
                {s.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </nav>
        </div>

        {/* giant wordmark */}
        <div aria-hidden="true" className="select-none border-t border-line pt-10">
          <p className="text-stroke whitespace-nowrap text-center font-display text-[clamp(4rem,15.5vw,15rem)] font-bold uppercase leading-[0.85] tracking-[0.02em]">
            Origin
          </p>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 font-mono text-[10px] uppercase tracking-[0.24em] text-smoke md:flex-row">
          <p>© {year} {SITE.name}. All rights considered.</p>
          <p className="text-fog">Built with intention. Designed to move things forward.</p>
          <button
            onClick={() => scrollToTarget("#top")}
            className="group flex items-center gap-2 text-fog transition-colors hover:text-ember"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
