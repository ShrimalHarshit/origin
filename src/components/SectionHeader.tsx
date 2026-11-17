import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { MaskLine, Fade } from "./Reveal";

interface SectionHeaderProps {
  index: string;
  label: string;
  lines: ReactNode[];
  description?: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Editorial section header — mono index label, masked display lines, intro copy. */
export function SectionHeader({
  index,
  label,
  lines,
  description,
  tone = "dark",
  className,
}: SectionHeaderProps) {
  const isDark = tone === "dark";
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:gap-6", className)}>
      <Fade className="md:col-span-3" y={16}>
        <p
          className={cn(
            "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]",
            isDark ? "text-fog" : "text-smoke"
          )}
        >
          <span className="text-ember">({index})</span>
          <span className={cn("inline-block h-px w-8", isDark ? "bg-line" : "bg-line-dark")} />
          {label}
        </p>
      </Fade>
      <div className="md:col-span-9">
        <h2
          className={cn(
            "font-display font-semibold uppercase leading-[0.98] tracking-[-0.02em]",
            "text-[clamp(2.4rem,5.6vw,5.25rem)]",
            isDark ? "text-paper" : "text-coal"
          )}
        >
          {lines.map((line, i) => (
            <MaskLine key={i} delay={i * 0.09}>
              {line}
            </MaskLine>
          ))}
        </h2>
        {description && (
          <Fade delay={0.25}>
            <p
              className={cn(
                "mt-6 max-w-xl text-base leading-relaxed md:text-lg",
                isDark ? "text-fog" : "text-smoke"
              )}
            >
              {description}
            </p>
          </Fade>
        )}
      </div>
    </div>
  );
}
