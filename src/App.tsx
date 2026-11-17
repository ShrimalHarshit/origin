import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, destroyLenis } from "./lib/scroll";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { SplashScreen } from "./components/SplashScreen";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { Work } from "./components/Work";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const reduced = useReducedMotion();
  /* reduced-motion users skip the splash entirely */
  const [showSplash, setShowSplash] = useState(() => !reduced);
  const [revealed, setRevealed] = useState(() => reduced);

  /* Lenis smooth scroll, driven by GSAP's ticker so both stay in sync */
  useEffect(() => {
    if (reduced) return;
    const lenis = initLenis();
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(tick);
      destroyLenis();
    };
  }, [reduced]);

  /* recalc triggers once media + fonts have settled */
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <SplashScreen
          onReveal={() => setRevealed(true)}
          onComplete={() => {
            setShowSplash(false);
            /* re-measure all triggers now that the curtain is gone */
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }}
        />
      )}
      <Nav revealed={revealed} />
      <main>
        <Hero play={revealed} />
        <Ticker />
        <Work />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
