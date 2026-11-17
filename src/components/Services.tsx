import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SERVICES } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { Fade } from "./Reveal";
import { cn } from "../utils/cn";

export function Services() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section id="services" className="grid-bg-light relative bg-cream py-28 text-coal md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionHeader
          tone="light"
          index="02"
          label="Services"
          lines={[
            "Pixel to",
            <>
              <span className="text-ember">production.</span>
            </>,
          ]}
        />

        <div className="mt-20 border-t border-line-dark md:mt-32">
          {SERVICES.map((service, i) => {
            const isOpen = open === i;
            return (
              <Fade key={service.index} delay={i * 0.04} y={20}>
                <div
                  className={cn(
                    "group border-b border-line-dark transition-colors duration-500",
                    isOpen ? "bg-coal text-paper" : "hover:bg-cream-2"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`service-panel-${i}`}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-1 py-7 text-left md:grid-cols-[110px_1fr_auto] md:gap-8 md:py-10"
                  >
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors md:text-sm",
                        isOpen ? "text-ember" : "text-smoke group-hover:text-ember"
                      )}
                    >
                      /{service.index}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block font-display font-semibold uppercase leading-tight tracking-[-0.01em] text-[clamp(1.6rem,3.6vw,3rem)]",
                          isOpen ? "text-paper" : "text-coal"
                        )}
                      >
                        {service.title}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block max-w-xl text-sm md:text-[15px]",
                          isOpen ? "text-fog" : "text-smoke"
                        )}
                      >
                        {service.summary}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center border transition-all duration-300",
                        isOpen
                          ? "border-ember bg-ember text-ink"
                          : "border-line-dark text-coal group-hover:border-coal"
                      )}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  {/* expanding detail */}
                  <div
                    id={`service-panel-${i}`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-6 border-t border-line px-1 py-8 md:grid-cols-[110px_1fr] md:gap-8 md:py-10">
                        <span className="hidden font-mono text-xs text-smoke md:block">
                          Includes
                        </span>
                        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-4">
                          {service.includes.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 text-sm text-paper/90 md:text-[15px]"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 bg-ember" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
