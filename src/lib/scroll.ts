import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

export function lockScroll(): void {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll(): void {
  lenis?.start();
  document.documentElement.style.overflow = "";
}

export function scrollToTarget(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: selector === "#top" ? 0 : -64 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
