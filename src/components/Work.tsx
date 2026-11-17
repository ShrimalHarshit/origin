import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { ProjectModal } from "./ProjectModal";
import { Fade } from "./Reveal";
import { scrollToTarget } from "../lib/scroll";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="work" className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionHeader
          index="01"
          label="Selected work"
          lines={[
            "Proof,",
            <>
              not <span className="text-ember">promises.</span>
            </>,
          ]}
        />

        <div className="mt-20 space-y-20 md:mt-32 md:space-y-28">
          {/* featured */}
          <Fade>
            <ProjectItem project={PROJECTS[0]} onOpen={() => setSelected(PROJECTS[0])} ratio="aspect-[16/9]" />
          </Fade>

          {/* staggered pairs */}
          <div className="grid gap-20 md:grid-cols-12 md:gap-6 md:gap-y-0">
            <Fade delay={0.05} className="md:col-span-7">
              <ProjectItem project={PROJECTS[1]} onOpen={() => setSelected(PROJECTS[1])} />
            </Fade>
            <Fade delay={0.15} className="md:col-span-4 md:col-start-9 md:mt-32">
              <ProjectItem project={PROJECTS[2]} onOpen={() => setSelected(PROJECTS[2])} />
            </Fade>
          </div>

          <div className="grid gap-20 md:grid-cols-12 md:gap-6">
            <Fade delay={0.05} className="md:col-span-4">
              <ProjectItem project={PROJECTS[3]} onOpen={() => setSelected(PROJECTS[3])} />
            </Fade>
            <Fade delay={0.15} className="md:col-span-7 md:col-start-6 md:mt-32">
              <ProjectItem project={PROJECTS[4]} onOpen={() => setSelected(PROJECTS[4])} />
            </Fade>
          </div>
        </div>

        <Fade className="mt-20 md:mt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-smoke">
            Concept work — yours could be next.{" "}
            <button
              onClick={() => scrollToTarget("#contact")}
              className="text-ember underline decoration-ember/40 underline-offset-4 transition-colors hover:decoration-ember"
            >
              Start the conversation
            </button>
          </p>
        </Fade>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

interface ItemProps {
  project: Project;
  onOpen: () => void;
  ratio?: string;
}

function ProjectItem({ project, onOpen, ratio = "aspect-[16/9]" }: ItemProps) {
  const frame = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  /* scroll-linked parallax — the image drifts inside its frame */
  useEffect(() => {
    if (reduced || !frame.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-parallax",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        }
      );
    }, frame);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <article className="group">
      <div className="block w-full text-left">
        {/* preview — image lives in an oversized layer so parallax never shows edges */}
        <div
          onClick={onOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpen();
          }}
          aria-label={`View ${project.name} project details`}
          className={cn("relative block w-full overflow-hidden cursor-pointer", ratio)}
        >
          <span ref={frame} className="work-parallax absolute inset-x-0 -top-[7%] h-[114%] will-change-transform block">
            <img
              src={project.image}
              alt={project.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </span>
          <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
          <span className="absolute left-4 top-4 border border-line bg-ink/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-fog">
            {project.kind}
          </span>
        </div>

        {/* meta — clean row with Visit Now button */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <div
            onClick={onOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpen();
            }}
            className="flex cursor-pointer items-baseline gap-3.5"
          >
            <span className="font-mono text-xs text-ember">({project.index})</span>
            <span className="font-display text-2xl font-semibold uppercase tracking-tight text-paper transition-colors duration-300 group-hover:text-ember md:text-3xl">
              {project.name}
            </span>
            <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-[0.26em] text-smoke sm:inline">
              {project.category} — {project.year}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={project.link || "#"}
              target={project.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                if (!project.link || project.link === "#") {
                  e.preventDefault();
                  onOpen();
                }
              }}
              className="group/btn inline-flex items-center gap-2 border border-ember bg-ember px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-ember"
            >
              Visit now
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
