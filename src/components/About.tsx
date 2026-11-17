import { PRINCIPLES, PROCESS_MIN } from "../data/content";
import { MaskLine, Fade } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* statement */}
          <div className="lg:col-span-7">
            <Fade y={16}>
              <p className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-fog">
                <span className="text-ember">(03)</span>
                <span className="inline-block h-px w-8 bg-line" />
                The studio
              </p>
            </Fade>

            <h2 className="font-display font-semibold uppercase leading-[1] tracking-[-0.02em] text-paper text-[clamp(2.5rem,5.6vw,5.5rem)]">
              <MaskLine>Small studio.</MaskLine>
              <MaskLine delay={0.1}>
                <span>
                  Serious <span className="text-ember">engineering.</span>
                </span>
              </MaskLine>
            </h2>

            <Fade delay={0.25}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-fog">
                ORIGIN pairs design and engineering to build digital products that look considered
                and work reliably.
              </p>
            </Fade>

            <Fade delay={0.35}>
              <figure className="mt-14">
                <img
                  src="/images/about-mark.jpg"
                  alt="Abstract ORIGIN artwork — an orange circle intersecting an off-white square on a coordinate grid"
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              </figure>
            </Fade>
          </div>

          {/* principles */}
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <div className="border-t border-line">
              {PRINCIPLES.map((p, i) => (
                <Fade key={p.index} delay={i * 0.08}>
                  <div className="border-b border-line py-9">
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-xs text-ember">{p.index}</span>
                      <div>
                        <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-paper md:text-2xl">
                          {p.title}
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog">{p.copy}</p>
                      </div>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* process — one quiet strip */}
      <Fade>
        <div className="mt-24 border-y border-line md:mt-32">
          <ol className="mx-auto grid max-w-[1680px] grid-cols-2 divide-x divide-y divide-line md:grid-cols-4 md:divide-y-0">
            {PROCESS_MIN.map((step) => (
              <li key={step.index} className="flex flex-col gap-2 px-5 py-7 md:px-10 md:py-9">
                <span className="font-mono text-[11px] text-ember">/{step.index}</span>
                <span className="font-display text-lg font-semibold uppercase tracking-tight text-paper md:text-xl">
                  {step.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
                  {step.hint}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Fade>
    </section>
  );
}
