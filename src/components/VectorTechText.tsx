import React, { useEffect, useRef, useState, useCallback } from "react";

interface LineConfig {
  text: string;
  color: string;
  y: number;
}

const LINES: LineConfig[] = [
  { text: "WE DESIGN", color: "#f5f0ea", y: 88 },
  { text: "THE DIGITAL.", color: "#e85223", y: 188 },
  { text: "WE BUILD", color: "#f5f0ea", y: 288 },
  { text: "WHAT'S NEXT.", color: "#f5f0ea", y: 388 },
];

const ACCENT = "#e85223";
const FONT_SIZE = 92;
const SPRING = 260;
const DAMPING = 18;

interface Speck {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function VectorTechText() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const textRefs = useRef<(SVGTextElement | null)[]>([]);

  // Track active hovered letter: { lineIndex, charIndex }
  const [active, setActive] = useState<{ line: number; char: number } | null>(null);
  const [frameBox, setFrameBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    char: string;
    line: number;
  } | null>(null);

  // Per-letter spring offsets for click kicks
  const offsetsRef = useRef<number[][]>(LINES.map((l) => new Array(l.text.length).fill(0)));
  const velocitiesRef = useRef<number[][]>(LINES.map((l) => new Array(l.text.length).fill(0)));
  const [, setTick] = useState(0);

  // Idle sweep tracking
  const idleRef = useRef(true);
  const sweepIndexRef = useRef(0);
  const sweepTimerRef = useRef<number | null>(null);

  // Dragging state
  const draggingRef = useRef<{ line: number; char: number; startY: number } | null>(null);

  // Generate dynamic specks around frame
  const [specks, setSpecks] = useState<Speck[]>([]);

  // Update character bounding box for the frame
  const updateFrameBox = useCallback((lineIdx: number, charIdx: number) => {
    const textEl = textRefs.current[lineIdx];
    if (!textEl) return;

    try {
      if (typeof textEl.getExtentOfChar === "function") {
        const extent = textEl.getExtentOfChar(charIdx);
        const char = LINES[lineIdx].text[charIdx];
        if (extent && extent.width > 0) {
          setFrameBox({
            x: extent.x,
            y: extent.y,
            w: extent.width,
            h: extent.height,
            char,
            line: lineIdx,
          });

          // Generate 6-8 specks around frame perimeter
          const newSpecks: Speck[] = [];
          for (let i = 0; i < 7; i++) {
            const side = i % 4;
            let sx = extent.x;
            let sy = extent.y;
            if (side === 0) {
              sx += Math.random() * extent.width;
              sy -= 4 + Math.random() * 8;
            } else if (side === 1) {
              sx += extent.width + 4 + Math.random() * 8;
              sy += Math.random() * extent.height;
            } else if (side === 2) {
              sx += Math.random() * extent.width;
              sy += extent.height + 4 + Math.random() * 8;
            } else {
              sx -= 4 + Math.random() * 8;
              sy += Math.random() * extent.height;
            }
            newSpecks.push({
              x: sx,
              y: sy,
              size: Math.random() > 0.4 ? 3 : 2,
              opacity: 0.35 + Math.random() * 0.65,
            });
          }
          setSpecks(newSpecks);
          return;
        }
      }
    } catch {
      // Fallback if extent lookup fails during layout shifts
    }
  }, []);

  // Set active hover
  const handleCharEnter = (lineIdx: number, charIdx: number) => {
    if (LINES[lineIdx].text[charIdx].trim() === "") return;
    idleRef.current = false;
    setActive({ line: lineIdx, char: charIdx });
    updateFrameBox(lineIdx, charIdx);
  };

  const handlePointerLeave = () => {
    if (draggingRef.current) return;
    setActive(null);
    setFrameBox(null);
    setSpecks([]);
    idleRef.current = true;
  };

  // Kick animation on click
  const triggerKick = (lineIdx: number, charIdx: number) => {
    offsetsRef.current[lineIdx][charIdx] = -24;
    velocitiesRef.current[lineIdx][charIdx] = -320;

    // Ripple neighbors
    const lineLen = LINES[lineIdx].text.length;
    if (charIdx > 0) {
      offsetsRef.current[lineIdx][charIdx - 1] = -12;
      velocitiesRef.current[lineIdx][charIdx - 1] = -160;
    }
    if (charIdx < lineLen - 1) {
      offsetsRef.current[lineIdx][charIdx + 1] = -12;
      velocitiesRef.current[lineIdx][charIdx + 1] = -160;
    }
  };

  // Drag handling
  const handlePointerDown = (lineIdx: number, charIdx: number, e: React.PointerEvent) => {
    if (LINES[lineIdx].text[charIdx].trim() === "") return;
    draggingRef.current = { line: lineIdx, char: charIdx, startY: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { line, char, startY } = draggingRef.current;
    const deltaY = e.clientY - startY;
    offsetsRef.current[line][char] = Math.max(-60, Math.min(60, deltaY));
    velocitiesRef.current[line][char] = 0;
    setTick((t) => t + 1);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      const { line, char, startY } = draggingRef.current;
      if (Math.abs(e.clientY - startY) < 4) {
        triggerKick(line, char);
      }
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      draggingRef.current = null;
    }
  };

  // Physics animation loop (Spring simulation)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      let hasMotion = false;
      const offsets = offsetsRef.current;
      const velocities = velocitiesRef.current;

      for (let l = 0; l < offsets.length; l++) {
        for (let c = 0; c < offsets[l].length; c++) {
          if (draggingRef.current && draggingRef.current.line === l && draggingRef.current.char === c) {
            continue;
          }
          const y = offsets[l][c];
          const v = velocities[l][c];
          if (Math.abs(y) > 0.05 || Math.abs(v) > 0.5) {
            hasMotion = true;
            const force = -SPRING * y - DAMPING * v;
            const nextV = v + force * dt;
            const nextY = y + nextV * dt;
            offsets[l][c] = Math.abs(nextY) < 0.05 && Math.abs(nextV) < 0.5 ? 0 : nextY;
            velocities[l][c] = nextV;
          }
        }
      }

      if (hasMotion) {
        setTick((t) => t + 1);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Idle sweep across letters
  useEffect(() => {
    const sweep = () => {
      if (!idleRef.current) return;
      const allChars: { line: number; char: number }[] = [];
      LINES.forEach((line, l) => {
        for (let c = 0; c < line.text.length; c++) {
          if (line.text[c].trim() !== "") {
            allChars.push({ line: l, char: c });
          }
        }
      });

      if (allChars.length === 0) return;
      sweepIndexRef.current = (sweepIndexRef.current + 1) % allChars.length;
      const target = allChars[sweepIndexRef.current];
      setActive(target);
      updateFrameBox(target.line, target.char);
    };

    sweepTimerRef.current = window.setInterval(sweep, 420);
    return () => {
      if (sweepTimerRef.current) clearInterval(sweepTimerRef.current);
    };
  }, [updateFrameBox]);

  // Ensure initial box calculates after fonts settle
  useEffect(() => {
    const t = setTimeout(() => {
      updateFrameBox(1, 0); // "T" in THE DIGITAL
    }, 250);
    return () => clearTimeout(t);
  }, [updateFrameBox]);

  return (
    <div className="relative w-full max-w-[1020px] select-none" onPointerLeave={handlePointerLeave}>
      <svg
        ref={svgRef}
        viewBox="0 0 1020 420"
        className="block h-auto w-full overflow-visible"
        aria-hidden="true"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <defs>
          <filter id="speck-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={ACCENT} floodOpacity="0.8" />
          </filter>
        </defs>

        {LINES.map((line, lIdx) => {
          let charOffsetAccum = 0;
          return (
            <text
              key={lIdx}
              ref={(el) => {
                textRefs.current[lIdx] = el;
              }}
              x="0"
              y={line.y}
              fill={line.color}
              fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
              fontSize={FONT_SIZE}
              fontWeight="700"
              letterSpacing="-0.03em"
              textAnchor="start"
              className="font-display font-bold uppercase"
              style={{
                textRendering: "geometricPrecision",
                shapeRendering: "geometricPrecision",
              }}
            >
              {Array.from(line.text).map((char, cIdx) => {
                const isActive = active?.line === lIdx && active?.char === cIdx;
                const offsetY = offsetsRef.current[lIdx][cIdx] || 0;
                charOffsetAccum++;

                if (char === " ") {
                  return <tspan key={cIdx}> </tspan>;
                }

                return (
                  <tspan
                    key={cIdx}
                    dy={offsetY !== 0 ? offsetY : undefined}
                    fill={isActive ? "none" : line.color}
                    stroke={isActive ? (lIdx === 1 ? ACCENT : line.color) : "none"}
                    strokeWidth={isActive ? 2 : 0}
                    strokeDasharray={isActive ? "4.5 3" : "none"}
                    strokeLinecap="square"
                    className="cursor-pointer transition-colors"
                    onPointerEnter={() => handleCharEnter(lIdx, cIdx)}
                    onPointerDown={(e) => handlePointerDown(lIdx, cIdx, e)}
                    onClick={() => triggerKick(lIdx, cIdx)}
                  >
                    {char}
                  </tspan>
                );
              })}
            </text>
          );
        })}

        {/* ── Precision Vector Selection Frame ──────────────── */}
        {frameBox && (
          <g className="pointer-events-none transition-all duration-75">
            {/* Outer coordinate bounding box */}
            <rect
              x={frameBox.x - 6}
              y={frameBox.y - 6}
              width={frameBox.w + 12}
              height={frameBox.h + 12}
              fill="none"
              stroke={ACCENT}
              strokeWidth="1"
              strokeOpacity="0.55"
            />

            {/* 4 Precision Corner Anchor Squares */}
            <rect x={frameBox.x - 8.5} y={frameBox.y - 8.5} width="5" height="5" fill={ACCENT} />
            <rect x={frameBox.x + frameBox.w + 3.5} y={frameBox.y - 8.5} width="5" height="5" fill={ACCENT} />
            <rect
              x={frameBox.x + frameBox.w + 3.5}
              y={frameBox.y + frameBox.h + 3.5}
              width="5"
              height="5"
              fill={ACCENT}
            />
            <rect x={frameBox.x - 8.5} y={frameBox.y + frameBox.h + 3.5} width="5" height="5" fill={ACCENT} />

            {/* Precision Dimension & Letter Badge (e.g. "T  48 × 72") */}
            <g transform={`translate(${frameBox.x - 6}, ${frameBox.y - 12})`}>
              <rect
                x="-1"
                y="-13"
                width={Math.max(68, frameBox.w + 14)}
                height="15"
                fill="#080808"
                fillOpacity="0.9"
                stroke={ACCENT}
                strokeWidth="0.75"
                strokeOpacity="0.4"
                rx="1"
              />
              <text
                x="4"
                y="-2"
                fill={ACCENT}
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fontWeight="600"
                letterSpacing="0.08em"
              >
                {frameBox.char}&nbsp;&nbsp;{Math.round(frameBox.w)}×{Math.round(frameBox.h)}
              </text>
            </g>

            {/* Tech Specks (Crisp Vector Squares Orbiting Frame) */}
            {specks.map((s, idx) => (
              <rect
                key={idx}
                x={s.x}
                y={s.y}
                width={s.size}
                height={s.size}
                fill={ACCENT}
                opacity={s.opacity}
                filter="url(#speck-glow)"
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export default VectorTechText;

