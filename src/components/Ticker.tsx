import { Asterisk } from "lucide-react";
import { MARQUEE_ITEMS } from "../data/content";

/** Neo-brutalist orange capability strip between hero and work. */
export function Ticker() {
  const row = MARQUEE_ITEMS;
  return (
    <div
      className="overflow-hidden border-y border-ink bg-ember py-3 md:py-3.5"
      aria-hidden="true"
    >
      <div className="flex w-max animate-[marquee_36s_linear_infinite] items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-5 pr-5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink md:text-base"
              >
                {item}
                <Asterisk className="h-5 w-5" strokeWidth={2.5} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
